# frozen_string_literal: true

module Candidates
  class GenerateProcessReportService
    def call(candidate_id)
      candidate = load_candidate(candidate_id)
      generate_report(candidate)
    rescue ActiveRecord::RecordNotFound => e
      Rails.logger.error("Candidate not found: #{candidate_id}")
      raise e
    rescue StandardError => e
      Rails.logger.error("Error generating report for candidate #{candidate_id}: #{e.message}")
      raise e
    end

    private

    def load_candidate(candidate_id)
      Candidate.includes(
        :educations,
        :work_experiences,
        :resumes,
        applications: [:position, :interview_step, interviews: [:interview_step, :employee]]
      ).find(candidate_id)
    end

    def generate_report(candidate)
      {
        candidate: candidate_data(candidate),
        summary: summary_data(candidate),
        applications: applications_data(candidate),
        education: education_data(candidate),
        work_experience: work_experience_data(candidate),
        resumes: resumes_data(candidate),
        generated_at: Time.current.iso8601
      }
    end

    def candidate_data(candidate)
      {
        id: candidate.id,
        full_name: candidate.full_name,
        email: candidate.email,
        phone: candidate.phone,
        address: candidate.address
      }
    end

    def summary_data(candidate)
      all_interviews = candidate.applications.flat_map(&:interviews)
      interview_scores = all_interviews.filter_map(&:score)
      applications_by_status = candidate.applications.group_by { |app| app.position.status }.transform_values(&:count)

      {
        total_applications: candidate.applications.count,
        total_interviews: all_interviews.count,
        average_score: interview_scores.any? ? (interview_scores.sum.to_f / interview_scores.count).round(2) : 0.0,
        applications_by_status: applications_by_status,
        current_applications: candidate.applications.count { |app| app.position.status == "Open" }
      }
    end

    def applications_data(candidate)
      candidate.applications.map do |application|
        {
          id: application.id,
          position: {
            id: application.position.id,
            title: application.position.title,
            company: application.position.company.name,
            status: application.position.status,
            location: application.position.location
          },
          application_date: application.application_date.iso8601,
          current_interview_step: application.current_interview_step,
          interview_step_name: application.interview_step.name,
          interviews: interviews_data(application),
          average_score: application.average_score
        }
      end
    end

    def interviews_data(application)
      application.interviews.map do |interview|
        {
          id: interview.id,
          interview_date: interview.interview_date.iso8601,
          interview_step: interview.interview_step.name,
          score: interview.score,
          result: interview.result,
          notes: interview.notes,
          employee: interview.employee.name
        }
      end
    end

    def education_data(candidate)
      candidate.educations.map do |education|
        {
          id: education.id,
          institution: education.institution,
          title: education.title,
          start_date: education.start_date.iso8601,
          end_date: education.end_date&.iso8601
        }
      end
    end

    def work_experience_data(candidate)
      candidate.work_experiences.map do |experience|
        {
          id: experience.id,
          company: experience.company,
          position: experience.position,
          description: experience.description,
          start_date: experience.start_date.iso8601,
          end_date: experience.end_date&.iso8601
        }
      end
    end

    def resumes_data(candidate)
      candidate.resumes.map do |resume|
        {
          id: resume.id,
          file_path: resume.file_path,
          file_type: resume.file_type,
          upload_date: resume.upload_date.iso8601
        }
      end
    end
  end
end

