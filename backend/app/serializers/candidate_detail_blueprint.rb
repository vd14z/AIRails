# frozen_string_literal: true

class CandidateDetailBlueprint < Blueprinter::Base
  identifier :id

  fields :first_name, :last_name, :email, :phone, :address

  association :educations, blueprint: EducationBlueprint
  association :work_experiences, blueprint: WorkExperienceBlueprint
  association :resumes, blueprint: ResumeBlueprint
  association :applications, blueprint: ApplicationDetailBlueprint
end

