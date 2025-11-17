# frozen_string_literal: true

class ApplicationDetailBlueprint < Blueprinter::Base
  identifier :id

  fields :candidate_id, :position_id, :application_date, :current_interview_step, :notes

  association :position, blueprint: PositionBlueprint
  association :interviews, blueprint: InterviewBlueprint
end

