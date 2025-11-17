# frozen_string_literal: true

module Candidates
  class CreateCandidateService
    include Dry::Monads[:result, :do]

    def call(params)
      candidate = yield build_candidate(params)
      yield validate_candidate(candidate)
      yield save_candidate(candidate)
      Success(candidate)
    end

    private

    def build_candidate(params)
      candidate = Candidate.new(
        first_name: params[:first_name],
        last_name: params[:last_name],
        email: params[:email],
        phone: params[:phone],
        address: params[:address]
      )

      build_educations(candidate, params[:educations]) if params[:educations]
      build_work_experiences(candidate, params[:work_experiences]) if params[:work_experiences]
      build_resume(candidate, params[:cv]) if params[:cv]

      Success(candidate)
    end

    def validate_candidate(candidate)
      return Success() if candidate.valid?

      Failure(candidate.errors.full_messages.join(", "))
    end

    def save_candidate(candidate)
      return Success() if candidate.save

      Failure(candidate.errors.full_messages.join(", "))
    end

    def build_educations(candidate, educations_params)
      educations_params.each do |edu_params|
        candidate.educations.build(
          institution: edu_params[:institution],
          title: edu_params[:title],
          start_date: parse_date(edu_params[:start_date] || edu_params[:startDate]),
          end_date: parse_date(edu_params[:end_date] || edu_params[:endDate])
        )
      end
    end

    def build_work_experiences(candidate, experiences_params)
      experiences_params.each do |exp_params|
        candidate.work_experiences.build(
          company: exp_params[:company],
          position: exp_params[:position],
          description: exp_params[:description],
          start_date: parse_date(exp_params[:start_date] || exp_params[:startDate]),
          end_date: parse_date(exp_params[:end_date] || exp_params[:endDate])
        )
      end
    end

    def build_resume(candidate, resume_params)
      candidate.resumes.build(
        file_path: resume_params[:file_path] || resume_params[:filePath],
        file_type: resume_params[:file_type] || resume_params[:fileType],
        upload_date: Time.current
      )
    end

    def parse_date(date_string)
      return nil unless date_string

      DateTime.parse(date_string.to_s)
    rescue ArgumentError
      nil
    end
  end
end

