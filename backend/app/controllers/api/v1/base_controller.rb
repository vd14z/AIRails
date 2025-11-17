# frozen_string_literal: true

module Api
  module V1
    class BaseController < ApplicationController
      include ActionController::MimeResponds

      rescue_from ActiveRecord::RecordNotFound, with: :record_not_found
      rescue_from ActiveRecord::RecordInvalid, with: :record_invalid
      rescue_from ArgumentError, with: :bad_request

      private

      def record_not_found(exception)
        render json: {
          message: "Record not found",
          error: exception.message
        }, status: :not_found
      end

      def record_invalid(exception)
        render json: {
          message: "Validation failed",
          error: exception.record.errors.full_messages.join(", ")
        }, status: :unprocessable_entity
      end

      def bad_request(exception)
        render json: {
          message: "Bad request",
          error: exception.message
        }, status: :bad_request
      end

      def pagination_params
        {
          page: params[:page] || 1,
          per_page: [params[:limit]&.to_i || 10, 100].min
        }
      end
    end
  end
end

