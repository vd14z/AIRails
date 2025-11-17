require "sidekiq/web"

Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :candidates, only: [:index, :show, :create, :update] do
        post :generate_report, on: :member
        get :report, on: :member
      end
      resources :positions, only: [:index, :show, :update] do
        get :candidates, on: :member
        get "candidates/names", action: :candidate_names, on: :member
        get :interviewflow, action: :interview_flow, on: :member
      end
      post :upload, to: "upload#create"
    end
  end

  # Sidekiq Web UI for monitoring background jobs
  # Mount after API routes to ensure proper session handling
  # In production, this should be protected with authentication
  if Rails.env.development? || Rails.env.staging?
    mount Sidekiq::Web => "/sidekiq"
  end
end
