class Game < ApplicationRecord
  has_many :game_session, dependent: :destroy
  has_many :user_image, dependent: :destroy
  belongs_to :user
  belongs_to :picture, class_name: 'UserImage', foreign_key: 'user_image_id', optional: true
  validates :name, presence: true

  def access_allowed(user)
    user.id == user_id
  end
end
