# frozen_string_literal: true

module Ai
  class BaseAdapter
    def initialize(config = {})
      @config = config
    end

    def generate_completion(prompt, options = {})
      raise NotImplementedError, "Subclasses must implement #generate_completion"
    end

    def generate_embeddings(text)
      raise NotImplementedError, "Subclasses must implement #generate_embeddings"
    end

    private

    attr_reader :config
  end
end

