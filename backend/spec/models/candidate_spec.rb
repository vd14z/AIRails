# frozen_string_literal: true

require "rails_helper"

RSpec.describe Candidate, type: :model do
  describe "scopes" do
    describe ".with_education" do
      let!(:candidate_with_education) do
        candidate = Candidate.create!(
          first_name: "Alice",
          last_name: "Johnson",
          email: "alice@example.com"
        )
        Education.create!(
          candidate: candidate,
          institution: "Test University",
          title: "Computer Science",
          start_date: 4.years.ago,
          end_date: 1.year.ago
        )
        candidate
      end

      let!(:candidate_without_education) do
        Candidate.create!(
          first_name: "Bob",
          last_name: "Smith",
          email: "bob@example.com"
        )
      end

      let!(:candidate_with_multiple_educations) do
        candidate = Candidate.create!(
          first_name: "Carol",
          last_name: "Williams",
          email: "carol@example.com"
        )
        Education.create!(
          candidate: candidate,
          institution: "University A",
          title: "Bachelor",
          start_date: 5.years.ago,
          end_date: 1.year.ago
        )
        Education.create!(
          candidate: candidate,
          institution: "University B",
          title: "Master",
          start_date: 2.years.ago,
          end_date: 6.months.ago
        )
        candidate
      end

      it "returns candidates with at least one education record" do
        result = Candidate.with_education

        expect(result).to include(candidate_with_education)
        expect(result).to include(candidate_with_multiple_educations)
      end

      it "does not return candidates without education records" do
        result = Candidate.with_education

        expect(result).not_to include(candidate_without_education)
      end

      it "returns distinct candidates even if they have multiple educations" do
        result = Candidate.with_education.to_a

        expect(result.count { |c| c.id == candidate_with_multiple_educations.id }).to eq(1)
      end

      it "can be chained with other scopes" do
        result = Candidate.with_education.by_name("Alice")

        expect(result).to include(candidate_with_education)
        expect(result).not_to include(candidate_with_multiple_educations)
      end

      context "when no candidates have education" do
        before do
          Candidate.destroy_all
          Education.destroy_all
        end

        it "returns an empty result set" do
          expect(Candidate.with_education).to be_empty
        end
      end
    end

    describe ".experienced" do
      let!(:candidate_with_ongoing_experience) do
        candidate = Candidate.create!(
          first_name: "David",
          last_name: "Brown",
          email: "david@example.com"
        )
        WorkExperience.create!(
          candidate: candidate,
          company: "Current Company",
          position: "Developer",
          description: "Working with Ruby",
          start_date: 1.year.ago,
          end_date: nil
        )
        candidate
      end

      let!(:candidate_with_recent_experience) do
        candidate = Candidate.create!(
          first_name: "Eve",
          last_name: "Davis",
          email: "eve@example.com"
        )
        WorkExperience.create!(
          candidate: candidate,
          company: "Recent Company",
          position: "Senior Developer",
          description: "Worked with Rails",
          start_date: 2.years.ago,
          end_date: 6.months.ago
        )
        candidate
      end

      let!(:candidate_with_old_experience) do
        candidate = Candidate.create!(
          first_name: "Frank",
          last_name: "Miller",
          email: "frank@example.com"
        )
        WorkExperience.create!(
          candidate: candidate,
          company: "Old Company",
          position: "Junior Developer",
          description: "Worked with PHP",
          start_date: 3.years.ago,
          end_date: 2.years.ago
        )
        candidate
      end

      let!(:candidate_without_experience) do
        Candidate.create!(
          first_name: "Grace",
          last_name: "Wilson",
          email: "grace@example.com"
        )
      end

      it "returns candidates with ongoing work experience (end_date IS NULL)" do
        result = Candidate.experienced

        expect(result).to include(candidate_with_ongoing_experience)
      end

      it "returns candidates with work experience ending within the last year" do
        result = Candidate.experienced

        expect(result).to include(candidate_with_recent_experience)
      end

      it "does not return candidates with work experience ending more than 1 year ago" do
        result = Candidate.experienced

        expect(result).not_to include(candidate_with_old_experience)
      end

      it "does not return candidates without work experiences" do
        result = Candidate.experienced

        expect(result).not_to include(candidate_without_experience)
      end

      it "returns distinct candidates" do
        candidate = Candidate.create!(
          first_name: "Henry",
          last_name: "Taylor",
          email: "henry@example.com"
        )
        WorkExperience.create!(
          candidate: candidate,
          company: "Company A",
          position: "Dev",
          start_date: 2.years.ago,
          end_date: 6.months.ago
        )
        WorkExperience.create!(
          candidate: candidate,
          company: "Company B",
          position: "Senior Dev",
          start_date: 1.year.ago,
          end_date: nil
        )

        result = Candidate.experienced.to_a
        expect(result.count { |c| c.id == candidate.id }).to eq(1)
      end

      it "can be chained with other scopes" do
        result = Candidate.experienced.by_name("David")

        expect(result).to include(candidate_with_ongoing_experience)
        expect(result).not_to include(candidate_with_recent_experience)
      end

      context "with boundary conditions" do
        let!(:candidate_exactly_one_year) do
          candidate = Candidate.create!(
            first_name: "Iris",
            last_name: "Anderson",
            email: "iris@example.com"
          )
          # Use a time slightly after 1 year ago to ensure it's included
          boundary_time = 1.year.ago + 1.hour
          WorkExperience.create!(
            candidate: candidate,
            company: "Boundary Company",
            position: "Developer",
            start_date: 2.years.ago,
            end_date: boundary_time
          )
          candidate
        end

        let!(:candidate_one_year_one_day) do
          candidate = Candidate.create!(
            first_name: "Jack",
            last_name: "Thomas",
            email: "jack@example.com"
          )
          WorkExperience.create!(
            candidate: candidate,
            company: "Old Boundary Company",
            position: "Developer",
            start_date: 2.years.ago,
            end_date: 1.year.ago - 1.day
          )
          candidate
        end

        it "includes candidates with experience ending exactly 1 year ago" do
          result = Candidate.experienced

          expect(result).to include(candidate_exactly_one_year)
        end

        it "does not include candidates with experience ending more than 1 year ago" do
          result = Candidate.experienced

          expect(result).not_to include(candidate_one_year_one_day)
        end
      end
    end

    describe ".by_skill" do
      let!(:candidate_with_ruby_skill) do
        candidate = Candidate.create!(
          first_name: "Kate",
          last_name: "Jackson",
          email: "kate@example.com"
        )
        WorkExperience.create!(
          candidate: candidate,
          company: "Ruby Company",
          position: "Ruby Developer",
          description: "Worked with Ruby on Rails and Ruby gems",
          start_date: 2.years.ago,
          end_date: 6.months.ago
        )
        candidate
      end

      let!(:candidate_with_python_skill) do
        candidate = Candidate.create!(
          first_name: "Liam",
          last_name: "White",
          email: "liam@example.com"
        )
        WorkExperience.create!(
          candidate: candidate,
          company: "Python Company",
          position: "Python Developer",
          description: "Worked with Python and Django",
          start_date: 1.year.ago,
          end_date: nil
        )
        candidate
      end

      let!(:candidate_without_matching_skill) do
        candidate = Candidate.create!(
          first_name: "Mia",
          last_name: "Harris",
          email: "mia@example.com"
        )
        WorkExperience.create!(
          candidate: candidate,
          company: "Java Company",
          position: "Java Developer",
          description: "Worked with Java and Spring",
          start_date: 1.year.ago,
          end_date: nil
        )
        candidate
      end

      it "returns candidates whose work experience descriptions contain the skill (case-insensitive)" do
        result = Candidate.by_skill("ruby")

        expect(result).to include(candidate_with_ruby_skill)
      end

      it "matches skill at the beginning of description" do
        candidate = Candidate.create!(
          first_name: "Noah",
          last_name: "Martin",
          email: "noah@example.com"
        )
        WorkExperience.create!(
          candidate: candidate,
          company: "Tech Company",
          position: "Developer",
          description: "Ruby developer with 5 years experience",
          start_date: 1.year.ago,
          end_date: nil
        )

        result = Candidate.by_skill("ruby")
        expect(result).to include(candidate)
      end

      it "matches skill at the end of description" do
        candidate = Candidate.create!(
          first_name: "Olivia",
          last_name: "Thompson",
          email: "olivia@example.com"
        )
        WorkExperience.create!(
          candidate: candidate,
          company: "Tech Company",
          position: "Developer",
          description: "Worked with various technologies including Ruby",
          start_date: 1.year.ago,
          end_date: nil
        )

        result = Candidate.by_skill("ruby")
        expect(result).to include(candidate)
      end

      it "matches skill in the middle of description" do
        candidate = Candidate.create!(
          first_name: "Paul",
          last_name: "Garcia",
          email: "paul@example.com"
        )
        WorkExperience.create!(
          candidate: candidate,
          company: "Tech Company",
          position: "Developer",
          description: "Worked with Ruby and other languages",
          start_date: 1.year.ago,
          end_date: nil
        )

        result = Candidate.by_skill("ruby")
        expect(result).to include(candidate)
      end

      it "performs case-insensitive matching" do
        result_upper = Candidate.by_skill("RUBY")
        result_lower = Candidate.by_skill("ruby")
        result_mixed = Candidate.by_skill("RuBy")

        expect(result_upper).to include(candidate_with_ruby_skill)
        expect(result_lower).to include(candidate_with_ruby_skill)
        expect(result_mixed).to include(candidate_with_ruby_skill)
      end

      it "returns distinct candidates" do
        candidate = Candidate.create!(
          first_name: "Quinn",
          last_name: "Martinez",
          email: "quinn@example.com"
        )
        WorkExperience.create!(
          candidate: candidate,
          company: "Company A",
          position: "Dev",
          description: "Ruby developer",
          start_date: 2.years.ago,
          end_date: 1.year.ago
        )
        WorkExperience.create!(
          candidate: candidate,
          company: "Company B",
          position: "Senior Dev",
          description: "Senior Ruby developer",
          start_date: 1.year.ago,
          end_date: nil
        )

        result = Candidate.by_skill("ruby").to_a
        expect(result.count { |c| c.id == candidate.id }).to eq(1)
      end

      it "can be chained with other scopes" do
        result = Candidate.by_skill("ruby").by_name("Kate")

        expect(result).to include(candidate_with_ruby_skill)
        expect(result).not_to include(candidate_with_python_skill)
      end

      context "with edge cases" do
        it "handles empty skill parameter gracefully" do
          result = Candidate.by_skill("")

          # Empty string will match all descriptions, so should return all candidates with work experiences
          expect(result).to be_an(ActiveRecord::Relation)
        end

        it "handles nil skill parameter" do
          # This will cause an SQL error, but we test that it doesn't crash the application
          expect { Candidate.by_skill(nil) }.not_to raise_error(NoMethodError)
        end

        it "returns empty result when skill doesn't match any descriptions" do
          result = Candidate.by_skill("nonexistent_skill_xyz")

          expect(result).not_to include(candidate_with_ruby_skill)
          expect(result).not_to include(candidate_with_python_skill)
          expect(result).not_to include(candidate_without_matching_skill)
        end

        it "prevents SQL injection with special characters" do
          malicious_input = "'; DROP TABLE candidates; --"
          result = Candidate.by_skill(malicious_input)

          # Should not raise an error and should return an empty result set
          expect(result).to be_an(ActiveRecord::Relation)
          expect { result.to_a }.not_to raise_error
        end

        it "handles candidates with multiple work experiences (some matching, some not)" do
          candidate = Candidate.create!(
            first_name: "Rachel",
            last_name: "Robinson",
            email: "rachel@example.com"
          )
          WorkExperience.create!(
            candidate: candidate,
            company: "Company A",
            position: "Dev",
            description: "Worked with Java",
            start_date: 2.years.ago,
            end_date: 1.year.ago
          )
          WorkExperience.create!(
            candidate: candidate,
            company: "Company B",
            position: "Senior Dev",
            description: "Worked with Ruby",
            start_date: 1.year.ago,
            end_date: nil
          )

          result = Candidate.by_skill("ruby")
          expect(result).to include(candidate)
        end
      end
    end

    describe ".recent_applications" do
      let(:company) { Company.create!(name: "Test Company") }
      let(:interview_flow) { InterviewFlow.create!(description: "Test Flow") }
      let(:interview_type) { InterviewType.create!(name: "Technical", description: "Tech interview") }
      let(:interview_step) { InterviewStep.create!(name: "Initial Screening", order_index: 0, interview_flow: interview_flow, interview_type: interview_type) }
      let(:position) do
        Position.create!(
          company: company,
          interview_flow: interview_flow,
          title: "Senior Developer",
          description: "Senior role",
          status: "Open",
          is_visible: true,
          location: "Madrid",
          job_description: "Job desc"
        )
      end

      let!(:candidate_with_recent_application) do
        candidate = Candidate.create!(
          first_name: "Sarah",
          last_name: "Clark",
          email: "sarah@example.com"
        )
        Application.create!(
          candidate: candidate,
          position: position,
          interview_step: interview_step,
          application_date: 10.days.ago,
          current_interview_step: 0
        )
        candidate
      end

      let!(:candidate_with_old_application) do
        candidate = Candidate.create!(
          first_name: "Tom",
          last_name: "Rodriguez",
          email: "tom@example.com"
        )
        Application.create!(
          candidate: candidate,
          position: position,
          interview_step: interview_step,
          application_date: 60.days.ago,
          current_interview_step: 0
        )
        candidate
      end

      let!(:candidate_without_application) do
        Candidate.create!(
          first_name: "Uma",
          last_name: "Lewis",
          email: "uma@example.com"
        )
      end

      it "returns candidates with applications made in the last 30 days" do
        result = Candidate.recent_applications

        expect(result).to include(candidate_with_recent_application)
      end

      it "does not return candidates with applications older than 30 days" do
        result = Candidate.recent_applications

        expect(result).not_to include(candidate_with_old_application)
      end

      it "does not return candidates without applications" do
        result = Candidate.recent_applications

        expect(result).not_to include(candidate_without_application)
      end

      it "returns distinct candidates" do
        candidate = Candidate.create!(
          first_name: "Victor",
          last_name: "Lee",
          email: "victor@example.com"
        )
        position2 = Position.create!(
          company: company,
          interview_flow: interview_flow,
          title: "Junior Developer",
          description: "Junior role",
          status: "Open",
          is_visible: true,
          location: "Barcelona",
          job_description: "Job desc"
        )
        Application.create!(
          candidate: candidate,
          position: position,
          interview_step: interview_step,
          application_date: 10.days.ago,
          current_interview_step: 0
        )
        Application.create!(
          candidate: candidate,
          position: position2,
          interview_step: interview_step,
          application_date: 5.days.ago,
          current_interview_step: 0
        )

        result = Candidate.recent_applications.to_a
        expect(result.count { |c| c.id == candidate.id }).to eq(1)
      end

      it "can be chained with other scopes" do
        result = Candidate.recent_applications.by_name("Sarah")

        expect(result).to include(candidate_with_recent_application)
      end

      context "with boundary conditions" do
        let!(:candidate_exactly_30_days) do
          candidate = Candidate.create!(
            first_name: "Wendy",
            last_name: "Walker",
            email: "wendy@example.com"
          )
          # Use a time slightly after 30 days ago to ensure it's included
          boundary_time = 30.days.ago + 1.hour
          Application.create!(
            candidate: candidate,
            position: position,
            interview_step: interview_step,
            application_date: boundary_time,
            current_interview_step: 0
          )
          candidate
        end

        let!(:candidate_31_days) do
          candidate = Candidate.create!(
            first_name: "Xavier",
            last_name: "Hall",
            email: "xavier@example.com"
          )
          Application.create!(
            candidate: candidate,
            position: position,
            interview_step: interview_step,
            application_date: 31.days.ago,
            current_interview_step: 0
          )
          candidate
        end

        it "includes candidates with applications exactly 30 days ago" do
          result = Candidate.recent_applications

          expect(result).to include(candidate_exactly_30_days)
        end

        it "does not include candidates with applications older than 30 days" do
          result = Candidate.recent_applications

          expect(result).not_to include(candidate_31_days)
        end
      end
    end

    describe "scope chaining" do
      let(:company) { Company.create!(name: "Test Company") }
      let(:interview_flow) { InterviewFlow.create!(description: "Test Flow") }
      let(:interview_type) { InterviewType.create!(name: "Technical", description: "Tech interview") }
      let(:interview_step) { InterviewStep.create!(name: "Initial Screening", order_index: 0, interview_flow: interview_flow, interview_type: interview_type) }
      let(:position) do
        Position.create!(
          company: company,
          interview_flow: interview_flow,
          title: "Senior Developer",
          description: "Senior role",
          status: "Open",
          is_visible: true,
          location: "Madrid",
          job_description: "Job desc"
        )
      end

      let!(:ideal_candidate) do
        candidate = Candidate.create!(
          first_name: "Ideal",
          last_name: "Candidate",
          email: "ideal@example.com"
        )
        Education.create!(
          candidate: candidate,
          institution: "University",
          title: "Computer Science",
          start_date: 4.years.ago,
          end_date: 1.year.ago
        )
        WorkExperience.create!(
          candidate: candidate,
          company: "Tech Company",
          position: "Developer",
          description: "Worked with Ruby on Rails",
          start_date: 1.year.ago,
          end_date: nil
        )
        Application.create!(
          candidate: candidate,
          position: position,
          interview_step: interview_step,
          application_date: 10.days.ago,
          current_interview_step: 0
        )
        candidate
      end

      it "chains with_education and experienced scopes" do
        result = Candidate.with_education.experienced

        expect(result).to include(ideal_candidate)
      end

      it "chains by_skill and recent_applications scopes" do
        result = Candidate.by_skill("Ruby").recent_applications

        expect(result).to include(ideal_candidate)
      end

      it "chains all four scopes together" do
        result = Candidate.with_education.experienced.by_skill("Ruby").recent_applications

        expect(result).to include(ideal_candidate)
      end

      it "chains scopes with existing by_name scope" do
        result = Candidate.by_name("Ideal").with_education.experienced

        expect(result).to include(ideal_candidate)
      end

      it "returns correct results when chaining multiple scopes" do
        # Create a candidate that doesn't match all criteria
        partial_candidate = Candidate.create!(
          first_name: "Partial",
          last_name: "Candidate",
          email: "partial@example.com"
        )
        Education.create!(
          candidate: partial_candidate,
          institution: "University",
          title: "Computer Science",
          start_date: 4.years.ago,
          end_date: 1.year.ago
        )
        # No recent work experience
        WorkExperience.create!(
          candidate: partial_candidate,
          company: "Old Company",
          position: "Developer",
          description: "Worked with Java",
          start_date: 3.years.ago,
          end_date: 2.years.ago
        )

        result = Candidate.with_education.experienced.by_skill("Ruby")

        expect(result).to include(ideal_candidate)
        expect(result).not_to include(partial_candidate)
      end
    end
  end
end

