class CreateCandidates < ActiveRecord::Migration[7.0]
  def change
    create_table :candidates do |t|
      t.string :first_name, null: false, limit: 100
      t.string :last_name, null: false, limit: 100
      t.string :email, null: false, limit: 255
      t.string :phone, limit: 15
      t.string :address, limit: 100

      t.timestamps
    end
    add_index :candidates, :email, unique: true
  end
end
