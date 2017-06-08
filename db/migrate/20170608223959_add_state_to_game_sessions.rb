class AddStateToGameSessions < ActiveRecord::Migration[5.0]
  def change
    add_column :game_sessions, :state, :string
  end
end
