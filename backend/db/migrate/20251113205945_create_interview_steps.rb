class CreateInterviewSteps < ActiveRecord::Migration[7.0]
  def change
    create_table :interview_steps do |t|
      t.string :name, null: false
      t.integer :order_index, null: false
      t.references :interview_flow, null: false, foreign_key: true
      t.references :interview_type, null: false, foreign_key: true

      t.timestamps
    end
    add_index :interview_steps, [:interview_flow_id, :order_index]
  end
end
