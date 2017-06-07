class GameSessionsController < ApplicationController
  include RandomHash
  before_action :authenticate_user!
  before_action :set_game
  before_action :set_game_session, only: [:show, :edit, :update, :destroy]

  # GET /game/:game_id/game_sessions/1
  # GET /game/:game_id/game_sessions/1.json
  def show
  end

  # GET /game/:game_id/game_sessions/new
  def new
    @game_session = GameSession.new
  end

  # GET /game/:game_id/game_sessions/1/play
  def play
  end

  # POST /game/:game_id/game_sessions
  # POST /game/:game_id/game_sessions.json
  def create
    @game_session = GameSession.new do |session|
      session.game_id = params[:game_id]
      session.game_hash = random_hash
    end

    respond_to do |format|
      if @game_session.save
        format.html { redirect_to edit_game_game_session_path(@game, @game_session), notice: 'Game session was successfully created.' }
        format.json { render :show, status: :created, location: @game_session }
      else
        format.html { render :new }
        format.json { render json: @game_session.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /game/:game_id/game_sessions/1
  # PATCH/PUT /game/:game_id/game_sessions/1.json
  def update
    respond_to do |format|
      if @game_session.update(game_session_params)
        format.html { redirect_to games_url, notice: 'Game session was successfully updated.' }
        format.json { render :show, status: :ok, location: @game_session }
      else
        format.html { render :edit }
        format.json { render json: @game_session.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /game/:game_id/game_sessions/1
  # DELETE /game/:game_id/game_sessions/1.json
  def destroy
    @game_session.destroy
    respond_to do |format|
      format.html { redirect_to games_url, notice: 'Game session was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    def set_game
      @game = Game.find(params[:game_id])
    end

    # Use callbacks to share common setup or constraints between actions.
    def set_game_session
      @game_session = @game.game_session.find_by! game_hash: params[:game_hash]
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def game_session_params
      params.require(:game_session).permit(:game_id, :game_hash)
    end
end
