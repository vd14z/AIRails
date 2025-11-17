# Frontend Implementation Plan: SCRUM-6 Candidate Process Report Frontend

## Overview

This ticket implements the frontend interface for generating and displaying candidate process reports. The feature allows users to trigger report generation for a candidate and view a comprehensive summary of their recruitment process, including applications, interviews, education, work experience, and resumes.

**Frontend Architecture Principles:**
- **Component-Based Architecture**: Reusable React components following Chakra UI v3 patterns
- **Service Layer**: API communication centralized in service files using TanStack Query
- **State Management**: React hooks and TanStack Query for server state
- **Type Safety**: Full TypeScript implementation with proper type definitions
- **User Experience**: Loading states, error handling, and async operation feedback

## Architecture Context

### Components/Services Involved

**New Components** (`src/features/candidate-report/`):
- `CandidateReportPage` - Main page component for viewing candidate reports
- `ReportSummary` - Component displaying summary statistics
- `ApplicationsSection` - Component displaying candidate applications
- `EducationSection` - Component displaying education history
- `WorkExperienceSection` - Component displaying work experience
- `ResumesSection` - Component displaying uploaded resumes

**Services** (`src/services/api/`):
- `hooks.ts` - Add hooks for report generation and fetching
- `types.ts` - Add TypeScript types for report data structure
- `queryKeys.ts` - Add query keys for report-related queries

**Routing** (`src/router.tsx`):
- Add route for candidate report page

### Files Referenced

- `src/features/pipeline/components/CandidateCard.tsx` - Add action to generate/view report
- `src/services/api/client.ts` - API client configuration
- `src/services/api/hooks.ts` - TanStack Query hooks
- `src/services/api/types.ts` - TypeScript type definitions
- `src/router.tsx` - Application routing

### Routing Considerations

- Route: `/candidates/:id/report`
- Accessible from candidate cards in pipeline or candidate detail pages
- May need navigation breadcrumbs

### State Management Approach

- **Server State**: Use TanStack Query for report data fetching and mutations
- **Local State**: React hooks (`useState`) for UI state (loading, errors, modal visibility)
- **Optimistic Updates**: Not required for report generation (async operation)

## Implementation Steps

### Step 0: Create Feature Branch

- **Action**: Create and switch to a new feature branch following the development workflow
- **Branch Naming**: `feature/SCRUM-6-frontend` (required naming convention to separate frontend concerns)
- **Implementation Steps**:
  1. Ensure you're on the latest `main` or `develop` branch (or appropriate base branch)
  2. Pull latest changes: `git pull origin [base-branch]`
  3. Create new branch: `git checkout -b feature/SCRUM-6-frontend`
  4. Verify branch creation: `git branch`
- **Notes**: This must be the FIRST step before any code changes. The branch name must include `-frontend` suffix to separate frontend implementation from other parts of the ticket.

### Step 1: Add TypeScript Types for Report Data

- **File**: `src/services/api/types.ts`
- **Action**: Add TypeScript type definitions for the candidate report structure
- **Function Signature**:
  ```typescript
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
  ```
- **Implementation Steps**:
  1. Open `src/services/api/types.ts`
  2. Add `CandidateReport` type definition matching the backend response structure
  3. Add `GenerateReportResponse` type for the job initiation response
  4. Ensure all date fields are strings (ISO 8601 format from backend)
  5. Mark optional fields with `?` where appropriate
- **Dependencies**: None
- **Implementation Notes**:
  - Types must match exactly the backend response structure from `GenerateProcessReportService`
  - Use `Record<string, number>` for `applications_by_status` (dynamic keys)
  - All dates are ISO 8601 strings from backend
  - All code and comments must be in English

### Step 2: Add Query Keys for Report Operations

- **File**: `src/services/api/queryKeys.ts`
- **Action**: Add query keys for report generation and fetching
- **Function Signature**:
  ```typescript
  export const queryKeys = {
    // ... existing keys
    candidateReport: (candidateId: number) => ['candidate-report', candidateId] as const,
    generateReport: (candidateId: number) => ['generate-report', candidateId] as const,
  }
  ```
- **Implementation Steps**:
  1. Open `src/services/api/queryKeys.ts`
  2. Add `candidateReport` query key function that takes `candidateId`
  3. Add `generateReport` mutation key function (optional, for tracking)
  4. Follow existing pattern with `as const` for type safety
