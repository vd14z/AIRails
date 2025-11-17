# Frontend Implementation Plan: SCRUM-8 Candidate Search and Filter View

## Overview

This ticket implements a new view/page for searching and filtering candidates using the newly created backend scopes. The view will provide a user-friendly interface to apply filters such as education, experience, skills, and recent applications, with the ability to combine multiple filters for advanced candidate searches.

**Frontend Architecture Principles:**
- **Component-Based Architecture**: Reusable, composable React components
- **Service Layer**: API communication through TanStack Query hooks
- **State Management**: Local component state for filters, TanStack Query for server state
- **TypeScript**: Type-safe implementation throughout
- **Chakra UI v3**: Modern UI components following project standards

## Architecture Context

### Components/Services Involved

**New Components:**
- `src/features/candidates/pages/CandidatesPage.tsx` - Main page component for candidate search and filtering
- `src/features/candidates/components/CandidateFilters.tsx` - Filter controls component
- `src/features/candidates/components/CandidateList.tsx` - List display component for candidates
- `src/features/candidates/components/CandidateListItem.tsx` - Individual candidate card/item component

**Modified Services:**
- `src/services/api/hooks.ts` - Update `useCandidatesQuery` to support filter parameters
- `src/services/api/queryKeys.ts` - Update query keys to include filter parameters

**Modified Files:**
- `src/router.tsx` - Add new route for candidates page
- `src/layouts/DashboardLayout.tsx` - Add navigation item for candidates page

### Routing Considerations

- New route: `/candidates` - Main candidates search and filter page
- Route should be accessible from the main navigation sidebar

### State Management Approach

- **Local State**: Use `useState` for filter form state (checkboxes, input fields)
- **Server State**: Use TanStack Query's `useCandidatesQuery` hook for fetching filtered candidates
- **URL State**: Consider using URL query parameters for filter state to enable shareable links (optional enhancement)

## Implementation Steps

### Step 0: Create Feature Branch

- **Action**: Create and switch to a new feature branch following the development workflow
- **Branch Naming**: `feature/SCRUM-8-frontend` (required naming convention to separate frontend concerns)
- **Implementation Steps**:
  1. Ensure you're on the latest `main` or `develop` branch (or appropriate base branch)
  2. Pull latest changes: `git pull origin [base-branch]`
  3. Create new branch: `git checkout -b feature/SCRUM-8-frontend`
  4. Verify branch creation: `git branch`
- **Notes**: This must be the FIRST step before any code changes. Refer to `ai-specs/specs/frontend-standards.mdc` section "Development Workflow" for specific branch naming conventions and workflow rules.

### Step 1: Update Query Keys

- **File**: `src/services/api/queryKeys.ts`
- **Action**: Update query keys to support filter parameters for proper cache management
- **Function Signature**:
  ```typescript
  candidates: (filters?: CandidateFilters) => ['candidates', filters] as const
  ```
- **Implementation Steps**:
  1. Define a `CandidateFilters` type to represent filter parameters
  2. Update the `candidates` query key function to accept optional filters parameter
  3. Ensure filters object is properly serialized in the query key
- **Dependencies**:
  - TypeScript types
- **Implementation Notes**:
  - Query keys should include all filter parameters to ensure proper cache invalidation
  - Use a consistent structure for the filters object

### Step 2: Update API Hooks

- **File**: `src/services/api/hooks.ts`
- **Action**: Update `useCandidatesQuery` hook to accept and pass filter parameters to the API
- **Function Signature**:
  ```typescript
  type CandidateFilters = {
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

  export const useCandidatesQuery = (filters?: CandidateFilters) =>
    useQuery({
      queryKey: queryKeys.candidates(filters),
      queryFn: async () => {
        const params: Record<string, string> = {}
        if (filters?.search) params.search = filters.search
        if (filters?.with_education) params.with_education = 'true'
        if (filters?.experienced) params.experienced = 'true'
        if (filters?.skill) params.skill = filters.skill
        if (filters?.recent_applications) params.recent_applications = 'true'
        if (filters?.page) params.page = filters.page.toString()
        if (filters?.limit) params.limit = filters.limit.toString()
        if (filters?.sort) params.sort = filters.sort
        if (filters?.order) params.order = filters.order

        const response = await apiClient.get<PaginatedResponse<Candidate>>('/candidates', {
          params,
        })
        return response.data
      },
    })
  ```
