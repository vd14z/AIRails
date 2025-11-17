# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.0].define(version: 2025_11_13_205951) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "applications", force: :cascade do |t|
    t.datetime "application_date", null: false
    t.integer "current_interview_step"
    t.text "notes"
    t.bigint "position_id", null: false
    t.bigint "candidate_id", null: false
    t.bigint "interview_step_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["candidate_id"], name: "index_applications_on_candidate_id"
    t.index ["interview_step_id"], name: "index_applications_on_interview_step_id"
    t.index ["position_id", "candidate_id"], name: "index_applications_on_position_id_and_candidate_id", unique: true
    t.index ["position_id"], name: "index_applications_on_position_id"
  end

  create_table "candidates", force: :cascade do |t|
    t.string "first_name", limit: 100, null: false
    t.string "last_name", limit: 100, null: false
    t.string "email", limit: 255, null: false
    t.string "phone", limit: 15
    t.string "address", limit: 100
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_candidates_on_email", unique: true
  end

  create_table "companies", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_companies_on_name", unique: true
  end

  create_table "educations", force: :cascade do |t|
    t.string "institution", limit: 100, null: false
    t.string "title", limit: 250, null: false
    t.datetime "start_date", null: false
    t.datetime "end_date"
    t.bigint "candidate_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["candidate_id"], name: "index_educations_on_candidate_id"
  end

  create_table "employees", force: :cascade do |t|
    t.string "name", null: false
    t.string "email", null: false
    t.string "role"
    t.boolean "is_active", default: true, null: false
    t.bigint "company_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["company_id"], name: "index_employees_on_company_id"
    t.index ["email"], name: "index_employees_on_email", unique: true
  end

  create_table "interview_flows", force: :cascade do |t|
    t.text "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "interview_steps", force: :cascade do |t|
    t.string "name", null: false
    t.integer "order_index", null: false
    t.bigint "interview_flow_id", null: false
    t.bigint "interview_type_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["interview_flow_id", "order_index"], name: "index_interview_steps_on_interview_flow_id_and_order_index"
    t.index ["interview_flow_id"], name: "index_interview_steps_on_interview_flow_id"
    t.index ["interview_type_id"], name: "index_interview_steps_on_interview_type_id"
  end

  create_table "interview_types", force: :cascade do |t|
    t.string "name"
    t.text "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "interviews", force: :cascade do |t|
    t.datetime "interview_date", null: false
    t.string "result"
    t.integer "score"
    t.text "notes"
    t.bigint "application_id", null: false
    t.bigint "interview_step_id", null: false
    t.bigint "employee_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["application_id"], name: "index_interviews_on_application_id"
    t.index ["employee_id"], name: "index_interviews_on_employee_id"
    t.index ["interview_step_id"], name: "index_interviews_on_interview_step_id"
  end

  create_table "positions", force: :cascade do |t|
    t.bigint "company_id", null: false
    t.bigint "interview_flow_id", null: false
    t.string "title", limit: 100, null: false
    t.text "description", null: false
    t.string "status", default: "Borrador", null: false
    t.boolean "is_visible", default: false, null: false
    t.string "location", null: false
    t.text "job_description", null: false
    t.text "requirements"
    t.text "responsibilities"
    t.decimal "salary_min", precision: 10, scale: 2
    t.decimal "salary_max", precision: 10, scale: 2
    t.string "employment_type"
    t.text "benefits"
    t.text "company_description"
    t.datetime "application_deadline"
    t.string "contact_info"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["company_id"], name: "index_positions_on_company_id"
    t.index ["interview_flow_id"], name: "index_positions_on_interview_flow_id"
    t.index ["status"], name: "index_positions_on_status"
  end

  create_table "resumes", force: :cascade do |t|
    t.string "file_path", limit: 500, null: false
    t.string "file_type", limit: 50, null: false
    t.datetime "upload_date", null: false
    t.bigint "candidate_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["candidate_id"], name: "index_resumes_on_candidate_id"
  end

  create_table "work_experiences", force: :cascade do |t|
    t.string "company", limit: 100, null: false
    t.string "position", limit: 100, null: false
    t.string "description", limit: 200
    t.datetime "start_date", null: false
    t.datetime "end_date"
    t.bigint "candidate_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["candidate_id"], name: "index_work_experiences_on_candidate_id"
  end

  add_foreign_key "applications", "candidates"
  add_foreign_key "applications", "interview_steps"
  add_foreign_key "applications", "positions"
  add_foreign_key "educations", "candidates"
  add_foreign_key "employees", "companies"
  add_foreign_key "interview_steps", "interview_flows"
  add_foreign_key "interview_steps", "interview_types"
  add_foreign_key "interviews", "applications"
  add_foreign_key "interviews", "employees"
  add_foreign_key "interviews", "interview_steps"
  add_foreign_key "positions", "companies"
  add_foreign_key "positions", "interview_flows"
  add_foreign_key "resumes", "candidates"
  add_foreign_key "work_experiences", "candidates"
end
