export type Candidate = {
  id: number
  first_name: string
  last_name: string
  email: string
  phone?: string
  address?: string
  fitScore?: number
  stage?: string
  lastInteraction?: string
}

export type Position = {
  id: number
  title: string
  description: string
  status: string
  is_visible: boolean
  location: string
  job_description: string
  requirements?: string
  responsibilities?: string
}

export type PipelineCandidate = {
  fullName: string
  currentInterviewStep: string
  candidateId: number
  applicationId: number
  averageScore: number
}

export type AiRecommendation = {
  title: string
  description: string
  confidence: number
  action: string
}

export type CandidateReport = {
  candidate: {
    id: number
    full_name: string
    email: string
    phone?: string
    address?: string
  }
  summary: {
    total_applications: number
    total_interviews: number
    average_score: number
    applications_by_status: Record<string, number>
    current_applications: number
  }
  applications: Array<{
    id: number
    position: {
      id: number
      title: string
      company: string
      status: string
      location: string
    }
    application_date: string
    current_interview_step: number
    interview_step_name: string
    interviews: Array<{
      id: number
      interview_date: string
      interview_step: string
      score?: number
      result?: string
      notes?: string
      employee: string
    }>
    average_score: number
  }>
  education: Array<{
    id: number
    institution: string
    title: string
    start_date: string
    end_date?: string
  }>
  work_experience: Array<{
    id: number
    company: string
    position: string
    description?: string
    start_date: string
    end_date?: string
  }>
  resumes: Array<{
    id: number
    file_path: string
    file_type: string
    upload_date: string
  }>
  generated_at: string
}

export type GenerateReportResponse = {
  message: string
  job_id: string
  candidate_id: number
}

export type CandidateFilters = {
  search?: string
  with_education?: boolean
  experienced?: boolean
  skill?: string
  recent_applications?: boolean
  page?: number
  limit?: number
  sort?: string
  order?: 'asc' | 'desc'
}

