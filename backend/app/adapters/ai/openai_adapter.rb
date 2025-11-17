# frozen_string_literal: true

module Ai
  class OpenAiAdapter < BaseAdapter
    def initialize(config = {})
      super
      @client = OpenAI::Client.new(access_token: config[:api_key] || ENV["OPENAI_API_KEY"])
    end

    def generate_completion(prompt, options = {})
      response = @client.chat(
        parameters: {
          model: options[:model] || "gpt-4",
          messages: [{ role: "user", content: prompt }],
          temperature: options[:temperature] || 0.7,
          max_tokens: options[:max_tokens] || 1000
        }
      )

      {
        content: response.dig("choices", 0, "message", "content"),
        model: response.dig("model"),
        usage: response.dig("usage")
      }
    rescue StandardError => e
      Rails.logger.error("OpenAI API error: #{e.message}")
      raise
    end

    def generate_embeddings(text)
      response = @client.embeddings(
        parameters: {
          model: "text-embedding-ada-002",
          input: text
        }
      )

      {
        embedding: response.dig("data", 0, "embedding"),
        model: response.dig("model")
      }
    rescue StandardError => e
      Rails.logger.error("OpenAI Embeddings API error: #{e.message}")
      raise
    end

    private

    attr_reader :client
  end
end

