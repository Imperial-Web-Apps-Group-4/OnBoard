class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  before_action :check_login
  before_action :set_header_partial_and_name

  private
    def check_login
      return unless session[:logged_in_email]

      session[:guest_name] = nil
      @current_user = User.find_by_email(session[:logged_in_email])
    rescue ActiveRecord::RecordNotFound
      session[:logged_in_email] = nil
    end

    def set_header_partial_and_name
      @username = @current_user&.name || session[:guest_name] || "Not logged in"

      @header_user_data = 'shared/not_logged_in_header'
      @header_user_data = 'shared/logged_in_header' if session[:logged_in_email]
      @header_user_data = 'shared/guest_header'     if session[:guest_name]
    end

    def authenticate_user!
      redirect_to login_users_path unless @current_user
    end
end
