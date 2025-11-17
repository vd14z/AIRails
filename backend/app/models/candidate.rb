# frozen_string_literal: true

class Candidate < ApplicationRecord
  # Validations
  validates :first_name, presence: true, length: { minimum: 2, maximum: 100 }
  validates :last_name, presence: true, length: { minimum: 2, maximum: 100 }
  validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :phone, format: { with: /\A(6|7|9)\d{8}\z/, message: "must follow Spanish format (6|7|9)XXXXXXXX" }, allow_blank: true
  validates :address, length: { maximum: 100 }, allow_blank: true
  validate :maximum_three_educations

  # Associations
  has_many :educations, dependent: :destroy
  has_many :work_experiences, dependent: :destroy
  has_many :resumes, dependent: :destroy
  has_many :applications, dependent: :destroy

  # Scopes
  scope :by_name, ->(query) { where("first_name ILIKE ? OR last_name ILIKE ? OR email ILIKE ?", "%#{query}%", "%#{query}%", "%#{query}%") }
  scope :with_education, -> { joins(:educations).distinct }
  scope :experienced, -> {
    joins(:work_experiences)
      .where("work_experiences.end_date IS NULL OR work_experiences.end_date >= ?", 1.year.ago)
      .distinct
  }
  scope :by_skill, ->(skill) {
    joins(:work_experiences)
      .where("work_experiences.description ILIKE ?", "%#{skill}%")
      .distinct
  }
  scope :recent_applications, -> {
    joins(:applications)
      .where("applications.application_date >= ?", 30.days.ago)
      .distinct
  }

  # Instance methods
  def full_name
    "#{first_name} #{last_name}"
  end

  private

  def maximum_three_educations
    return unless educations.size > 3

    errors.add(:educations, "cannot exceed 3 records per candidate")
  end
end

