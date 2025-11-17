# frozen_string_literal: true

class ResumeBlueprint < Blueprinter::Base
  identifier :id

  fields :file_path, :file_type, :upload_date, :candidate_id
end

