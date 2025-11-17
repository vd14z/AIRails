# frozen_string_literal: true

class InterviewFlow < ApplicationRecord
  # Associations
  has_many :interview_steps, dependent: :destroy
  has_many :positions, dependent: :destroy

  # Instance methods
  def ordered_steps
    interview_steps.order(:order_index)
  end
end

