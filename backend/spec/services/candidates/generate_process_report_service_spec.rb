# frozen_string_literal: true

require "rails_helper"

RSpec.describe Candidates::GenerateProcessReportService, type: :service do
  describe "#call" do
    let(:service) { described_class.new }
    let(:company) { Company.create!(name: "Test Company") }
    let(:interview_flow) { InterviewFlow.create!(description: "Test Flow") }
    let(:interview_type) { InterviewType.create!(name: "Technical", description: "Tech interview") }
    let(:interview_step) { InterviewStep.create!(name: "Initial Screening", order_index: 0, interview_flow: interview_flow, interview_type: interview_type) }
    let(:position) { Position.create!(company: company, interview_flow: interview_flow, title: "Senior Developer", description: "Senior role", status: "Open", is_visible: true, location: "Madrid", job_description: "Job desc", requirements: "Requirements", responsibilities: "Responsibilities") }
    let(:employee) { Employee.create!(name: "John Recruiter", email: "john@test.com", role: "Recruiter", is_active: true, company: company) }

    context "with valid candidate and complete data" do
      let(:candidate) do
        Candidate.create!(
          first_name: "Alice",
          last_name: "Johnson",
          email: "alice@example.com",
          phone: "612345678",
          address: "Madrid, Spain"
        )
      end

      let!(:education) do
        Education.create!(
          candidate: candidate,
          institution: "Test University",
          title: "Computer Science",
          start_date: 4.years.ago,
          end_date: 1.year.ago
        )
      end

      let!(:work_experience) do
        WorkExperience.create!(
          candidate: candidate,
          company: "Previous Company",
          position: "Developer",
          description: "Worked on Ruby projects",
          start_date: 2.years.ago,
          end_date: 6.months.ago
        )
      end

      let!(:resume) do
        Resume.create!(
          candidate: candidate,
          file_path: "/path/to/resume.pdf",
          file_type: "application/pdf",
          upload_date: 1.week.ago
        )
      end

      let!(:application) do
        Application.create!(
          candidate: candidate,
          position: position,
          interview_step: interview_step,
          application_date: 1.week.ago,
          current_interview_step: 0
        )
      end

      let!(:interview) do
        Interview.create!(
          application: application,
          interview_step: interview_step,
          employee: employee,
          interview_date: 3.days.ago,
          score: 85,
          result: "Passed",
          notes: "Good candidate"
        )
      end

      it "generates a complete report with all candidate data" do
        report = service.call(candidate.id)

        expect(report).to be_a(Hash)
        expect(report[:candidate]).to include(
          id: candidate.id,
          full_name: "Alice Johnson",
          email: "alice@example.com",
          phone: "612345678",
          address: "Madrid, Spain"
        )
      end

      it "includes summary statistics" do
        report = service.call(candidate.id)

        expect(report[:summary]).to include(
          total_applications: 1,
          total_interviews: 1,
          average_score: 85.0
        )
        expect(report[:summary][:applications_by_status]).to include("Open" => 1)
      end

      it "includes all applications with interview data" do
        report = service.call(candidate.id)

        expect(report[:applications]).to be_an(Array)
        expect(report[:applications].length).to eq(1)
        expect(report[:applications].first).to include(
          id: application.id,
          application_date: application.application_date.iso8601,
          current_interview_step: 0
        )
        expect(report[:applications].first[:position]).to include(
          id: position.id,
          title: "Senior Developer",
          company: "Test Company"
        )
        expect(report[:applications].first[:interviews]).to be_an(Array)
        expect(report[:applications].first[:interviews].first).to include(
          score: 85,
          result: "Passed"
        )
      end

      it "includes education data" do
        report = service.call(candidate.id)

        expect(report[:education]).to be_an(Array)
        expect(report[:education].first).to include(
          institution: "Test University",
          title: "Computer Science"
        )
      end

      it "includes work experience data" do
        report = service.call(candidate.id)

        expect(report[:work_experience]).to be_an(Array)
        expect(report[:work_experience].first).to include(
          company: "Previous Company",
          position: "Developer"
        )
      end

      it "includes resume data" do
        report = service.call(candidate.id)

        expect(report[:resumes]).to be_an(Array)
        expect(report[:resumes].first).to include(
          file_path: "/path/to/resume.pdf",
          file_type: "application/pdf"
        )
      end

      it "includes generated_at timestamp" do
        report = service.call(candidate.id)

        expect(report[:generated_at]).to be_a(String)
        expect { Time.iso8601(report[:generated_at]) }.not_to raise_error
      end

      it "uses eager loading to prevent N+1 queries" do
        query_count = 0
        callback = lambda do |_name, _start, _finish, _id, payload|
          query_count += 1 if payload[:sql].match?(/SELECT/i)
        end

        ActiveSupport::Notifications.subscribed(callback, "sql.active_record") do
          service.call(candidate.id)
        end

        # Should use eager loading, so query count should be reasonable (not N+1)
        # With eager loading, we expect: 1 for candidate, 1 for educations, 1 for work_experiences,
        # 1 for resumes, 1 for applications, 1 for positions, 1 for interview_steps,
        # 1 for interviews, 1 for employees, 1 for companies
        expect(query_count).to be < 15
      end
    end

    context "with candidate that has no applications" do
      let(:candidate) do
        Candidate.create!(
          first_name: "Bob",
          last_name: "Smith",
          email: "bob@example.com"
        )
      end

      it "generates report with zero statistics" do
        report = service.call(candidate.id)

        expect(report[:summary]).to include(
          total_applications: 0,
          total_interviews: 0,
          average_score: 0.0
        )
        expect(report[:applications]).to be_empty
      end
    end

    context "with candidate that has no interviews" do
      let(:candidate) do
        Candidate.create!(
          first_name: "Carol",
          last_name: "Williams",
          email: "carol@example.com"
        )
      end

      let!(:application) do
        Application.create!(
          candidate: candidate,
          position: position,
          interview_step: interview_step,
          application_date: 1.week.ago,
          current_interview_step: 0
        )
      end

      it "calculates average score as zero when no interviews exist" do
        report = service.call(candidate.id)

        expect(report[:summary][:average_score]).to eq(0.0)
        expect(report[:applications].first[:average_score]).to eq(0.0)
      end
    end

    context "with candidate that has partial data" do
      let(:candidate) do
        Candidate.create!(
          first_name: "David",
          last_name: "Brown",
          email: "david@example.com"
          # No phone or address
        )
      end

      it "handles missing optional fields gracefully" do
        report = service.call(candidate.id)

        expect(report[:candidate][:phone]).to be_nil
        expect(report[:candidate][:address]).to be_nil
      end
    end

    context "with invalid candidate ID" do
      it "raises ActiveRecord::RecordNotFound" do
        expect do
          service.call(999_999)
        end.to raise_error(ActiveRecord::RecordNotFound)
      end
    end

    context "with multiple applications and interviews" do
      let(:candidate) do
        Candidate.create!(
          first_name: "Eve",
          last_name: "Davis",
          email: "eve@example.com"
        )
      end

      let(:position2) { Position.create!(company: company, interview_flow: interview_flow, title: "Junior Developer", description: "Junior role", status: "Open", is_visible: true, location: "Barcelona", job_description: "Job desc", requirements: "Requirements", responsibilities: "Responsibilities") }

      let!(:application1) do
        Application.create!(
          candidate: candidate,
          position: position,
          interview_step: interview_step,
          application_date: 2.weeks.ago,
          current_interview_step: 1
        )
      end

      let!(:application2) do
        Application.create!(
          candidate: candidate,
          position: position2,
          interview_step: interview_step,
          application_date: 1.week.ago,
          current_interview_step: 0
        )
      end

      let!(:interview1) do
        Interview.create!(
          application: application1,
          interview_step: interview_step,
          employee: employee,
          interview_date: 1.week.ago,
          score: 80,
          result: "Passed"
        )
      end

      let!(:interview2) do
        Interview.create!(
          application: application1,
          interview_step: interview_step,
          employee: employee,
          interview_date: 3.days.ago,
          score: 90,
          result: "Passed"
        )
      end

      it "calculates correct average score across all interviews" do
        report = service.call(candidate.id)

        expect(report[:summary][:total_applications]).to eq(2)
        expect(report[:summary][:total_interviews]).to eq(2)
        expect(report[:summary][:average_score]).to eq(85.0) # (80 + 90) / 2
      end

      it "includes all applications in the report" do
        report = service.call(candidate.id)

        expect(report[:applications].length).to eq(2)
        expect(report[:applications].map { |app| app[:position][:title] }).to contain_exactly("Senior Developer", "Junior Developer")
      end
    end
  end
end

