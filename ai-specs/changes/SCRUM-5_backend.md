# Backend Implementation Plan: SCRUM-5 Background Jobs with Sidekiq - Candidate Process Report Generation

## Overview

This ticket implements a background job using Sidekiq to generate demo reports that summarize a candidate's recruitment process. The job will be executed asynchronously to avoid blocking the main application thread and provide a better user experience when generating comprehensive candidate reports.

**Architecture Principles:**
- **Service Objects Pattern**: Business logic encapsulated in service classes
- **Background Jobs**: Asynchronous processing using Sidekiq
- **Separation of Concerns**: Job handles orchestration, service handles business logic
- **Error Handling**: Proper error handling and retry mechanisms

## Architecture Context

### Layers Involved

**Application Layer** (`app/jobs/`)
- `Candidates::ProcessResumeJob` - Background job for report generation

**Service Layer** (`app/services/`)
- `Candidates::GenerateProcessReportService` - Service object to generate the report

**Model Layer** (`app/models/`)
- `Candidate` - Candidate model with associations
- `Application` - Application model with interview data
- `Interview` - Interview model with scores and results

### Components Referenced

- **Sidekiq**: Background job processing (already configured in Gemfile)
- **ActiveJob**: Rails job framework (already configured)
- **Redis**: Required for Sidekiq queue management (already configured)

## Implementation Steps

### Step 0: Create Feature Branch

- **Action**: Create and switch to a new feature branch following the development workflow
- **Branch Naming**: `feature/SCRUM-5-backend` (required naming convention to separate backend concerns)
- **Implementation Steps**:
  1. Ensure you're on the latest `main` or `develop` branch (or appropriate base branch)
  2. Pull latest changes: `git pull origin [base-branch]`
  3. Create new branch: `git checkout -b feature/SCRUM-5-backend`
  4. Verify branch creation: `git branch`
- **Notes**: This must be the FIRST step before any code changes. The branch name must include `-backend` suffix to separate backend implementation from other parts of the ticket.

### Step 1: Configure Sidekiq for ActiveJob

- **File**: `config/application.rb` or `config/environments/development.rb`
- **Action**: Configure ActiveJob to use Sidekiq as the queue adapter
- **Implementation Steps**:
  1. **Check Current Configuration**: Verify if ActiveJob queue adapter is already configured
  2. **Add Sidekiq Configuration**: 
     - In `config/application.rb` or environment-specific files, add:
       ```ruby
       config.active_job.queue_adapter = :sidekiq
       ```
  3. **Verify Redis Configuration**: Ensure `REDIS_URL` is set in `.env` file
  4. **Test Configuration**: Verify Sidekiq can connect to Redis
- **Dependencies**: 
  - `sidekiq` gem (already in Gemfile)
  - `redis` gem (already in Gemfile)
  - Redis server running
- **Implementation Notes**: 
  - Sidekiq requires Redis to be running
  - In development, ensure Redis is accessible at the configured URL
  - Consider adding Sidekiq web UI for monitoring (optional but recommended)

### Step 2: Create Report Generation Service

- **File**: `app/services/candidates/generate_process_report_service.rb`
- **Action**: Create a service object to generate candidate process reports
- **Function Signature**:
  ```ruby
  module Candidates
    class GenerateProcessReportService
      def call(candidate_id)
        # Returns hash with report data
      end
    end
  end
  ```
