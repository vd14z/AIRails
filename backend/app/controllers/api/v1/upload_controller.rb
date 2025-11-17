# frozen_string_literal: true

module Api
  module V1
    class UploadController < BaseController
      # POST /api/v1/upload
      def create
        file = params[:file]
        return render json: { message: "File is required" }, status: :bad_request unless file

        # Validate file type
        allowed_types = %w[application/pdf application/vnd.openxmlformats-officedocument.wordprocessingml.document]
        unless allowed_types.include?(file.content_type)
          return render json: { message: "Invalid file type. Only PDF and DOCX are allowed" }, status: :bad_request
        end

        # Validate file size (10MB max)
        if file.size > 10.megabytes
          return render json: { message: "File size exceeds 10MB limit" }, status: :bad_request
        end

        # Save file (simplified - in production use Shrine or Active Storage)
        file_path = Rails.root.join("storage", "uploads", "#{SecureRandom.uuid}_#{file.original_filename}")
        FileUtils.mkdir_p(File.dirname(file_path))
        File.binwrite(file_path, file.read)

        render json: {
          filePath: file_path.to_s,
          fileType: file.content_type
        }
      end
    end
  end
end

