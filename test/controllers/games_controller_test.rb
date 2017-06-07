require 'test_helper'

class GamesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @game = games(:one)
    @other_game = games(:different_owner)

    # Login as a user
    post login_users_url, params: { :email => users(:login_user).email, :password => 'password' }
  end

  test "should get index" do
    get games_url
    assert_response :success
  end

  test "should get new" do
    get new_game_url
    assert_response :success
  end

  test "should create game" do
    assert_difference('Game.count') do
      post games_url, params: { game: { name: @game.name, state: @game.state } }
    end

    assert_redirected_to games_url
  end

  test "should show game" do
    get game_url(@game)
    assert_response :success
  end

  test "should get edit" do
    get edit_game_url(@game)
    assert_response :success
  end

  test "should update game" do
    patch game_url(@game), params: { game: { name: @game.name, state: @game.state } }
    assert_redirected_to game_url(@game)
  end

  test "should destroy game" do
    assert_difference('Game.count', -1) do
      delete game_url(@game)
    end

    assert_redirected_to games_url
  end

  test "should be restricted to owner" do
    get game_url(@other_game)

    assert_redirected_to games_url
  end
end
