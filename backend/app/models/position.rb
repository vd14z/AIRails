# frozen_string_literal: true

class Position < ApplicationRecord
  # Constants
  STATUSES = %w[Open Contratado Cerrado Borrador].freeze

  # Validations
  validates :title, presence: true, length: { maximum: 100 }
  validates :description, presence: true
  validates :location, presence: true
  validates :job_description, presence: true
  validates :status, presence: true, inclusion: { in: STATUSES }
  validates :salary_min, numericality: { greater_than_or_equal_to: 0 }, allow_nil: true
  validates :salary_max, numericality: { greater_than_or_equal_to: 0 }, allow_nil: true
  validate :salary_max_greater_than_min
  validate :application_deadline_in_future

  # Associations
  belongs_to :company
  belongs_to :interview_flow
  has_many :applications, dependent: :destroy

  # Scopes
  scope :visible, -> { where(is_visible: true) }
  scope :by_status, ->(status) { where(status: status) }
  scope :open, -> { where(status: "Open") }

  private

  def salary_max_greater_than_min
    return unless salary_min.present? && salary_max.present?
    return unless salary_max < salary_min

    errors.add(:salary_max, "must be greater than or equal to salary_min")
  end

  def application_deadline_in_future
    return unless application_deadline.present?
    return unless application_deadline <= Time.current

    errors.add(:application_deadline, "must be a future date")
  end
end

