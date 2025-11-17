# frozen_string_literal: true

class Education < ApplicationRecord
  # Validations
  validates :institution, presence: true, length: { maximum: 100 }
  validates :title, presence: true, length: { maximum: 250 }
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