- **Dependencies**: None
- **Implementation Notes**:
  - Query keys should be unique and descriptive
  - Use `as const` for better TypeScript inference
  - Follow existing naming conventions

### Step 3: Create API Service Methods and Hooks

- **File**: `src/services/api/hooks.ts`
- **Action**: Add TanStack Query hooks for generating and fetching candidate reports
- **Function Signature**:
  ```typescript
  export const useGenerateReportMutation = () =>
    useMutation({
      mutationFn: async (candidateId: number) => {
        const response = await apiClient.post<GenerateReportResponse>(
          `/candidates/${candidateId}/generate_report`
        )
        return response.data
      },
    })

  export const useCandidateReportQuery = (candidateId: number, enabled = true) =>
    useQuery({
      queryKey: queryKeys.candidateReport(candidateId),
      queryFn: async () => {
        const response = await apiClient.get<CandidateReport>(
          `/candidates/${candidateId}/report`
        )
        return response.data
      },
      enabled: enabled && Boolean(candidateId),
    })
  ```
- **Implementation Steps**:
  1. **Add Generate Report Mutation** (Optional - for async generation):
     - Create `useGenerateReportMutation` hook using `useMutation`
     - Call `POST /api/v1/candidates/:id/generate_report`
     - Return `GenerateReportResponse` type
     - Handle errors appropriately
     - **Note**: This is optional since we have a synchronous GET endpoint
  2. **Add Fetch Report Query**:
     - Create `useCandidateReportQuery` hook using `useQuery`
     - Call `GET /api/v1/candidates/:id/report`
     - Return `CandidateReport` type
     - Add `enabled` parameter to control when query runs
     - Handle loading and error states
     - The endpoint generates the report synchronously on-demand
  3. **Add Error Handling**:
     - Ensure errors are properly typed and handled
     - Use TanStack Query's built-in error handling
- **Dependencies**: 
  - `apiClient` from `./client`
  - `CandidateReport`, `GenerateReportResponse` from `./types`
  - `queryKeys` from `./queryKeys`
- **Implementation Notes**:
  - **Backend Endpoint Available**: The backend provides `GET /api/v1/candidates/:id/report` which generates the report synchronously on-demand
  - The GET endpoint is the primary method for fetching reports
  - The POST endpoint (`generate_report`) is available for asynchronous generation via Sidekiq if needed
  - All code and comments must be in English
  - Use proper TypeScript types throughout

### Step 4: Create Report Summary Component

- **File**: `src/features/candidate-report/components/ReportSummary.tsx`
- **Action**: Create component to display report summary statistics
- **Component Signature**:
  ```typescript
  type ReportSummaryProps = {
    summary: CandidateReport['summary']
  }

  export function ReportSummary({ summary }: ReportSummaryProps) {
    // Display summary statistics
  }
  ```
- **Implementation Steps**:
  1. **Create Component File**: Create `src/features/candidate-report/components/ReportSummary.tsx`
  2. **Import Dependencies**:
     - Import Chakra UI components: `Box`, `SimpleGrid`, `Text`, `Heading`, `Stat`, `StatLabel`, `StatNumber`, `StatHelpText`
     - Import `CandidateReport` type
  3. **Implement Summary Display**:
     - Display `total_applications` in a stat card
     - Display `total_interviews` in a stat card
     - Display `average_score` in a stat card with percentage format
     - Display `current_applications` in a stat card
     - Display `applications_by_status` breakdown (use `SimpleGrid` for layout)
  4. **Add Styling**:
     - Use Chakra UI components for consistent styling
     - Follow dark theme patterns from existing components
     - Ensure responsive layout
- **Dependencies**: 
  - Chakra UI components
  - `CandidateReport` type
- **Implementation Notes**:
  - Use Chakra UI `Stat` components for statistics display
  - Format `average_score` as percentage (e.g., "85%")
  - Use `SimpleGrid` for responsive layout
  - Follow existing component patterns from `StatCard` component
  - All code and comments must be in English

### Step 5: Create Applications Section Component

- **File**: `src/features/candidate-report/components/ApplicationsSection.tsx`
- **Action**: Create component to display candidate applications with interview history
- **Component Signature**:
  ```typescript
  type ApplicationsSectionProps = {
    applications: CandidateReport['applications']
  }

  export function ApplicationsSection({ applications }: ApplicationsSectionProps) {
    // Display applications list
  }
  ```