- **Implementation Steps**:
  1. Define `CandidateFilters` type in the hooks file or in a shared types file
  2. Update `useCandidatesQuery` to accept optional `filters` parameter
  3. Build query parameters object from filters
  4. Pass parameters to API client
  5. Maintain backward compatibility (filters parameter should be optional)
- **Dependencies**:
  - `apiClient` from `./client`
  - `queryKeys` from `./queryKeys`
  - `PaginatedResponse` and `Candidate` types
- **Implementation Notes**:
  - Only include parameters in the request if they have values
  - Boolean filters should be converted to "true" string when true, omitted when false
  - Maintain type safety throughout

### Step 3: Create Candidate Filters Component

- **File**: `src/features/candidates/components/CandidateFilters.tsx`
- **Action**: Create a reusable component for candidate filter controls
- **Component Signature**:
  ```typescript
  type CandidateFiltersProps = {
    filters: CandidateFilters
    onFiltersChange: (filters: CandidateFilters) => void
    onReset: () => void
  }

  export function CandidateFilters({ filters, onFiltersChange, onReset }: CandidateFiltersProps)
  ```
- **Implementation Steps**:
  1. Create the component file in `src/features/candidates/components/`
  2. Import necessary Chakra UI components: `Box`, `VStack`, `HStack`, `Checkbox`, `Input`, `Button`, `Text`, `Heading`
  3. Create filter controls:
     - Search input field (text input)
     - "With Education" checkbox
     - "Experienced" checkbox
     - "Skill" text input field
     - "Recent Applications" checkbox
  4. Implement `onChange` handlers for each filter control
  5. Add a "Reset Filters" button
  6. Style using Chakra UI v3 components and theme
  7. Ensure proper TypeScript typing
- **Dependencies**:
  - Chakra UI components
  - `CandidateFilters` type
- **Implementation Notes**:
  - Use Chakra UI `Checkbox` component for boolean filters
  - Use Chakra UI `Input` component for text inputs
  - Group related filters visually (e.g., in a `VStack` or `SimpleGrid`)
  - Add labels and helper text for clarity
  - Use proper form accessibility attributes
  - All text and labels must be in English

### Step 4: Create Candidate List Item Component

- **File**: `src/features/candidates/components/CandidateListItem.tsx`
- **Action**: Create a component to display individual candidate information in the list
- **Component Signature**:
  ```typescript
  type CandidateListItemProps = {
    candidate: Candidate
    onViewDetails?: (candidateId: number) => void
  }

  export function CandidateListItem({ candidate, onViewDetails }: CandidateListItemProps)
  ```
- **Implementation Steps**:
  1. Create the component file
  2. Import Chakra UI components: `Box`, `HStack`, `VStack`, `Text`, `Badge`, `Button`, `Avatar` (or custom avatar)
  3. Display candidate information:
     - Name (first_name + last_name)
     - Email
     - Phone (if available)
     - Address (if available)
     - Fit score or stage (if available)
  4. Add a "View Details" or "View Report" button that navigates to candidate report
  5. Style using Chakra UI components
  6. Ensure responsive design
- **Dependencies**:
  - `Candidate` type from `@/services/api/types`
  - React Router for navigation
  - Chakra UI components
- **Implementation Notes**:
  - Use Chakra UI `Box` for card-like container
  - Use `HStack` and `VStack` for layout
  - Add hover effects for better UX
  - Make the card clickable or add explicit action buttons
  - Follow existing design patterns from `CandidateCard` component

### Step 5: Create Candidate List Component

- **File**: `src/features/candidates/components/CandidateList.tsx`
- **Action**: Create a component to display the list of candidates with pagination
- **Component Signature**:
  ```typescript
  type CandidateListProps = {
    candidates: Candidate[]
    isLoading: boolean
    error: Error | null
    pagination?: {
      total: number
      page: number
      limit: number
      total_pages: number
    }
    onPageChange?: (page: number) => void
  }

  export function CandidateList({ candidates, isLoading, error, pagination, onPageChange }: CandidateListProps)
  ```
