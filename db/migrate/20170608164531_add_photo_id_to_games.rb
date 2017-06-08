class AddPhotoIdToGames < ActiveRecord::Migration[5.0]
  def change
    add_reference :games, :user_image, foreign_key: true
  end
end
