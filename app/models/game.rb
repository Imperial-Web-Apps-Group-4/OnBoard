class Game < ApplicationRecord
  has_many :game_session, dependent: :destroy
  belongs_to :user
end
