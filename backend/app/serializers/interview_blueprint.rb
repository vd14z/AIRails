# frozen_string_literal: true

class InterviewBlueprint < Blueprinter::Base
  identifier :id

  fields :interview_date, :result, :score, :notes

  field :interview_step do |interview|
    { name: interview.interview_step.name }
  end
end