- **Implementation Steps**:
  1. **Create Component File**: Create `src/features/candidate-report/components/ApplicationsSection.tsx`
  2. **Import Dependencies**:
     - Import Chakra UI components: `Box`, `VStack`, `HStack`, `Text`, `Heading`, `Badge`, `Accordion`
     - Import `CandidateReport` type
     - Import date formatting utility (e.g., `dayjs`)
  3. **Implement Applications Display**:
     - Use `Accordion` or `VStack` to display each application
     - For each application, show:
       - Position title and company
       - Application date (formatted)
       - Current interview step
       - Average score
       - Status badge
     - Display interview history in expandable section:
       - Interview date
       - Interview step name
       - Score (if available)
       - Result (if available)
       - Notes (if available)
       - Interviewer name
  4. **Add Formatting**:
     - Format dates using `dayjs` (already in dependencies)
     - Format scores as percentages
     - Use color-coded badges for status
- **Dependencies**: 
  - Chakra UI components
  - `CandidateReport` type
  - `dayjs` for date formatting
- **Implementation Notes**:
  - Use `Accordion` component for expandable interview history
  - Format dates in user-friendly format (e.g., "January 15, 2024")
  - Use color-coded badges for application status
  - Handle empty states (no applications, no interviews)
  - All code and comments must be in English

### Step 6: Create Education Section Component

- **File**: `src/features/candidate-report/components/EducationSection.tsx`
- **Action**: Create component to display candidate education history
- **Component Signature**:
  ```typescript
  type EducationSectionProps = {
    education: CandidateReport['education']
  }

  export function EducationSection({ education }: EducationSectionProps) {
    // Display education list
  }
  ```
- **Implementation Steps**:
  1. **Create Component File**: Create `src/features/candidate-report/components/EducationSection.tsx`
  2. **Import Dependencies**:
     - Import Chakra UI components: `Box`, `VStack`, `HStack`, `Text`, `Heading`
     - Import `CandidateReport` type
     - Import `dayjs` for date formatting
  3. **Implement Education Display**:
     - Display education records in a list
     - For each education record, show:
       - Institution name
       - Title/degree
       - Date range (start_date - end_date or "Present" if ongoing)
     - Use `VStack` for vertical layout
     - Add visual separator between items
  4. **Add Formatting**:
     - Format dates using `dayjs`
     - Handle ongoing education (no end_date)
- **Dependencies**: 
  - Chakra UI components
  - `CandidateReport` type
  - `dayjs` for date formatting
- **Implementation Notes**:
  - Display in chronological order (most recent first)
  - Use consistent date format
  - Handle empty state (no education records)
  - All code and comments must be in English

### Step 7: Create Work Experience Section Component

- **File**: `src/features/candidate-report/components/WorkExperienceSection.tsx`
- **Action**: Create component to display candidate work experience
- **Component Signature**:
  ```typescript
  type WorkExperienceSectionProps = {
    workExperience: CandidateReport['work_experience']
  }

  export function WorkExperienceSection({ workExperience }: WorkExperienceSectionProps) {
    // Display work experience list
  }
  ```
- **Implementation Steps**:
  1. **Create Component File**: Create `src/features/candidate-report/components/WorkExperienceSection.tsx`
  2. **Import Dependencies**:
     - Import Chakra UI components: `Box`, `VStack`, `HStack`, `Text`, `Heading`
     - Import `CandidateReport` type
     - Import `dayjs` for date formatting
  3. **Implement Work Experience Display**:
     - Display work experience records in a list
     - For each experience, show:
       - Company name
       - Position/title
       - Description (if available)
       - Date range (start_date - end_date or "Present" if ongoing)
     - Use `VStack` for vertical layout
     - Add visual separator between items
  4. **Add Formatting**:
     - Format dates using `dayjs`
     - Handle ongoing positions (no end_date)
     - Truncate long descriptions if needed
- **Dependencies**: 
  - Chakra UI components
  - `CandidateReport` type
  - `dayjs` for date formatting
- **Implementation Notes**:
  - Display in chronological order (most recent first)
  - Use consistent date format
  - Handle empty state (no work experience)
  - All code and comments must be in English

