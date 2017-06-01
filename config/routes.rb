Rails.application.routes.draw do
  root :to => 'games#index'
  resources :game_sessions
  resources :games
  post 'games/new_image'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