- **Implementation Steps**:
  1. Create the component file
  2. Import Chakra UI components: `Box`, `VStack`, `SimpleGrid`, `Spinner`, `Text`, `Button`, `HStack`
  3. Handle loading state: Display spinner or skeleton loaders
  4. Handle error state: Display error message with retry option
  5. Handle empty state: Display message when no candidates match filters
  6. Render list of candidates using `CandidateListItem` component
  7. Implement pagination controls (if pagination data is available)
  8. Use `SimpleGrid` or `VStack` for responsive layout
- **Dependencies**:
  - `CandidateListItem` component
  - Chakra UI components
  - `Candidate` type
- **Implementation Notes**:
  - Use Chakra UI `Spinner` for loading state
  - Use `SimpleGrid` with responsive columns for candidate list
  - Implement pagination using buttons or a pagination component
  - Show total count of candidates
  - Handle edge cases (empty results, errors, loading)

### Step 6: Create Candidates Page Component

- **File**: `src/features/candidates/pages/CandidatesPage.tsx`
- **Action**: Create the main page component that combines filters and candidate list
- **Component Signature**:
  ```typescript
  export function CandidatesPage()
  ```
- **Implementation Steps**:
  1. Create the page component file in `src/features/candidates/pages/`
  2. Import necessary components and hooks
  3. Set up local state for filters using `useState`:
     ```typescript
     const [filters, setFilters] = useState<CandidateFilters>({
       page: 1,
       limit: 10,
       sort: 'first_name',
       order: 'asc',
     })
     ```
  4. Use `useCandidatesQuery` hook with filters
  5. Implement filter change handlers
  6. Implement reset filters handler
  7. Implement pagination handlers
  8. Combine `CandidateFilters` and `CandidateList` components
  9. Add page header using `SectionHeader` component
  10. Style the page layout using Chakra UI
- **Dependencies**:
  - `CandidateFilters` component
  - `CandidateList` component
  - `useCandidatesQuery` hook
  - `SectionHeader` component
  - Chakra UI components
- **Implementation Notes**:
  - Use `SectionHeader` component for consistent page headers
  - Layout: Filters on the left or top, candidate list below/right
  - Reset filters should clear all filter values
  - Pagination should update the `page` filter
  - All text and labels must be in English

### Step 7: Update Router

- **File**: `src/router.tsx`
- **Action**: Add route for the new candidates page
- **Implementation Steps**:
  1. Import `CandidatesPage` component
  2. Add route configuration:
     ```typescript
     { path: '/candidates', element: <CandidatesPage /> }
     ```
  3. Ensure route is added to the routes array
- **Dependencies**:
  - `CandidatesPage` component
- **Implementation Notes**:
  - Route should be `/candidates`
  - Follow existing route patterns

### Step 8: Update Navigation

- **File**: `src/layouts/DashboardLayout.tsx`
- **Action**: Add navigation item for candidates page
- **Implementation Steps**:
  1. Import appropriate icon (e.g., `FiUsers` from `react-icons/fi`)
  2. Add new navigation item to `navItems` array:
     ```typescript
     { to: '/candidates', label: 'Candidates', icon: FiUsers }
     ```
  3. Ensure proper ordering in the navigation menu
- **Dependencies**:
  - React Router `NavLink`
  - Icon from `react-icons/fi`
- **Implementation Notes**:
  - Use appropriate icon for candidates/search
  - Label should be "Candidates" (English)
  - Place navigation item in logical position (e.g., after Pipeline)

### Step 9: Write Unit Tests

- **File**: `src/features/candidates/components/CandidateFilters.test.tsx`, `src/features/candidates/components/CandidateList.test.tsx`, `src/features/candidates/components/CandidateListItem.test.tsx`
- **Action**: Write comprehensive Vitest tests for the new components
- **Implementation Steps**:

#### 9.1 Test CandidateFilters Component

**Test Cases**:
- Renders all filter controls
- Updates filters when checkboxes are toggled
- Updates search input when text is entered
- Updates skill input when text is entered
- Calls `onFiltersChange` when filters change
- Calls `onReset` when reset button is clicked
- Resets all filters to initial state

#### 9.2 Test CandidateListItem Component

**Test Cases**:
- Renders candidate information correctly
- Displays name, email, phone, address
- Handles missing optional fields gracefully
- Calls `onViewDetails` when view button is clicked
- Navigates to correct route when clicked

#### 9.3 Test CandidateList Component