- **Implementation Steps**:
  1. **Create Service File**: Create `app/services/candidates/generate_process_report_service.rb`
  2. **Define Service Class**: 
     - Create `Candidates::GenerateProcessReportService` class
     - Include error handling with proper exception management
  3. **Implement Report Generation Logic**:
     - **Load Candidate Data**: 
       - Find candidate by ID with eager loading of associations
       - Use `includes` to prevent N+1 queries: `includes(:applications, :educations, :work_experiences, :resumes, applications: [:position, :interviews])`
     - **Collect Application Data**:
       - Get all applications for the candidate
       - For each application, collect:
         - Position details (title, company, status)
         - Application date and current interview step
         - Interview history (dates, scores, results, notes)
         - Average interview score per application
     - **Collect Education Data**:
       - List all education records with institution, title, dates
     - **Collect Work Experience Data**:
       - List all work experiences with company, position, description, dates
     - **Collect Resume Data**:
       - List all resumes with file type and upload dates
     - **Calculate Statistics**:
       - Total number of applications
       - Total number of interviews
       - Average interview score across all interviews
       - Current applications status breakdown
       - Applications by position status
  4. **Structure Report Data**:
     - Return a hash with the following structure:
       ```ruby
       {
         candidate: {
           id: candidate.id,
           full_name: candidate.full_name,
           email: candidate.email,
           phone: candidate.phone,
           address: candidate.address
         },
         summary: {
           total_applications: count,
           total_interviews: count,
           average_score: float,
           applications_by_status: hash
         },
         applications: array_of_application_data,
         education: array_of_education_data,
         work_experience: array_of_work_experience_data,
         resumes: array_of_resume_data,
         generated_at: timestamp
       }
       ```
  5. **Add Error Handling**:
     - Handle `ActiveRecord::RecordNotFound` if candidate doesn't exist
     - Log errors appropriately
     - Return meaningful error messages
- **Dependencies**: 
  - `Candidate` model
  - `Application` model
  - `Interview` model
  - `Education` model
  - `WorkExperience` model
  - `Resume` model
- **Implementation Notes**:
  - Use eager loading to prevent N+1 queries
  - Ensure all data is properly serialized (dates as ISO strings)
  - Consider adding caching for frequently accessed reports
  - Follow Rails conventions for service objects
  - All code and comments must be in English

### Step 3: Create Background Job

- **File**: `app/jobs/candidates/process_resume_job.rb`
- **Action**: Create Sidekiq background job to generate candidate process reports
- **Function Signature**:
  ```ruby
  class Candidates::ProcessResumeJob < ApplicationJob
    queue_as :default
    
    def perform(candidate_id, options = {})
      # Generate and optionally store/send report
    end
  end
  ```
- **Implementation Steps**:
  1. **Create Job File**: Create `app/jobs/candidates/process_resume_job.rb`
  2. **Define Job Class**:
     - Inherit from `ApplicationJob`
     - Set queue name: `queue_as :default` (or `:reports` for better organization)
  3. **Implement Perform Method**:
     - **Validate Input**: 
       - Check that `candidate_id` is present and valid
       - Validate candidate exists before processing
     - **Generate Report**:
       - Call `Candidates::GenerateProcessReportService.new.call(candidate_id)`
       - Handle service errors appropriately
     - **Process Report** (based on options):
       - **Store Report**: Save report to file system or database (optional)
       - **Send Report**: Email report to candidate or recruiter (optional)
       - **Log Report**: Log report generation for audit purposes
     - **Handle Errors**:
       - Catch and log exceptions
       - Use Sidekiq's retry mechanism for transient errors
       - Discard job for permanent errors (e.g., candidate not found)
  4. **Add Job Configuration**:
     - **Retry Configuration**: 
       - Retry on transient errors (network, temporary DB issues)
       - Use `retry_on` for specific exceptions
     - **Discard Configuration**:
       - Discard on permanent errors (record not found)
       - Use `discard_on` for specific exceptions
     - **Timeout Configuration**: Set appropriate timeout for job execution
  5. **Add Logging**:
     - Log job start with candidate_id
     - Log job completion with timing information
     - Log errors with full context
- **Dependencies**: 
  - `Candidates::GenerateProcessReportService`
  - `ApplicationJob` base class
  - Sidekiq configuration
- **Implementation Notes**:
  - Follow Rails ActiveJob conventions
  - Use Sidekiq-specific features (retry_on, discard_on) appropriately
  - Consider adding job idempotency if needed
  - All code and comments must be in English
  - Job should be idempotent (safe to retry)

### Step 4: Create Controller Endpoint (Optional but Recommended)

- **File**: `app/controllers/api/v1/candidates_controller.rb`
- **Action**: Add endpoint to trigger report generation
- **Function Signature**:
  ```ruby
  def generate_report
    # Enqueue job and return job id
  end
  ```
