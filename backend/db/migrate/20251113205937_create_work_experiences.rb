class CreateWorkExperiences < ActiveRecord::Migration[7.0]
  def change
    create_table :work_experiences do |t|
      t.string :company, null: false, limit: 100
      t.string :position, null: false, limit: 100
      t.string :description, limit: 200
      t.datetime :start_date, null: false
      t.datetime :end_date
      t.references :candidate, null: false, foreign_key: true

      t.timestamps
    end
  end
end
