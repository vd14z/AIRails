# frozen_string_literal: true

class InterviewStepBlueprint < Blueprinter::Base
  identifier :id

  fields :interview_flow_id, :interview_type_id, :name, :order_index
end