- **Implementation Steps**:
  1. **Add Route**: 
     - In `config/routes.rb`, add: `post :generate_report, on: :member` to candidates resources
     - Route: `POST /api/v1/candidates/:id/generate_report`
  2. **Add Controller Method**:
     - **Validate Candidate**: Ensure candidate exists
     - **Enqueue Job**: 
       - Call `Candidates::ProcessResumeJob.perform_later(candidate.id)`
       - Store job ID for tracking (optional)
     - **Return Response**:
       - Return JSON with job status and job ID
       - Format: `{ message: "Report generation started", job_id: "..." }`
  3. **Add Error Handling**:
     - Handle candidate not found
     - Handle job enqueue failures
- **Dependencies**: 
  - `Candidates::ProcessResumeJob`
  - `Candidate` model
- **Implementation Notes**:
  - This endpoint should return immediately (async)
  - Consider adding authentication/authorization if needed
  - Return appropriate HTTP status codes (202 Accepted for async operations)

### Step 5: Configure Sidekiq Web UI (Optional but Recommended)

- **File**: `config/routes.rb`
- **Action**: Add Sidekiq web UI for monitoring jobs
- **Implementation Steps**:
  1. **Add Route**: 
     - Add Sidekiq web UI route (protected in production)
     - Example: `require 'sidekiq/web'; mount Sidekiq::Web => '/sidekiq'`
  2. **Add Authentication** (for production):
     - Protect Sidekiq web UI with authentication
     - Use environment-based access control
- **Dependencies**: 
  - `sidekiq` gem
- **Implementation Notes**:
  - Sidekiq web UI is useful for monitoring and debugging
  - Should be protected in production environments
  - Consider adding basic auth or integrating with app authentication

### Step 6: Write Unit Tests

- **File**: `spec/jobs/candidates/process_resume_job_spec.rb` and `spec/services/candidates/generate_process_report_service_spec.rb`
- **Action**: Write comprehensive tests for the job and service
- **Implementation Steps**:

#### 6.1: Test GenerateProcessReportService

**File**: `spec/services/candidates/generate_process_report_service_spec.rb`

1. **Setup**:
   - Use FactoryBot to create test data
   - Create candidate with associations (applications, interviews, education, work_experience, resumes)

2. **Successful Cases**:
   - **Test Report Generation**: 
     - Verify service returns correct report structure
     - Verify all candidate data is included
     - Verify all applications are included with correct data
     - Verify interview data is correctly aggregated
     - Verify statistics are calculated correctly
   - **Test Eager Loading**: 
     - Verify no N+1 queries using `ActiveRecord::Base.logger`
     - Use `assert_queries` or similar to verify query count

3. **Validation Errors**:
   - **Test Invalid Candidate ID**: 
     - Verify service raises appropriate error for non-existent candidate
     - Verify error message is clear and actionable

4. **Edge Cases**:
   - **Test Candidate with No Applications**: 
     - Verify report handles candidate with no applications gracefully
     - Verify statistics show zero values appropriately
   - **Test Candidate with No Interviews**: 
     - Verify average score calculation handles no interviews
   - **Test Candidate with Partial Data**: 
     - Verify report handles missing optional fields (phone, address, etc.)

#### 6.2: Test ProcessResumeJob

**File**: `spec/jobs/candidates/process_resume_job_spec.rb`

1. **Setup**:
   - Configure test environment to use inline adapter or test adapter
   - Use FactoryBot for test data

2. **Successful Cases**:
   - **Test Job Execution**: 
     - Enqueue and perform job
     - Verify service is called with correct parameters
     - Verify job completes successfully
   - **Test Job with Options**: 
     - Test job with different option parameters
     - Verify options are handled correctly

3. **Error Handling**:
   - **Test Record Not Found**: 
     - Verify job handles non-existent candidate gracefully
     - Verify job is discarded (not retried) for permanent errors
   - **Test Service Errors**: 
     - Mock service to raise errors
     - Verify job retries on transient errors
     - Verify job discards on permanent errors

4. **Sidekiq Integration**:
   - **Test Job Enqueueing**: 
     - Verify job is enqueued correctly
     - Verify job appears in Sidekiq queue
   - **Test Job Retry**: 
     - Verify retry mechanism works for transient errors

5. **Edge Cases**:
   - **Test Concurrent Jobs**: 
     - Verify multiple jobs for same candidate can run (if allowed)
     - Or verify idempotency if only one job should run

