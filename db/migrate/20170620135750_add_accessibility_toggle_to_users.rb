class AddAccessibilityToggleToUsers < ActiveRecord::Migration[5.0]
  def change
    add_column :users, :accessibility, :boolean
  end
end
