class CreateResumes < ActiveRecord::Migration[7.0]
  def change
    create_table :resumes do |t|
      t.string :file_path, null: false, limit: 500
      t.string :file_type, null: false, limit: 50
      t.datetime :upload_date, null: false
      t.references :candidate, null: false, foreign_key: true

      t.timestamps
    end
  end
end
