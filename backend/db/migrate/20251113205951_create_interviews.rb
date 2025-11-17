class CreateInterviews < ActiveRecord::Migration[7.0]
  def change
    create_table :interviews do |t|
      t.datetime :interview_date, null: false
      t.string :result
      t.integer :score
      t.text :notes
      t.references :application, null: false, foreign_key: true
      t.references :interview_step, null: false, foreign_key: true
      t.references :employee, null: false, foreign_key: true

      t.timestamps
    end
  end
end
