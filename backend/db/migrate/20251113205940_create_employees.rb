class CreateEmployees < ActiveRecord::Migration[7.0]
  def change
    create_table :employees do |t|
      t.string :name, null: false
      t.string :email, null: false
      t.string :role
      t.boolean :is_active, default: true, null: false
      t.references :company, null: false, foreign_key: true

      t.timestamps
    end
    add_index :employees, :email, unique: true
  end
end
