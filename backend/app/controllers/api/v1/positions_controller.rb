# frozen_string_literal: true

module Api
  module V1
    class PositionsController < BaseController
      before_action :set_position, only: [:show, :update, :candidates, :candidate_names, :interview_flow]

      # GET /api/v1/positions
      def index
        positions = Position.visible
        render json: PositionBlueprint.render_as_hash(positions)
      end

      # GET /api/v1/positions/:id
      def show
        render json: PositionBlueprint.render(@position)
      end

      # PUT /api/v1/positions/:id
      def update
        if @position.update(position_params)
          render json: {
            message: "Position updated successfully",
            data: PositionBlueprint.render(@position)
          }
        else
          render json: {
            message: "Validation failed",
            error: @position.errors.full_messages.join(", ")
          }, status: :unprocessable_entity
        end
      end

      # GET /api/v1/positions/:id/candidates
      def candidates
        applications = @position.applications.includes(:candidate, :interview_step)
        candidates_data = applications.map do |app|
          {
            fullName: app.candidate.full_name,
            currentInterviewStep: app.interview_step.name,
            candidateId: app.candidate.id,
            applicationId: app.id,
            averageScore: app.average_score
          }
        end
        render json: candidates_data
      end

      # GET /api/v1/positions/:id/candidates/names
      def candidate_names
        candidates_data = @position.applications.includes(:candidate).map do |app|
          {
            candidateId: app.candidate.id,
            fullName: app.candidate.full_name
          }
        end
        render json: candidates_data
      end

      # GET /api/v1/positions/:id/interviewflow
      def interview_flow
        render json: {
          interviewFlow: {
            positionName: @position.title,
            interviewFlow: InterviewFlowBlueprint.render(@position.interview_flow)
          }
        }
      end

      private

      def set_position
        @position = Position.find(params[:id])
      end

      def position_params
        params.permit(
          :company_id, :interview_flow_id, :title, :description, :status,
          :is_visible, :location, :job_description, :requirements,
          :responsibilities, :salary_min, :salary_max, :employment_type,
          :benefits, :company_description, :application_deadline, :contact_info
        )
      end
    end
  end
end

