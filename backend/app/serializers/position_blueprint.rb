# frozen_string_literal: true

class PositionBlueprint < Blueprinter::Base
  identifier :id

  fields :company_id, :interview_flow_id, :title, :description, :status,
         :is_visible, :location, :job_description, :requirements,
         :responsibilities, :salary_min, :salary_max, :employment_type,
         :benefits, :company_description, :application_deadline, :contact_info
end

