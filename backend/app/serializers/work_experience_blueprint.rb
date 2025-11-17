# frozen_string_literal: true

class WorkExperienceBlueprint < Blueprinter::Base
  identifier :id

  fields :company, :position, :description, :start_date, :end_date, :candidate_id
end

