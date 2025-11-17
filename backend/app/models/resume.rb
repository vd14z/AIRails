# frozen_string_literal: true

class Resume < ApplicationRecord
  # Validations
  validates :file_path, presence: true, length: { maximum: 500 }
  validates :file_type, presence: true, length: { maximum: 50 }
  validates :upload_date, presence: true
  validate :valid_file_type

  # Associations
  belongs_to :candidate

  private

  def valid_file_type
    return unless file_type.present?

    allowed_types = %w[application/pdf application/vnd.openxmlformats-officedocument.wordprocessingml.document]
    return if allowed_types.include?(file_type)

    errors.add(:file_type, "must be PDF or DOCX")
  end
end

