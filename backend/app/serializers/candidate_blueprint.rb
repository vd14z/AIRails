# frozen_string_literal: true

class CandidateBlueprint < Blueprinter::Base
  identifier :id

  fields :first_name, :last_name, :email, :phone, :address

  view :extended do
    association :educations, blueprint: EducationBlueprint
    association :work_experiences, blueprint: WorkExperienceBlueprint
    association :resumes, blueprint: ResumeBlueprint
  end
end

