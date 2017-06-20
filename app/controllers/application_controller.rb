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
      @username = switch_login :users => @current_user&.name, :guests => session[:guest_name], :none => "Not logged in"
      @userident = switch_login :users => "u#{@current_user&.id}", :guests => "g#{session[:guest_name]}", :none => ""
      @accessibility_data = @current_user&.accessibility ? 'accessible' : ''

      @header_logo_path = @current_user ? games_path : root_path

      @header_user_data = 'shared/not_logged_in_header'
      @header_user_data = 'shared/logged_in_header' if session[:logged_in_email]
      @header_user_data = 'shared/guest_header'     if session[:guest_name]
    end

    def authenticate_user!
      redirect_to login_users_path unless @current_user
    end

    def switch_login(options)
      return options[:users]  if @current_user
      return options[:guests] if session[:guest_name]

      options[:none]
    end
end
