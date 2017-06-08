# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20170608164531) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "game_sessions", force: :cascade do |t|
    t.integer  "game_id"
    t.string   "game_hash"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["game_id"], name: "index_game_sessions_on_game_id", using: :btree
  end

  create_table "games", force: :cascade do |t|
    t.string   "name"
    t.string   "state"
    t.datetime "created_at",    null: false
    t.datetime "updated_at",    null: false
    t.integer  "user_id"
    t.integer  "user_image_id"
    t.index ["user_id"], name: "index_games_on_user_id", using: :btree
    t.index ["user_image_id"], name: "index_games_on_user_image_id", using: :btree
  end

  create_table "user_images", force: :cascade do |t|
    t.string   "hash_id"
    t.integer  "user_id"
    t.integer  "game_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["game_id"], name: "index_user_images_on_game_id", using: :btree
    t.index ["user_id"], name: "index_user_images_on_user_id", using: :btree
  end

  create_table "users", force: :cascade do |t|
    t.string   "name"
    t.string   "email"
    t.string   "about"
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
    t.string   "password_digest"
  end

  add_foreign_key "game_sessions", "games"
  add_foreign_key "games", "user_images"
  add_foreign_key "games", "users"
  add_foreign_key "user_images", "games"
  add_foreign_key "user_images", "users"
end
