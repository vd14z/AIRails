# frozen_string_literal: true

class Company < ApplicationRecord
  # Validations
  validates :name, presence: true, uniqueness: true

  # Associations
  has_many :employees, dependent: :destroy
  has_many :positions, dependent: :destroy
end