### Step 8: Create Resumes Section Component

- **File**: `src/features/candidate-report/components/ResumesSection.tsx`
- **Action**: Create component to display candidate resumes
- **Component Signature**:
  ```typescript
  type ResumesSectionProps = {
    resumes: CandidateReport['resumes']
  }

  export function ResumesSection({ resumes }: ResumesSectionProps) {
    // Display resumes list
  }
  ```
- **Implementation Steps**:
  1. **Create Component File**: Create `src/features/candidate-report/components/ResumesSection.tsx`
  2. **Import Dependencies**:
     - Import Chakra UI components: `Box`, `VStack`, `HStack`, `Text`, `Heading`, `Button`, `Icon`
     - Import `CandidateReport` type
     - Import `dayjs` for date formatting
     - Import file icon from `react-icons/fi` (e.g., `FiFile`)
  3. **Implement Resumes Display**:
     - Display resume records in a list
     - For each resume, show:
       - File type badge (PDF, DOCX)
       - Upload date (formatted)
       - Download/view button (if file_path is accessible)
     - Use `HStack` for horizontal layout
     - Add visual separator between items
  4. **Add Functionality**:
     - Add download button (if file access is available)
     - Display file type icon
     - Format upload dates
- **Dependencies**: 
  - Chakra UI components
  - `CandidateReport` type
  - `dayjs` for date formatting
  - `react-icons/fi` for icons
- **Implementation Notes**:
  - Display in reverse chronological order (most recent first)
  - Handle file download (may require backend endpoint for file serving)
  - Handle empty state (no resumes)
  - All code and comments must be in English

### Step 9: Create Main Report Page Component

- **File**: `src/features/candidate-report/pages/CandidateReportPage.tsx`
- **Action**: Create main page component that orchestrates report generation and display
- **Component Signature**:
  ```typescript
  export function CandidateReportPage() {
    // Get candidate ID from route params
    // Handle report generation
    // Display report or loading/error states
  }
  ```
- **Implementation Steps**:
  1. **Create Component File**: Create `src/features/candidate-report/pages/CandidateReportPage.tsx`
  2. **Import Dependencies**:
     - Import React hooks: `useState`, `useEffect`
     - Import `useParams` from `react-router-dom`
     - Import Chakra UI components: `Box`, `VStack`, `Button`, `Spinner`, `Text`, `Alert`, `AlertIcon`
     - Import report hooks: `useGenerateReportMutation`, `useCandidateReportQuery`
     - Import section components: `ReportSummary`, `ApplicationsSection`, `EducationSection`, `WorkExperienceSection`, `ResumesSection`
     - Import `SectionHeader` from `@/components/ui/SectionHeader`
  3. **Implement Route Parameter Extraction**:
     - Use `useParams` to get `candidateId` from route
     - Convert to number and validate
  4. **Implement Report Fetching Logic**:
     - Use `useCandidateReportQuery` to fetch report data
     - The query will automatically trigger when component mounts and `candidateId` is available
     - The backend endpoint generates the report synchronously on-demand
     - No polling or manual generation trigger needed
  5. **Implement Report Display**:
     - Display loading spinner while fetching (`isLoading` from query)
     - Display error message if fetch fails (`error` from query)
     - Render report sections when data is available (`data` from query):
       - Candidate information header
       - `ReportSummary` component
       - `ApplicationsSection` component
       - `EducationSection` component
       - `WorkExperienceSection` component
       - `ResumesSection` component
  6. **Add Navigation**:
     - Add back button to return to previous page
     - Use `useNavigate` from `react-router-dom`
  7. **Add Refresh Functionality** (Optional):
     - Add refresh button to manually refetch report
     - Use `refetch` function from `useCandidateReportQuery`
     - Show loading state during refresh
- **Dependencies**: 
  - React Router DOM
  - Chakra UI components
  - Report hooks and types
  - Section components
- **Implementation Notes**:
  - **Direct Fetching**: The backend provides `GET /api/v1/candidates/:id/report` which generates the report synchronously
  - Simply use `useCandidateReportQuery` with the candidate ID - no polling needed
  - The query will automatically fetch when the component mounts
  - Show appropriate loading states using `isLoading` from the query
  - Handle errors gracefully with user-friendly messages using `error` from the query
  - Optionally add a refresh button using the `refetch` function from the query
  - All code and comments must be in English