**Test Cases**:
- Renders list of candidates
- Displays loading state correctly
- Displays error state with retry option
- Displays empty state when no candidates
- Renders pagination controls when pagination data is available
- Calls `onPageChange` when pagination button is clicked

#### 9.4 Test CandidatesPage Component

**Test Cases**:
- Renders filters and candidate list
- Updates filters state correctly
- Fetches candidates with correct filter parameters
- Handles loading and error states
- Resets filters correctly
- Updates pagination correctly

- **Dependencies**:
  - Vitest testing framework
  - React Testing Library
  - `@testing-library/user-event`
- **Implementation Notes**:
  - All test descriptions must be in English
  - Use `render` from `@testing-library/react`
  - Use `screen` queries for finding elements
  - Mock API calls using Vitest mocks
  - Test user interactions with `userEvent`

### Step 10: Update Technical Documentation

- **Action**: Review and update technical documentation according to changes made
- **Implementation Steps**:
  1. **Review Changes**: Analyze all code changes made during implementation
     - New components created
     - API hooks updated
     - Router updated
     - Navigation updated
  2. **Identify Documentation Files**: Determine which documentation files need updates:
     - **API Specification**: Review if API endpoint documentation needs updates (already documented in backend)
     - **Frontend Standards**: Update if new patterns or component patterns were established
     - **Routing Documentation**: Update routing documentation if needed
  3. **Update Documentation**: For each affected file:
     - **frontend-standards.mdc** (if applicable):
       - Document new component patterns
       - Update examples if needed
       - Document filter state management patterns
     - **README.md** (if exists):
       - Document new route
       - Document new feature
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

1. **Step 0**: Create Feature Branch (`feature/SCRUM-8-frontend`)
2. **Step 1**: Update Query Keys
3. **Step 2**: Update API Hooks
4. **Step 3**: Create Candidate Filters Component
5. **Step 4**: Create Candidate List Item Component
6. **Step 5**: Create Candidate List Component
7. **Step 6**: Create Candidates Page Component
8. **Step 7**: Update Router
9. **Step 8**: Update Navigation
10. **Step 9**: Write Unit Tests
11. **Step 10**: Update Technical Documentation

## Testing Checklist

### Post-Implementation Verification

- [ ] **Component Functionality**:
  - [ ] Filter controls render correctly
  - [ ] Filters update state correctly
  - [ ] Reset filters works correctly
  - [ ] Candidate list displays correctly
  - [ ] Pagination works correctly
  - [ ] Navigation to candidate report works

- [ ] **API Integration**:
  - [ ] API calls include correct filter parameters
  - [ ] Multiple filters can be combined
  - [ ] Pagination parameters are sent correctly
  - [ ] Error handling works correctly
  - [ ] Loading states display correctly

- [ ] **User Experience**:
  - [ ] Filters are intuitive and easy to use
  - [ ] Loading states provide feedback
  - [ ] Error messages are user-friendly
  - [ ] Empty states are informative
  - [ ] Responsive design works on mobile and desktop

- [ ] **Edge Cases**:
  - [ ] Empty search results handled correctly
  - [ ] Invalid filter combinations handled gracefully
  - [ ] Network errors handled correctly
  - [ ] Large result sets paginate correctly

- [ ] **Testing**:
  - [ ] All unit tests pass
  - [ ] Test coverage meets project standards
  - [ ] Tests are isolated and don't depend on each other
  - [ ] All test descriptions are in English

- [ ] **Code Quality**:
  - [ ] Code follows React and TypeScript conventions
  - [ ] Code is properly formatted
  - [ ] No linter errors
  - [ ] Code comments are clear and in English
  - [ ] TypeScript types are properly defined

- [ ] **Documentation**:
  - [ ] Technical documentation updated
  - [ ] Code comments are clear and in English
  - [ ] All documentation is in English

## Error Handling Patterns

### API Error Handling

- **Network Errors**: Display user-friendly error message with retry option
- **Validation Errors**: Display specific error messages for invalid filter inputs
- **Empty Results**: Display informative message when no candidates match filters

### Component Error States

- Use Chakra UI `Alert` component for error messages
- Provide retry functionality for failed API calls
- Log errors to console in development mode

### User-Friendly Error Messages

- "Unable to load candidates. Please try again."
- "No candidates found matching your filters."
- "Please check your connection and try again."

## UI/UX Considerations

