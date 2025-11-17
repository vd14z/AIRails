class CreateEducations < ActiveRecord::Migration[7.0]
  def change
    create_table :educations do |t|
      t.string :institution, null: false, limit: 100
      t.string :title, null: false, limit: 250
      t.datetime :start_date, null: false
      t.datetime :end_date
      t.references :candidate, null: false, foreign_key: true

      t.timestamps
    end
  end
end
