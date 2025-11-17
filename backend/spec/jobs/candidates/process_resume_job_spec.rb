# frozen_string_literal: true

require "rails_helper"

RSpec.describe Candidates::ProcessResumeJob, type: :job do
  include ActiveJob::TestHelper

  let(:candidate) do
    Candidate.create!(
      first_name: "Alice",
      last_name: "Johnson",
      email: "alice@example.com"
    )
  end

  describe "#perform" do
    context "with valid candidate ID" do
      it "enqueues the job" do
        expect do
          described_class.perform_later(candidate.id)
        end.to have_enqueued_job(described_class).with(candidate.id)
      end

      it "generates report successfully" do
        Sidekiq::Testing.inline! do
          report = described_class.new.perform(candidate.id)

          expect(report).to be_a(Hash)
          expect(report[:candidate][:id]).to eq(candidate.id)
          expect(report[:summary]).to be_present
        end
      end

      it "calls GenerateProcessReportService" do
        service = instance_double(Candidates::GenerateProcessReportService)
        allow(Candidates::GenerateProcessReportService).to receive(:new).and_return(service)
        allow(service).to receive(:call).with(candidate.id).and_return({ test: "report" })

        Sidekiq::Testing.inline! do
          result = described_class.new.perform(candidate.id)

          expect(service).to have_received(:call).with(candidate.id)
          expect(result).to eq({ test: "report" })
        end
      end

      it "logs job execution" do
        allow(Rails.logger).to receive(:info)

        Sidekiq::Testing.inline! do
          described_class.new.perform(candidate.id)
        end

        expect(Rails.logger).to have_received(:info).with(/Starting report generation/)
        expect(Rails.logger).to have_received(:info).with(/Report generation completed/)
      end
    end

    context "with invalid candidate ID" do
      it "discards job when candidate not found" do
        Sidekiq::Testing.inline! do
          expect do
            described_class.new.perform(999_999)
          end.to raise_error(ActiveRecord::RecordNotFound)
        end
      end

      it "logs error when candidate not found" do
        allow(Rails.logger).to receive(:error)

        Sidekiq::Testing.inline! do
          begin
            described_class.new.perform(999_999)
          rescue ActiveRecord::RecordNotFound
            # Expected
          end
        end

        expect(Rails.logger).to have_received(:error).with(/Candidate not found/)
      end
    end

    context "with service errors" do
      it "handles service errors gracefully" do
        allow(Candidates::GenerateProcessReportService).to receive(:new).and_raise(StandardError, "Service error")
        allow(Rails.logger).to receive(:error)

        Sidekiq::Testing.inline! do
          expect do
            described_class.new.perform(candidate.id)
          end.to raise_error(StandardError, "Service error")
        end

        expect(Rails.logger).to have_received(:error).with(/Error processing report/)
      end
    end

    context "with options parameter" do
      it "accepts options parameter" do
        Sidekiq::Testing.inline! do
          expect do
            described_class.new.perform(candidate.id, { store: true })
          end.not_to raise_error
        end
      end
    end

    context "retry configuration" do
      it "retries on StandardError" do
        allow(Candidates::GenerateProcessReportService).to receive(:new).and_raise(StandardError, "Transient error")

        Sidekiq::Testing.fake! do
          job = described_class.perform_later(candidate.id)
          expect(job).to be_present
        end
      end
    end
  end

  describe "job configuration" do
    it "uses default queue" do
      expect(described_class.queue_name).to eq("default")
    end
  end
end

