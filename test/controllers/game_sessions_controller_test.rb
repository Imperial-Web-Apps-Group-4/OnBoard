require 'test_helper'

class GameSessionsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @game = games(:one)
    @game_session = @game.game_session.first
  end

  test "should get new" do
    get new_game_game_session_url(@game)
    assert_response :success
  end

  test "should create game_session" do
    assert_difference('GameSession.count') do
      post game_game_sessions_url(@game)
    end

    assert_redirected_to edit_game_game_session_url(@game, GameSession.last)
  end

  test "should show game_session" do
    get game_game_session_url(@game, @game_session)
    assert_response :success
  end

  test "should get edit" do
    get edit_game_game_session_url(@game, @game_session)
    assert_response :success
  end

  test "should update game_session" do
    patch game_game_session_url(@game, @game_session), params: { game_session: { game_hash: @game_session.game_hash } }
    assert_redirected_to games_url
  end

  test "should destroy game_session" do
    assert_difference('GameSession.count', -1) do
      delete game_game_session_url(@game, @game_session)
    end

    assert_redirected_to games_url
  end
end
