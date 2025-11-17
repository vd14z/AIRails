# frozen_string_literal: true

class Application < ApplicationRecord
  # Validations
  validates :application_date, presence: true
  validates :position_id, uniqueness: { scope: :candidate_id, message: "candidate has already applied to this position" }

  # Associations
  belongs_to :position
  belongs_to :candidate
  belongs_to :interview_step
  has_many :interviews, dependent: :destroy

  # Instance methods
  def average_score
    return 0 if interviews.empty?

    interviews.where.not(score: nil).average(:score).to_f.round(2)
  end
end

