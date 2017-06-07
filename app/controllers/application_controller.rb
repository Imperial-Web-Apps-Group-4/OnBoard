class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  before_action :check_login

  private
    def check_login
      return unless session[:logged_in_email]

      @current_user = User.find_by_email(session[:logged_in_email])
    rescue ActiveRecord::RecordNotFound
      session[:logged_in_email] = nil
    end

    def authenticate_user!
      redirect_to login_users_path unless @current_user
    end
end
