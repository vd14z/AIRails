# frozen_string_literal: true

# AI Configuration
Rails.application.config.ai = ActiveSupport::OrderedOptions.new

# Default AI adapter
Rails.application.config.ai.adapter = ENV.fetch("AI_ADAPTER", "openai").to_sym

# OpenAI configuration
Rails.application.config.ai.openai = {
  api_key: ENV["OPENAI_API_KEY"],
  default_model: ENV.fetch("OPENAI_DEFAULT_MODEL", "gpt-4"),
  embedding_model: ENV.fetch("OPENAI_EMBEDDING_MODEL", "text-embedding-ada-002")
}

# Rate limiting
Rails.application.config.ai.rate_limit = {
  requests_per_minute: ENV.fetch("AI_RATE_LIMIT_RPM", "60").to_i,
  requests_per_day: ENV.fetch("AI_RATE_LIMIT_RPD", "1000").to_i
}

# Timeout settings
Rails.application.config.ai.timeout = ENV.fetch("AI_TIMEOUT_SECONDS", "30").to_i

