# frozen_string_literal: true

module Candidates
  class ScoreAiFitService
    include Dry::Monads[:result, :do]

    def initialize(ai_adapter: nil)
      @ai_adapter = ai_adapter || Ai::OpenAiAdapter.new
    end

    def call(candidate, position)
      candidate_text = yield extract_candidate_text(candidate)
      position_text = yield extract_position_text(position)
      score = yield calculate_fit_score(candidate_text, position_text)
      Success(score)
    end

    private

    attr_reader :ai_adapter

    def extract_candidate_text(candidate)
      text_parts = [
        "Name: #{candidate.full_name}",
        "Email: #{candidate.email}"
      ]

      candidate.educations.each do |edu|
        text_parts << "Education: #{edu.title} at #{edu.institution}"
      end

      candidate.work_experiences.each do |exp|
        text_parts << "Experience: #{exp.position} at #{exp.company}"
        text_parts << "Description: #{exp.description}" if exp.description.present?
      end

      Success(text_parts.join("\n"))
    end

    def extract_position_text(position)
      text_parts = [
        "Title: #{position.title}",
        "Description: #{position.description}",
        "Requirements: #{position.requirements}",
        "Responsibilities: #{position.responsibilities}"
      ]

      Success(text_parts.join("\n"))
    end

    def calculate_fit_score(candidate_text, position_text)
      prompt = build_fit_prompt(candidate_text, position_text)
      response = ai_adapter.generate_completion(prompt, { max_tokens: 100 })

      # Parse score from response (assuming JSON format)
      score = parse_score_from_response(response[:content])
      Success(score)
    rescue StandardError => e
      Rails.logger.error("Error calculating AI fit score: #{e.message}")
      Failure("Failed to calculate fit score: #{e.message}")
    end

    def build_fit_prompt(candidate_text, position_text)
      <<~PROMPT
        Analyze the fit between this candidate and position.
        Rate the match from 0 to 100 based on skills, experience, and qualifications.

        Candidate Profile:
        #{candidate_text}

        Position Details:
        #{position_text}

        Respond with a JSON object: {"score": <number>, "reasoning": "<brief explanation>"}
      PROMPT
    end

    def parse_score_from_response(response_content)
      # Try to parse JSON response
      json_match = response_content.match(/\{"score":\s*(\d+)/)
      return json_match[1].to_i if json_match

      # Fallback: extract any number between 0-100
      score_match = response_content.match(/\b([0-9]|[1-9][0-9]|100)\b/)
      return score_match[1].to_i if score_match

      # Default score if parsing fails
      50
    end
  end
end

