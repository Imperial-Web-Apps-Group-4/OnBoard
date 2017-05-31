class CreateGameSessions < ActiveRecord::Migration[5.0]
  def change
    create_table :game_sessions do |t|
      t.belongs_to :game, foreign_key: true
      t.string :game_hash

      t.timestamps
    end
  end
end