- **Dependencies**: 
  - `rspec-rails` gem
  - `factory_bot_rails` gem
  - `sidekiq` testing helpers
- **Implementation Notes**:
  - Use `Sidekiq::Testing.fake!` or `Sidekiq::Testing.inline!` for testing
  - Mock external dependencies (file system, email) if needed
  - Ensure test coverage is comprehensive
  - All test descriptions and assertions must be in English

### Step 7: Update Technical Documentation

- **Action**: Review and update technical documentation according to changes made
- **Implementation Steps**:
  1. **Review Changes**: Analyze all code changes made during implementation
     - New job: `Candidates::ProcessResumeJob`
     - New service: `Candidates::GenerateProcessReportService`
     - Configuration changes: Sidekiq adapter configuration
     - New endpoint: `POST /api/v1/candidates/:id/generate_report` (if implemented)
  2. **Identify Documentation Files**: Determine which documentation files need updates:
     - **API Endpoints**: Update `ai-specs/specs/api-spec.yml` with new endpoint (if controller endpoint was added)
     - **Backend Standards**: Update `ai-specs/specs/backend-standards.mdc` if new patterns or conventions were established
     - **README**: Update `backend/README.md` with information about background jobs and Sidekiq
  3. **Update Documentation**: For each affected file:
     - **api-spec.yml** (if endpoint added):
       - Add endpoint specification for `POST /api/v1/candidates/:id/generate_report`
       - Include request/response examples
       - Document async nature of the endpoint
     - **backend/README.md**:
       - Add section about background jobs
       - Document how to start Sidekiq worker
       - Document how to monitor jobs (Sidekiq web UI)
       - Add example of enqueueing jobs
     - **backend-standards.mdc** (if applicable):
       - Add section about background job patterns
       - Document Sidekiq configuration
       - Document job testing patterns
  4. **Verify Documentation**: 
     - Confirm all changes are accurately reflected
     - Check that documentation follows established structure
     - Ensure all examples are correct and runnable
  5. **Report Updates**: Document which files were updated and what changes were made
- **References**: 
  - Follow process described in `ai-specs/specs/documentation-standards.mdc`
  - All documentation must be written in English
- **Notes**: This step is MANDATORY before considering the implementation complete. Do not skip documentation updates.

## Implementation Order

1. **Step 0**: Create Feature Branch (`feature/SCRUM-5-backend`)
2. **Step 1**: Configure Sidekiq for ActiveJob
3. **Step 2**: Create Report Generation Service (`Candidates::GenerateProcessReportService`)
4. **Step 3**: Create Background Job (`Candidates::ProcessResumeJob`)
5. **Step 4**: Create Controller Endpoint (optional but recommended)
6. **Step 5**: Configure Sidekiq Web UI (optional but recommended)
7. **Step 6**: Write Unit Tests (service and job)
8. **Step 7**: Update Technical Documentation

## Testing Checklist

### Post-Implementation Verification

- [ ] **Sidekiq Configuration**:
  - [ ] ActiveJob is configured to use Sidekiq adapter
  - [ ] Redis connection is working
  - [ ] Sidekiq worker can start successfully

- [ ] **Service Functionality**:
  - [ ] Service generates report with correct structure
  - [ ] All candidate data is included in report
  - [ ] Statistics are calculated correctly
  - [ ] No N+1 queries (verified with query logging)
  - [ ] Error handling works for invalid candidate ID

- [ ] **Job Functionality**:
  - [ ] Job can be enqueued successfully
  - [ ] Job executes and calls service correctly
  - [ ] Job handles errors appropriately
  - [ ] Retry mechanism works for transient errors
  - [ ] Discard mechanism works for permanent errors

- [ ] **Controller Endpoint** (if implemented):
  - [ ] Endpoint returns 202 Accepted status
  - [ ] Job is enqueued when endpoint is called
  - [ ] Error handling works for non-existent candidate

- [ ] **Testing**:
  - [ ] All unit tests pass
  - [ ] Test coverage meets project standards
  - [ ] Edge cases are covered

- [ ] **Documentation**:
  - [ ] API documentation updated (if endpoint added)
  - [ ] README updated with Sidekiq information
  - [ ] Code comments are clear and in English

