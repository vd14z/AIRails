# frozen_string_literal: true

class InterviewFlowBlueprint < Blueprinter::Base
  identifier :id

  fields :description

  association :interview_steps, blueprint: InterviewStepBlueprint
end

