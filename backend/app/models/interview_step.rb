# frozen_string_literal: true

class InterviewStep < ApplicationRecord
  # Validations
  validates :name, presence: true
  validates :order_index, presence: true, numericality: { only_integer: true, greater_than_or_equal_to: 0 }

  # Associations
  belongs_to :interview_flow
  belongs_to :interview_type
  has_many :applications, dependent: :nullify
  has_many :interviews, dependent: :destroy

  # Scopes
  scope :ordered, -> { order(:order_index) }
end

