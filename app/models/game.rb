class Game < ApplicationRecord
  has_many :game_session, dependent: :destroy
end