## Error Response Format

### Service Errors

**Candidate Not Found**:
```json
{
  "error": "Candidate not found",
  "candidate_id": 123
}
```

### Job Errors

**Job Enqueue Failure**:
- Sidekiq will log the error
- Job will be retried according to configuration

**Job Execution Failure**:
- Transient errors: Job will be retried
- Permanent errors: Job will be discarded

### API Endpoint Errors (if implemented)

**Candidate Not Found** (404):
```json
{
  "message": "Record not found",
  "error": "Couldn't find Candidate with 'id'=123"
}
```

**Job Enqueue Failure** (500):
```json
{
  "message": "Failed to enqueue report generation job",
  "error": "Error message"
}
```

## Dependencies

### External Libraries

- **sidekiq** (~> 7.0) - Already in Gemfile
- **redis** (~> 4.0) - Already in Gemfile
- **activejob** - Part of Rails, already available

### Infrastructure

- **Redis Server**: Required for Sidekiq queue management
  - Must be running and accessible
  - URL configured in `REDIS_URL` environment variable

### Internal Dependencies

- `Candidate` model with associations
- `Application` model
- `Interview` model
- `Education` model
- `WorkExperience` model
- `Resume` model

## Notes

### Business Rules

- Reports should include all candidate data: applications, interviews, education, work experience, and resumes
- Statistics should be calculated accurately (averages, counts, breakdowns)
- Reports should be generated asynchronously to avoid blocking the main application

### Technical Constraints

- **Redis Required**: Sidekiq requires Redis to be running
- **Eager Loading**: Must use eager loading to prevent N+1 queries
- **Error Handling**: Jobs must handle errors gracefully with appropriate retry/discard logic
- **Idempotency**: Jobs should be idempotent (safe to retry)

### Language Requirements

- All code, comments, error messages, and documentation must be in **English**
- Variable names, method names, and class names must be in English
- Test descriptions and assertions must be in English

### Performance Considerations

- Use eager loading (`includes`) to prevent N+1 queries
- Consider caching reports for frequently accessed candidates
- Job execution should complete within reasonable time (consider timeout configuration)
- Consider rate limiting if reports are generated frequently

### Security Considerations

- Validate candidate_id to prevent unauthorized access
- Consider adding authentication/authorization to controller endpoint
- Protect Sidekiq web UI in production environments

## Next Steps After Implementation

1. **Integration Testing**: 
   - Test job execution in development environment
   - Verify Sidekiq worker processes jobs correctly
   - Test with real candidate data

2. **Monitoring Setup**: 
   - Configure Sidekiq web UI for production (with authentication)
   - Set up monitoring/alerting for failed jobs
   - Configure logging for job execution

3. **Performance Optimization** (if needed):
   - Profile report generation for slow queries
   - Add caching if reports are accessed frequently
   - Optimize database queries if needed

4. **Frontend Integration** (if applicable):
   - Frontend can call the endpoint to trigger report generation
   - Frontend can poll for job status or use WebSockets for real-time updates

5. **Additional Features** (future enhancements):
   - Store generated reports in database or file system
   - Email reports to candidates or recruiters
   - Generate PDF reports
   - Schedule periodic report generation

## Implementation Verification

### Code Quality

- [ ] Code follows Rails conventions
- [ ] Code is properly formatted (RuboCop passes)
- [ ] All methods have appropriate error handling
- [ ] Code is well-documented with comments
- [ ] No code duplication (DRY principle)

### Functionality

- [ ] Service generates reports correctly
- [ ] Job executes successfully
- [ ] Error handling works as expected
- [ ] No N+1 queries in service
- [ ] Statistics are calculated correctly

### Testing

- [ ] All unit tests pass
- [ ] Test coverage meets project standards (90%+)
- [ ] Edge cases are covered
- [ ] Error cases are tested

### Integration

- [ ] Sidekiq worker can process jobs
- [ ] Redis connection is stable
- [ ] Job retry mechanism works
- [ ] Controller endpoint works (if implemented)

### Documentation Updates Completed

- [ ] API documentation updated (if endpoint added)
- [ ] README updated with Sidekiq information
- [ ] Code comments are clear and in English
- [ ] All documentation is in English

