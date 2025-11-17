class CreatePositions < ActiveRecord::Migration[7.0]
  def change
    create_table :positions do |t|
      t.references :company, null: false, foreign_key: true
      t.references :interview_flow, null: false, foreign_key: true
      t.string :title, null: false, limit: 100
      t.text :description, null: false
      t.string :status, default: "Borrador", null: false
      t.boolean :is_visible, default: false, null: false
      t.string :location, null: false
      t.text :job_description, null: false
      t.text :requirements
      t.text :responsibilities
      t.decimal :salary_min, precision: 10, scale: 2
      t.decimal :salary_max, precision: 10, scale: 2
      t.string :employment_type
      t.text :benefits
      t.text :company_description
      t.datetime :application_deadline
      t.string :contact_info

      t.timestamps
    end
    add_index :positions, :status
  end
end
