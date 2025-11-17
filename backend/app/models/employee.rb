# frozen_string_literal: true

class Employee < ApplicationRecord
  # Validations
  validates :name, presence: true
  validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :is_active, inclusion: { in: [true, false] }

  # Associations
  belongs_to :company
  has_many :interviews, dependent: :destroy

  # Scopes
  scope :active, -> { where(is_active: true) }
end

