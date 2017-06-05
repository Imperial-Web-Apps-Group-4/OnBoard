class GameSession < ApplicationRecord
  belongs_to :game
  def to_param
    game_hash
  end
end
