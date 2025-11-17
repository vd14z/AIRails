# frozen_string_literal: true

class ApplicationBlueprint < Blueprinter::Base
  identifier :id

  fields :candidate_id, :position_id, :application_date, :current_interview_step, :notes
end

