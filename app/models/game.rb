class Game < ApplicationRecord
  has_many :game_session, dependent: :destroy
  belongs_to :user

  def access_allowed(user)
    user.id == user_id
  end
end