### Chakra UI Integration

- Use Chakra UI v3 components throughout
- Follow existing design patterns from other pages
- Use theme colors and spacing consistently
- Ensure dark mode compatibility

### Responsive Design

- Filters should stack vertically on mobile devices
- Candidate list should be single column on mobile
- Pagination should be touch-friendly on mobile
- Use Chakra UI responsive props (`base`, `md`, `lg`)

### Accessibility

- All form controls must have proper labels
- Use semantic HTML elements
- Ensure keyboard navigation works
- Add ARIA attributes where needed
- Test with screen readers

### Loading States and Feedback

- Show spinner or skeleton loaders while fetching
- Disable filter controls during loading
- Show success/error feedback after actions
- Use Chakra UI `Spinner` component

## Dependencies

### External Libraries

- **Chakra UI v3.29.0**: UI component library
- **TanStack Query 5.90.9**: Server state management
- **React Router DOM 6.28.2**: Routing and navigation
- **React Icons 5.5.0**: Icon library
- **Axios 1.13.2**: HTTP client

### Internal Dependencies

- `src/services/api/client.ts` - API client
- `src/services/api/types.ts` - TypeScript types
- `src/services/api/hooks.ts` - React Query hooks
- `src/components/ui/SectionHeader.tsx` - Reusable header component
- Existing component patterns from other features

## Notes

### Business Rules

- **Filter Combinations**: All filters can be combined together
- **Pagination**: Default to 10 items per page, allow user to change
- **Sorting**: Default to sorting by first name ascending
- **Search**: Search works independently and can be combined with other filters
- **Reset**: Reset button clears all filters and returns to default state

### Technical Constraints

- **TypeScript**: All code must be type-safe
- **Chakra UI v3**: Use v3 API, not v2 patterns
- **React 18**: Use functional components and hooks only
- **TanStack Query**: Use for all server state management
- **No Class Components**: Use functional components only

### Language Requirements

- All code, comments, test descriptions, and documentation must be in **English**
- Variable names, function names, and component names must be in English
- Error messages must be in English
- UI labels and text must be in English

### Important Considerations

1. **Filter State Management**: Consider using URL query parameters for filters to enable shareable links (optional enhancement for future)

2. **Performance**: 
   - Debounce search input to avoid excessive API calls
   - Use React.memo for list items if list is large
   - Consider virtual scrolling for very large lists

3. **Caching**: TanStack Query will cache results based on query keys, ensure filters are properly included in query keys

4. **Backward Compatibility**: Maintain backward compatibility with existing `useCandidatesQuery` usage (make filters parameter optional)

## Next Steps After Implementation

1. **User Testing**:
   - Test with real users to gather feedback
   - Verify filter combinations work as expected
   - Check performance with large datasets

2. **Performance Optimization** (if needed):
   - Implement debouncing for search input
   - Add virtual scrolling for large lists
   - Optimize re-renders with React.memo

3. **Enhancements** (future):
   - Add URL query parameter support for shareable filter links
   - Add filter presets/saved filters
   - Add export functionality for filtered results
   - Add advanced sorting options

4. **Integration**:
   - Test integration with candidate report page
   - Verify navigation flows work correctly
   - Test with different user roles (if applicable)

## Implementation Verification

### Code Quality

- [ ] Code follows React and TypeScript conventions
- [ ] Code is properly formatted (no linter errors)
- [ ] All components have proper TypeScript types
- [ ] Code is well-documented with comments
- [ ] No code duplication (DRY principle)

### Functionality

- [ ] All filters work correctly individually
- [ ] Filters can be combined together
- [ ] Search works correctly
- [ ] Pagination works correctly
- [ ] Navigation to candidate report works
- [ ] Reset filters works correctly

### Testing

- [ ] All unit tests pass
- [ ] Test coverage meets project standards
- [ ] All edge cases are tested
- [ ] Tests are isolated and don't depend on each other
- [ ] All test descriptions are in English

### Integration

- [ ] Page is accessible from navigation
- [ ] Route works correctly
- [ ] API integration works correctly
- [ ] Error handling works correctly
- [ ] Loading states work correctly

### Documentation Updates Completed

- [ ] Technical documentation updated
- [ ] Code comments are clear and in English
- [ ] All documentation is in English
- [ ] Usage examples are provided (if applicable)

