class UserImage < ApplicationRecord
  belongs_to :user
  belongs_to :game, optional: true
end
