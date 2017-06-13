Rails.application.routes.draw do
  root :to => 'games#index'
  resources :users, :path_names => { :new => 'register' } do
    collection do
      get 'login' => 'users#login'
      get 'login_session/:game_id/:game_hash' => 'users#login_session'
      post 'login_session/:game_id/:game_hash' => 'users#login_attempt'
      post 'login' => 'users#login_attempt'
      get 'logout' => 'users#logout'
    end
  end
  resources :games do
    resources :game_sessions, :path => 'sessions', :except => ['index'],
              :path_names => { :edit => 'play' }, :param => 'game_hash'

    collection do
      post 'new_image'
    end
  end
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
