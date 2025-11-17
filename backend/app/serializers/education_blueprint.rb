# frozen_string_literal: true

class EducationBlueprint < Blueprinter::Base
  identifier :id

  fields :institution, :title, :start_date, :end_date, :candidate_id
end

