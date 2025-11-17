# frozen_string_literal: true

module Candidates
  class ProcessResumeJob < ApplicationJob
    queue_as :default

    # Retry on transient errors (network, temporary DB issues)
    retry_on StandardError, wait: :exponentially_longer, attempts: 3

    # Discard on permanent errors (record not found)
    discard_on ActiveRecord::RecordNotFound

    def perform(candidate_id, options = {})
      Rails.logger.info("Starting report generation for candidate #{candidate_id}")

      start_time = Time.current

      # Validate candidate exists
      candidate = Candidate.find(candidate_id)

      # Generate report using service
      report = Candidates::GenerateProcessReportService.new.call(candidate_id)

      # Process report based on options
      process_report(report, options)

      elapsed_time = Time.current - start_time
      Rails.logger.info("Report generation completed for candidate #{candidate_id} in #{elapsed_time.round(2)}s")

      report
    rescue ActiveRecord::RecordNotFound => e
      Rails.logger.error("Candidate not found: #{candidate_id}")
      raise e
    rescue StandardError => e
      Rails.logger.error("Error processing report for candidate #{candidate_id}: #{e.message}")
      Rails.logger.error(e.backtrace.join("\n"))
      raise e
    end

    private

    def process_report(report, options)
      # Log report generation for audit purposes
      Rails.logger.info("Report generated: #{report[:candidate][:full_name]} - #{report[:summary][:total_applications]} applications")

      # Future enhancements:
      # - Store report to file system or database if options[:store] is true
      # - Email report if options[:email] is provided
      # - Generate PDF if options[:pdf] is true
    end
  end
end

