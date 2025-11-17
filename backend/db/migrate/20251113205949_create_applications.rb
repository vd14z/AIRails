class CreateApplications < ActiveRecord::Migration[7.0]
  def change
    create_table :applications do |t|
      t.datetime :application_date, null: false
      t.integer :current_interview_step
      t.text :notes
      t.references :position, null: false, foreign_key: true
      t.references :candidate, null: false, foreign_key: true
      t.references :interview_step, null: false, foreign_key: true

      t.timestamps
    end
    add_index :applications, [:position_id, :candidate_id], unique: true
  end
end
