require 'test_helper'

class UsersControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user = users(:one)
    @user.password = 'testingpassword'
  end

  test "should get index" do
    get users_url
    assert_response :success
  end

  test "should get new" do
    get new_user_url
    assert_response :success
  end

  test "should create user" do
    assert_difference('User.count') do
      post users_url, params: { user: { about: @user.about, email: "test@test.com", email_confirmation: "test@test.com",
                                        name: @user.name, password: @user.password,
                                        password_confirmation: @user.password } }
    end

    assert_redirected_to user_url(User.last)
  end

  test "should show user" do
    get user_url(@user)
    assert_response :success
  end

  test "should get edit" do
    get edit_user_url(@user)
    assert_response :success
  end

  test "should update user" do
    patch user_url(@user), params: { user: { about: @user.about, name: @user.name } }
    assert_redirected_to user_url(@user)
  end

  test "should destroy user" do
    assert_difference('User.count', -1) do
      delete user_url(@user)
    end

    assert_redirected_to users_url
  end

  test "should be able to get login" do
    get login_users_url
    assert_response :success
  end

  test "should be able to login" do
    login
    assert_redirected_to root_url
  end

  test "should not be able to get login page when logged in" do
    login
    get login_users_url
    assert_response :redirect
  end

  test "should not be able to register when logged in" do
    login
    get new_user_url
    assert_response :redirect
  end

  private
    def login
      post login_users_url, params: { :email => users(:login_user).email, :password => 'password' }
    end
end