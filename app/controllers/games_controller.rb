class GamesController < ApplicationController
  MAX_FILE_SIZE = 10 * (2 ** 20)
  include RandomHash
  before_action :authenticate_user!
  before_action :set_game, :check_permission!, only: [:show, :edit, :update, :destroy]

  # GET /games
  # GET /games.json
  def index
    @games = Game.where(:user_id => @current_user.id).all
  end

  # GET /games/1
  # GET /games/1.json
  def show
  end

  # GET /games/new
  def new
    @game = Game.new
  end

  # GET /games/1/edit
  def edit
  end

  # POST /games
  # POST /games.json
  def create
    @game = Game.new(game_params) do |game|
      game.user_id = @current_user.id
    end

    respond_to do |format|
      if @game.save
        format.html { redirect_to games_url, notice: 'Game was successfully created.' }
        format.json { render :show, status: :created, location: @game }
      else
        format.html { render :new }
        format.json { render json: @game.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /games/1
  # PATCH/PUT /games/1.json
  def update
    respond_to do |format|
      if @game.update(game_params)
        format.html { redirect_to @game, notice: 'Game was successfully updated.' }
        format.json { render :show, status: :ok, location: @game }
      else
        format.html { render :edit }
        format.json { render json: @game.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /games/1
  # DELETE /games/1.json
  def destroy
    @game.destroy
    respond_to do |format|
      format.html { redirect_to games_url, notice: 'Game was successfully destroyed.' }
      format.json { head :no_content }
    end
  end


  def new_image
    image_hash = random_hash
    respond_to do |format|
      new_img_url = Rails.public_path.join("user_upload/game_images/#{image_hash}.png");
      if params[:file].size > MAX_FILE_SIZE
        format.json { render json: {'error': 'File too big'} }
      else
        File.open(new_img_url, 'wb') { |file|
          file.write(params[:file].read)
        }
        (width, height) = FastImage.size(new_img_url);
        format.json { render json: {'id': image_hash, 'width': width, 'height': height} }
      end
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_game
      @game = Game.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def game_params
      params.require(:game).permit(:name, :state)
    end

    def check_permission!
      redirect_to games_path unless @game.access_allowed @current_user
    end
end
