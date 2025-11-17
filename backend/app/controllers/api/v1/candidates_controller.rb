# frozen_string_literal: true

module Api
  module V1
    class CandidatesController < BaseController
      before_action :set_candidate, only: [:show, :update]

      # GET /api/v1/candidates
      def index
        candidates = Candidate.all

        # Search filter
        candidates = candidates.by_name(params[:search]) if params[:search].present?

        # Scope filters
        candidates = candidates.with_education if params[:with_education] == "true"
        candidates = candidates.experienced if params[:experienced] == "true"
        candidates = candidates.by_skill(params[:skill]) if params[:skill].present?
        candidates = candidates.recent_applications if params[:recent_applications] == "true"

        # Sorting
        sort_field = params[:sort] || "first_name"
        sort_order = params[:order] == "desc" ? :desc : :asc
        candidates = candidates.order(sort_field => sort_order)

        # Pagination
        paginated = candidates.page(pagination_params[:page]).per(pagination_params[:per_page])

        render json: {
          data: CandidateBlueprint.render_as_hash(paginated),
          metadata: {
            total: paginated.total_count,
            page: paginated.current_page,
            limit: paginated.limit_value,
            total_pages: paginated.total_pages
          }
        }
      end

      # GET /api/v1/candidates/:id
      def show
        render json: CandidateDetailBlueprint.render(@candidate)
      end

      # POST /api/v1/candidates
      def create
        candidate = Candidate.new(candidate_params)

        if candidate.save
          build_associated_records(candidate)
          render json: CandidateBlueprint.render(candidate), status: :created
        else
          render json: {
            message: "Validation failed",
            error: candidate.errors.full_messages.join(", ")
          }, status: :unprocessable_entity
        end
      end

      # PUT /api/v1/candidates/:id
      def update
        application = Application.find_by(id: params[:applicationId])
        return render json: { message: "Application not found" }, status: :not_found unless application

        if application.update(current_interview_step: params[:currentInterviewStep].to_i)
          render json: {
            message: "Candidate stage updated successfully",
            data: ApplicationBlueprint.render(application)
          }
        else
          render json: {
            message: "Validation failed",
            error: application.errors.full_messages.join(", ")
          }, status: :unprocessable_entity
        end
      end

      # POST /api/v1/candidates/:id/generate_report
      def generate_report
        candidate = Candidate.find(params[:id])
        job = Candidates::ProcessResumeJob.perform_later(candidate.id)

        render json: {
          message: "Report generation started",
          job_id: job.job_id,
          candidate_id: candidate.id
        }, status: :accepted
      rescue ActiveRecord::RecordNotFound
        render json: {
          message: "Record not found",
          error: "Couldn't find Candidate with 'id'=#{params[:id]}"
        }, status: :not_found
      rescue StandardError => e
        Rails.logger.error("Failed to enqueue report generation job: #{e.message}")
        render json: {
          message: "Failed to enqueue report generation job",
          error: e.message
        }, status: :internal_server_error
      end

      # GET /api/v1/candidates/:id/report
      def report
        candidate = Candidate.find(params[:id])
        service = Candidates::GenerateProcessReportService.new
        report_data = service.call(candidate.id)

        render json: report_data, status: :ok
      rescue ActiveRecord::RecordNotFound
        render json: {
          message: "Record not found",
          error: "Couldn't find Candidate with 'id'=#{params[:id]}"
        }, status: :not_found
      rescue StandardError => e
        Rails.logger.error("Failed to generate report: #{e.message}")
        render json: {
          message: "Failed to generate report",
          error: e.message
        }, status: :internal_server_error
      end

      private

      def set_candidate
        @candidate = Candidate.find(params[:id])
      end

      def candidate_params
        params.permit(:first_name, :last_name, :email, :phone, :address,
                       educations: [:institution, :title, :startDate, :endDate, :start_date, :end_date],
                       workExperiences: [:company, :position, :description, :startDate, :endDate, :start_date, :end_date],
                       cv: [:filePath, :file_path, :fileType, :file_type])
      end

      def build_associated_records(candidate)
        # Build educations
        (params[:educations] || []).each do |edu_params|
          candidate.educations.build(
            institution: edu_params[:institution] || edu_params["institution"],
            title: edu_params[:title] || edu_params["title"],
            start_date: parse_date(edu_params[:startDate] || edu_params[:start_date] || edu_params["startDate"] || edu_params["start_date"]),
            end_date: parse_date(edu_params[:endDate] || edu_params[:end_date] || edu_params["endDate"] || edu_params["end_date"])
          )
        end

        # Build work experiences
        (params[:workExperiences] || params[:work_experiences] || []).each do |exp_params|
          candidate.work_experiences.build(
            company: exp_params[:company] || exp_params["company"],
            position: exp_params[:position] || exp_params["position"],
            description: exp_params[:description] || exp_params["description"],
            start_date: parse_date(exp_params[:startDate] || exp_params[:start_date] || exp_params["startDate"] || exp_params["start_date"]),
            end_date: parse_date(exp_params[:endDate] || exp_params[:end_date] || exp_params["endDate"] || exp_params["end_date"])
          )
        end

        # Build resume
        cv_params = params[:cv] || params[:resume]
        if cv_params
          candidate.resumes.build(
            file_path: cv_params[:filePath] || cv_params[:file_path] || cv_params["filePath"] || cv_params["file_path"],
            file_type: cv_params[:fileType] || cv_params[:file_type] || cv_params["fileType"] || cv_params["file_type"],
            upload_date: Time.current
          )
        end

        candidate.save
      end

      def parse_date(date_string)
        return nil unless date_string

        DateTime.parse(date_string.to_s)
      rescue ArgumentError
        nil
      end
    end
  end
end

