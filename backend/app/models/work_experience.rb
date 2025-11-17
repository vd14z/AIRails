# frozen_string_literal: true

class WorkExperience < ApplicationRecord
  # Validations
  validates :company, presence: true, length: { maximum: 100 }
  validates :position, presence: true, length: { maximum: 100 }
  validates :description, length: { maximum: 200 }, allow_blank: true
  validates :start_date, presence: true
  validate :end_date_after_start_date

  # Associations
  belongs_to :candidate

  private

  def end_date_after_start_date
    return unless end_date.present? && start_date.present?
    return unless end_date < start_date

    errors.add(:end_date, "must be after start date")
  end
end

