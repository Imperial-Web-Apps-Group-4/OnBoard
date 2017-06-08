json.extract! game_session, :id, :game_id, :game_hash, :state, :created_at, :updated_at
json.url game_game_session_url(game_session, format: :json)
