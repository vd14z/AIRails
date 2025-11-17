# frozen_string_literal: true

class InterviewType < ApplicationRecord
  # Validations
  validates :name, presence: true

  # Associations
  has_many :interview_steps, dependent: :destroy
end

