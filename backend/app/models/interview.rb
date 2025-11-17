# frozen_string_literal: true

class Interview < ApplicationRecord
  # Validations
  validates :interview_date, presence: true
  validates :score, numericality: { only_integer: true, greater_than_or_equal_to: 0, less_than_or_equal_to: 100 }, allow_nil: true

  # Associations
  belongs_to :application
  belongs_to :interview_step
  belongs_to :employee
end