### Step 10: Add Report Generation Action to Candidate Card

- **File**: `src/features/pipeline/components/CandidateCard.tsx`
- **Action**: Add button/action to generate report from candidate card
- **Implementation Steps**:
  1. **Add Generate Report Button**:
     - Add new `IconButton` with report icon (e.g., `FiFileText` from `react-icons/fi`)
     - Add click handler that navigates to report page
     - Or trigger report generation directly
  2. **Add Navigation**:
     - Use `useNavigate` from `react-router-dom`
     - Navigate to `/candidates/:id/report` on click
  3. **Add Tooltip**:
     - Add tooltip explaining the action ("Generate Report" or "View Report")
- **Dependencies**: 
  - React Router DOM
  - `react-icons/fi`
  - Chakra UI `IconButton` and `Tooltip` (if available)
- **Implementation Notes**:
  - Add button to existing action buttons in `CandidateCard`
  - Use consistent icon and styling with other action buttons
  - Consider adding loading state if generating report directly
  - All code and comments must be in English

### Step 11: Add Route for Report Page

- **File**: `src/router.tsx`
- **Action**: Add route for candidate report page
- **Implementation Steps**:
  1. **Import Report Page Component**:
     - Import `CandidateReportPage` from `./features/candidate-report/pages/CandidateReportPage`
  2. **Add Route**:
     - Add route: `{ path: '/candidates/:id/report', element: <CandidateReportPage /> }`
     - Place route before catch-all routes if any
  3. **Verify Route**:
     - Ensure route parameter `:id` matches component expectations
- **Dependencies**: 
  - `CandidateReportPage` component
  - React Router DOM
- **Implementation Notes**:
  - Route should be accessible from candidate cards
  - Consider adding route protection if authentication is implemented
  - All code and comments must be in English

### Step 12: Write Component Tests (Optional but Recommended)

- **File**: `src/features/candidate-report/components/*.test.tsx`
- **Action**: Write unit tests for report components
- **Implementation Steps**:
  1. **Test ReportSummary Component**:
     - Test rendering with valid summary data
     - Test formatting of statistics
     - Test empty state handling
  2. **Test Section Components**:
     - Test rendering with data
     - Test empty states
     - Test date formatting
  3. **Test CandidateReportPage**:
     - Test route parameter extraction
     - Test report generation flow
     - Test loading and error states
     - Test polling mechanism (if implemented)
- **Dependencies**: 
  - Testing library (Jest, React Testing Library)
- **Implementation Notes**:
  - Use React Testing Library for component testing
  - Mock API calls using TanStack Query's test utilities
  - Test user interactions and state changes
  - All test descriptions must be in English

### Step 13: Update Technical Documentation

- **Action**: Review and update technical documentation according to changes made
- **Implementation Steps**:
  1. **Review Changes**: Analyze all code changes made during implementation
     - New components: Report page and section components
     - New API hooks: `useGenerateReportMutation`, `useCandidateReportQuery`
     - New types: `CandidateReport`, `GenerateReportResponse`
     - Route changes: New route for report page
     - UI changes: New action button in candidate card
  2. **Identify Documentation Files**: Determine which documentation files need updates:
     - **API Endpoints**: Update `ai-specs/specs/api-spec.yml` if new endpoint is added (GET /candidates/:id/report)
     - **Frontend Standards**: Update `ai-specs/specs/frontend-standards.mdc` if new patterns are established
     - **README**: Update `frontend/README.md` with new feature information
  3. **Update Documentation**: For each affected file:
     - **api-spec.yml** (if GET endpoint added):
       - Add endpoint specification for `GET /api/v1/candidates/:id/report`
       - Include request/response examples
       - Document response structure
     - **frontend/README.md**:
       - Add section about candidate report feature
       - Document how to access reports
       - Add screenshots or descriptions if available
     - **frontend-standards.mdc** (if applicable):
       - Add examples of report component patterns
       - Document polling patterns if implemented
  4. **Verify Documentation**: 
     - Confirm all changes are accurately reflected
     - Check that documentation follows established structure
     - Ensure all examples are correct
  5. **Report Updates**: Document which files were updated and what changes were made
- **References**: 
  - Follow process described in `ai-specs/specs/documentation-standards.mdc`
  - All documentation must be written in English
