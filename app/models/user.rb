class EmailValidator < ActiveModel::EachValidator
  def validate_each(record, attribute, value)
    unless value =~ /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\z/i
      record.errors[attribute] << (options[:message] || "is not an email")
    end
  end
end

class User < ApplicationRecord
  has_many :game, dependent: :destroy

  validates :name, length: { minimum: 3, maximum: 20 }
  validates :email, presence: true, uniqueness: true, confirmation: true, email: true, on: :create
  validates :email_confirmation, presence: true, on: :create
  validates :about, length: { maximum: 1000, too_long: "must be at most %{count} characters" }

  has_secure_password

  validates :password, presence: true, length: { minimum: 6 }, on: :create
end
