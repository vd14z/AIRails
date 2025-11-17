# frozen_string_literal: true

# Clear existing data
puts "Clearing existing data..."
[Interview, Application, Position, InterviewStep, InterviewFlow, InterviewType,
 Employee, Company, Resume, WorkExperience, Education, Candidate].each(&:destroy_all)

# Create Companies
puts "Creating companies..."
company1 = Company.create!(name: "TechCorp Solutions")
company2 = Company.create!(name: "InnovateHub")

# Create Employees
puts "Creating employees..."
employee1 = Employee.create!(
  name: "John Smith",
  email: "john.smith@techcorp.com",
  role: "Senior Recruiter",
  is_active: true,
  company: company1
)

employee2 = Employee.create!(
  name: "Maria Garcia",
  email: "maria.garcia@innovatehub.com",
  role: "Hiring Manager",
  is_active: true,
  company: company2
)

# Create Interview Types
puts "Creating interview types..."
tech_interview = InterviewType.create!(name: "Technical", description: "Technical skills assessment")
hr_interview = InterviewType.create!(name: "HR", description: "HR and cultural fit interview")
behavioral = InterviewType.create!(name: "Behavioral", description: "Behavioral and soft skills interview")

# Create Interview Flows
puts "Creating interview flows..."
flow1 = InterviewFlow.create!(description: "Standard technical hiring process")
flow2 = InterviewFlow.create!(description: "Executive hiring process")

# Create Interview Steps
puts "Creating interview steps..."
step1 = InterviewStep.create!(
  name: "Initial Screening",
  order_index: 0,
  interview_flow: flow1,
  interview_type: hr_interview
)

step2 = InterviewStep.create!(
  name: "Technical Assessment",
  order_index: 1,
  interview_flow: flow1,
  interview_type: tech_interview
)

step3 = InterviewStep.create!(
  name: "Final Interview",
  order_index: 2,
  interview_flow: flow1,
  interview_type: behavioral
)

# Create Positions
puts "Creating positions..."
position1 = Position.create!(
  company: company1,
  interview_flow: flow1,
  title: "Senior Ruby Developer",
  description: "We are looking for an experienced Ruby on Rails developer",
  status: "Open",
  is_visible: true,
  location: "Madrid, Spain",
  job_description: "Join our team to build scalable web applications using Ruby on Rails. You will work on exciting projects and collaborate with a talented team.",
  requirements: "5+ years of Ruby experience, Rails framework knowledge, PostgreSQL, Redis",
  responsibilities: "Develop and maintain web applications, code reviews, mentor junior developers",
  salary_min: 50000,
  salary_max: 70000,
  employment_type: "Full-time",
  benefits: "Health insurance, remote work, flexible hours",
  company_description: "TechCorp Solutions is a leading technology company",
  application_deadline: 30.days.from_now
)

position2 = Position.create!(
  company: company2,
  interview_flow: flow1,
  title: "Frontend React Developer",
  description: "Looking for a React expert to join our frontend team",
  status: "Open",
  is_visible: true,
  location: "Barcelona, Spain",
  job_description: "Build modern user interfaces with React and TypeScript",
  requirements: "3+ years React experience, TypeScript, CSS expertise",
  responsibilities: "Build UI components, optimize performance, collaborate with designers",
  salary_min: 45000,
  salary_max: 65000,
  employment_type: "Full-time",
  benefits: "Remote work, learning budget, gym membership"
)

# Create Candidates
puts "Creating candidates..."
candidate1 = Candidate.create!(
  first_name: "Alice",
  last_name: "Johnson",
  email: "alice.johnson@example.com",
  phone: "612345678",
  address: "Madrid, Spain"
)

candidate2 = Candidate.create!(
  first_name: "Bob",
  last_name: "Martinez",
  email: "bob.martinez@example.com",
  phone: "698765432",
  address: "Barcelona, Spain"
)

candidate3 = Candidate.create!(
  first_name: "Carol",
  last_name: "Williams",
  email: "carol.williams@example.com",
  phone: "655555555",
  address: "Valencia, Spain"
)

# Create Educations
puts "Creating educations..."
Education.create!(
  candidate: candidate1,
  institution: "Universidad Complutense de Madrid",
  title: "Computer Science Degree",
  start_date: 5.years.ago,
  end_date: 1.year.ago
)

Education.create!(
  candidate: candidate2,
  institution: "Universidad Politécnica de Cataluña",
  title: "Software Engineering Degree",
  start_date: 4.years.ago,
  end_date: 1.year.ago
)

# Create Work Experiences
puts "Creating work experiences..."
WorkExperience.create!(
  candidate: candidate1,
  company: "Previous Tech Company",
  position: "Ruby Developer",
  description: "Developed and maintained Ruby on Rails applications",
  start_date: 2.years.ago,
  end_date: 6.months.ago
)

WorkExperience.create!(
  candidate: candidate2,
  company: "StartupXYZ",
  position: "Frontend Developer",
  description: "Built React applications with TypeScript",
  start_date: 1.year.ago,
  end_date: nil
)

# Create Resumes
puts "Creating resumes..."
Resume.create!(
  candidate: candidate1,
  file_path: "/storage/resumes/alice_johnson_cv.pdf",
  file_type: "application/pdf",
  upload_date: 1.week.ago
)

Resume.create!(
  candidate: candidate2,
  file_path: "/storage/resumes/bob_martinez_cv.pdf",
  file_type: "application/pdf",
  upload_date: 3.days.ago
)

# Create Applications
puts "Creating applications..."
app1 = Application.create!(
  candidate: candidate1,
  position: position1,
  interview_step: step1,
  application_date: 1.week.ago,
  current_interview_step: 0,
  notes: "Strong Ruby background"
)

app2 = Application.create!(
  candidate: candidate2,
  position: position2,
  interview_step: step1,
  application_date: 5.days.ago,
  current_interview_step: 0,
  notes: "Excellent React skills"
)

# Create Interviews
puts "Creating interviews..."
Interview.create!(
  application: app1,
  interview_step: step1,
  employee: employee1,
  interview_date: 3.days.ago,
  result: "Passed",
  score: 85,
  notes: "Good communication skills, strong technical background"
)

Interview.create!(
  application: app2,
  interview_step: step1,
  employee: employee2,
  interview_date: 2.days.ago,
  result: "Passed",
  score: 90,
  notes: "Excellent React knowledge, great cultural fit"
)

puts "Seeds completed successfully!"
puts "Created:"
puts "  - #{Company.count} companies"
puts "  - #{Employee.count} employees"
puts "  - #{Candidate.count} candidates"
puts "  - #{Position.count} positions"
puts "  - #{Application.count} applications"
puts "  - #{Interview.count} interviews"