- **Notes**: This step is MANDATORY before considering the implementation complete. Do not skip documentation updates.

## Implementation Order

1. **Step 0**: Create Feature Branch (`feature/SCRUM-6-frontend`)
2. **Step 1**: Add TypeScript Types for Report Data
3. **Step 2**: Add Query Keys for Report Operations
4. **Step 3**: Create API Service Methods and Hooks
5. **Step 4**: Create Report Summary Component
6. **Step 5**: Create Applications Section Component
7. **Step 6**: Create Education Section Component
8. **Step 7**: Create Work Experience Section Component
9. **Step 8**: Create Resumes Section Component
10. **Step 9**: Create Main Report Page Component
11. **Step 10**: Add Report Generation Action to Candidate Card
12. **Step 11**: Add Route for Report Page
13. **Step 12**: Write Component Tests (optional but recommended)
14. **Step 13**: Update Technical Documentation

## Testing Checklist

### Post-Implementation Verification

- [ ] **Type Definitions**:
  - [ ] All types are correctly defined
  - [ ] Types match backend response structure
  - [ ] Optional fields are properly marked

- [ ] **API Integration**:
  - [ ] Report generation mutation works correctly
  - [ ] Report fetching query works correctly
  - [ ] Error handling works for API failures
  - [ ] Loading states display correctly

- [ ] **Component Functionality**:
  - [ ] Report summary displays correct statistics
  - [ ] Applications section displays all applications
  - [ ] Education section displays education history
  - [ ] Work experience section displays work history
  - [ ] Resumes section displays uploaded resumes
  - [ ] All sections handle empty states gracefully

- [ ] **User Experience**:
  - [ ] Report generation button is accessible
  - [ ] Loading states are clear and informative
  - [ ] Error messages are user-friendly
  - [ ] Navigation works correctly
  - [ ] Report page is responsive

- [ ] **Report Fetching**:
  - [ ] Report fetches automatically when page loads
  - [ ] Loading indicator shows during fetch
  - [ ] Report displays correctly after fetch completes
  - [ ] Refresh functionality works (if implemented)

- [ ] **Testing**:
  - [ ] All components render without errors
  - [ ] TypeScript compilation passes
  - [ ] No console errors or warnings
  - [ ] Component tests pass (if written)

- [ ] **Documentation**:
  - [ ] API documentation updated (if endpoint added)
  - [ ] README updated with feature information
  - [ ] Code comments are clear and in English

## Error Handling Patterns

### API Error Handling

**Report Generation Failure**:
```typescript
const { mutate, error } = useGenerateReportMutation()

// Display error to user
{error && (
  <Alert status="error">
    <AlertIcon />
    Failed to generate report: {error.message}
  </Alert>
)}
```

**Report Fetching Failure**:
```typescript
const { data, error, isLoading } = useCandidateReportQuery(candidateId)

// Display error state
{error && (
  <Alert status="error">
    <AlertIcon />
    Failed to load report. Please try again.
  </Alert>
)}
```

### User-Friendly Error Messages

- **Network Errors**: "Unable to connect to server. Please check your connection."
- **Not Found**: "Report not found. Please generate a new report."
- **Timeout**: "Report generation is taking longer than expected. Please try again."
- **Generic Errors**: "An error occurred. Please try again later."

### Loading States

- Show spinner during report generation
- Show skeleton loaders or placeholders while fetching report
- Disable action buttons during operations
- Provide clear feedback about what's happening

## UI/UX Considerations

### Chakra UI Component Usage

- Use Chakra UI v3 components consistently
- Follow dark theme patterns from existing components
- Use `Box`, `VStack`, `HStack` for layout
- Use `Text`, `Heading` for typography
- Use `Badge` for status indicators
- Use `Button` for actions
- Use `Spinner` for loading states
- Use `Alert` for error/success messages

### Responsive Design

- Use `SimpleGrid` for responsive statistics grid
- Ensure sections stack vertically on mobile
- Use appropriate spacing and padding
- Test on different screen sizes

### Accessibility

- Add `aria-label` to icon buttons
- Use semantic HTML elements
- Ensure keyboard navigation works
- Provide alternative text for icons
- Use proper heading hierarchy

### Loading States and Feedback

- Show loading spinner during report generation
- Show progress indicator during polling (if implemented)
- Display success message when report is ready
- Show error messages clearly
- Disable buttons during operations to prevent double-submission

