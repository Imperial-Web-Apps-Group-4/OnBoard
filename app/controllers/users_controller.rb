class UsersController < ApplicationController
  before_action :set_user, only: [:show, :edit, :update, :destroy]
  before_action :redirect_if_not_logged_in!, only: [:new, :create, :login, :login_attempt]

  # GET /users
  # GET /users.json
  def index
    @users = User.all
  end

  # GET /users/1
  # GET /users/1.json
  def show
  end

  # POST /guest_login
  def guest_login
    params.require([:guest_name, :game_id, :game_hash])

    session[:guest_name] = params[:guest_name]
    redirect_to edit_game_game_session_path params[:game_id], params[:game_hash]
  end

  # GET /
  def login_session
    params.require([:game_id, :game_hash])

    @session = Game.find(params[:game_id]).game_session.find_by! game_hash: params[:game_hash]
  end

  # POST /users/login
  def login_attempt
    params.require([:email, :password])
    params.permit([:game_id, :game_hash])

    @user = User.find_by_email(params[:email])

    if not @user.nil? and @user.authenticate params[:password]
      session[:logged_in_email] = @user.email

      if params[:game_id]
        redirect_to edit_game_game_session_path(params[:game_id], params[:game_hash])
      else
        redirect_to root_path, notice: 'Login successful'
      end
    else
      @failed = true

      if params[:game_id]
        @session = Game.find(params[:game_id]).game_session.find_by! game_hash: params[:game_hash]
        render :login_session
      else
        render :login
      end
    end
  end

  # GET /users/logout
  def logout
    session[:logged_in_email] = nil
    redirect_to root_path, notice: 'Logged out'
  end

  # GET /users/register
  def new
    @user = User.new
  end

  # GET /users/1/edit
  def edit
  end

  # POST /users
  # POST /users.json
  def create
    @user = User.new(user_params)

    respond_to do |format|
      if @user.save
        session[:logged_in_email] = @user.email
        format.html { redirect_to @user, notice: 'User was successfully created.' }
        format.json { render :show, status: :created, location: @user }
      else
        format.html { render :new }
        format.json { render json: @user.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /users/1
  # PATCH/PUT /users/1.json
  def update
    respond_to do |format|
      if @user.update(user_params)
        format.html { redirect_to @user, notice: 'User was successfully updated.' }
        format.json { render :show, status: :ok, location: @user }
      else
        format.html { render :edit }
        format.json { render json: @user.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /users/1
  # DELETE /users/1.json
  def destroy
    @user.destroy
    respond_to do |format|
      format.html { redirect_to users_url, notice: 'User was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_user
      @user = User.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def user_params
      params.require(:user).permit(:name, :email, :email_confirmation, :password, :password_confirmation, :about)
    end

    def redirect_if_not_logged_in!
      redirect_to root_url if @current_user
    end
end