## Dependencies

### External Libraries

- **@chakra-ui/react** (^3.29.0) - Already in package.json
- **@tanstack/react-query** (^5.90.9) - Already in package.json
- **react-router-dom** (^6.28.2) - Already in package.json
- **dayjs** (^1.11.19) - Already in package.json
- **react-icons** (^5.5.0) - Already in package.json
- **axios** (^1.13.2) - Already in package.json

### Internal Dependencies

- `apiClient` from `@/services/api/client`
- `CandidateReport`, `GenerateReportResponse` types
- `queryKeys` from `@/services/api/queryKeys`
- Existing UI components: `SectionHeader`, `StatCard`, `ScoreBadge`

## Notes

### Backend Endpoint Available

**Backend provides two endpoints:**

1. **GET /api/v1/candidates/:id/report** (Primary Method):
   - Generates the report synchronously on-demand
   - Returns the complete report data structure immediately
   - This is the recommended method for fetching reports
   - No polling or async handling needed

2. **POST /api/v1/candidates/:id/generate_report** (Optional - Async Method):
   - Starts async job via Sidekiq, returns `{ message, job_id, candidate_id }`
   - Use this if you need asynchronous generation for large reports
   - Requires polling or job status checking to retrieve the result

**For this implementation, we'll use the GET endpoint as it provides the simplest and most direct approach.**

### Business Rules

- Reports should be generated on-demand (user-triggered)
- Reports should show comprehensive candidate information
- Reports should be readable and well-formatted
- Reports should handle missing data gracefully

### Technical Constraints

- **Chakra UI v3**: Must use v3 API (no v2 components)
- **TypeScript**: All code must be fully typed
- **TanStack Query**: Use for all server state management
- **React Router**: Use for navigation
- **Date Formatting**: Use `dayjs` for consistent date display

### Language Requirements

- All code, comments, error messages, and documentation must be in **English**
- Variable names, function names, and component names must be in English
- Test descriptions and assertions must be in English

### Performance Considerations

- Use `React.memo` for section components if they re-render frequently
- Implement proper loading states to improve perceived performance
- Consider lazy loading report page if bundle size is a concern
- Optimize date formatting (cache formatted dates if needed)

### Security Considerations

- Validate candidate ID from route parameters
- Handle unauthorized access gracefully
- Don't expose sensitive information in error messages
- Sanitize any user input if added in future

## Next Steps After Implementation

1. **Backend Integration** (if GET endpoint is added):
   - Test with real backend endpoint
   - Verify report data structure matches
   - Test error scenarios

2. **User Testing**:
   - Test report generation flow
   - Verify all data displays correctly
   - Test on different screen sizes
   - Verify accessibility

3. **Performance Optimization** (if needed):
   - Profile report page rendering
   - Optimize large data sets
   - Consider virtualization for long lists

4. **Additional Features** (future enhancements):
   - Export report as PDF
   - Print report functionality
   - Share report via email
   - Download report as JSON/CSV
   - Report comparison between candidates

5. **Backend Endpoint** (already implemented):
   - `GET /api/v1/candidates/:id/report` endpoint is available in backend
   - Provides synchronous report generation on-demand
   - No polling needed - direct fetch works perfectly

## Implementation Verification

### Code Quality

- [ ] Code follows React and TypeScript best practices
- [ ] Code is properly formatted (ESLint passes)
- [ ] All components have proper TypeScript types
- [ ] Code is well-documented with comments
- [ ] No code duplication (DRY principle)

### Functionality

- [ ] Report generation works correctly
- [ ] Report display works correctly
- [ ] All sections render properly
- [ ] Error handling works as expected
- [ ] Loading states work correctly
- [ ] Polling mechanism works (if implemented)

### Testing

- [ ] Components render without errors
- [ ] TypeScript compilation passes
- [ ] No console errors or warnings
- [ ] Component tests pass (if written)
- [ ] Manual testing completed

### Integration

- [ ] API integration works correctly
- [ ] Navigation works correctly
- [ ] Route parameters work correctly
- [ ] Candidate card action works

### Documentation Updates Completed

- [ ] API documentation updated (if endpoint added)
- [ ] README updated with feature information
- [ ] Code comments are clear and in English
- [ ] All documentation is in English

