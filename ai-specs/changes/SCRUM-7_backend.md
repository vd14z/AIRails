# Backend Implementation Plan: SCRUM-7 Candidate Model Scopes

## Overview

This ticket implements four ActiveRecord scopes in the `Candidate` model to enable advanced search and complex combinable filters for candidates. The scopes will optimize queries and improve application performance by using ActiveRecord's Query Interface to build powerful and expressive queries.

**Architecture Principles:**
- **Domain-Driven Design (DDD)**: Scopes are part of the domain model, encapsulating query logic
- **ActiveRecord Query Interface**: Leverage Rails' built-in query methods for performance and readability
- **Composability**: Scopes can be chained together for complex queries
- **Performance**: Use `joins` and `distinct` appropriately to avoid N+1 queries

## Architecture Context

### Layers Involved

**Domain Layer:**
- `app/models/candidate.rb` - Model where scopes will be added

**Presentation Layer:**
- `app/controllers/api/v1/candidates_controller.rb` - Controller that may use these scopes in the `index` action

### Components/Files Referenced

- `app/models/candidate.rb` - Main model to modify
- `app/models/work_experience.rb` - Related model for `experienced` scope
- `app/models/education.rb` - Related model for `with_education` scope
- `app/models/application.rb` - Related model for `recent_applications` scope
- `app/controllers/api/v1/candidates_controller.rb` - Controller that may use scopes
- `spec/models/candidate_spec.rb` - Test file for model specs (to be created/updated)

### Database Schema Context

- `candidates` table: `id`, `first_name`, `last_name`, `email`, `phone`, `address`, `created_at`, `updated_at`
- `educations` table: `id`, `candidate_id`, `institution`, `title`, `start_date`, `end_date`
- `work_experiences` table: `id`, `candidate_id`, `company`, `position`, `description`, `start_date`, `end_date`
- `applications` table: `id`, `candidate_id`, `position_id`, `application_date`

**Note on `by_skill` scope**: The ticket references searching in a `description` field on the `candidates` table, but this field does not exist in the current schema. The scope will search in `work_experiences.description` instead, as this is the most logical place to find skill-related information. If a `description` field is needed on `candidates`, a migration should be created first.

## Implementation Steps

### Step 0: Create Feature Branch

- **Action**: Create and switch to a new feature branch following the development workflow
- **Branch Naming**: `feature/SCRUM-7-backend` (required naming convention to separate backend concerns)
- **Implementation Steps**:
  1. Ensure you're on the latest `main` or `develop` branch (or appropriate base branch)
  2. Pull latest changes: `git pull origin [base-branch]`
  3. Create new branch: `git checkout -b feature/SCRUM-7-backend`
  4. Verify branch creation: `git branch`
- **Notes**: This must be the FIRST step before any code changes. Refer to `ai-specs/specs/backend-standards.mdc` section "Development Workflow" for specific branch naming conventions and workflow rules.

### Step 1: Implement `with_education` Scope

- **File**: `app/models/candidate.rb`
- **Action**: Add scope to find candidates who have education records
- **Function Signature**:
  ```ruby
  scope :with_education, -> { joins(:educations).distinct }
  ```
- **Implementation Steps**:
  1. Open `app/models/candidate.rb`
  2. Add the scope in the `# Scopes` section (after line 19)
  3. Use `joins(:educations)` to join with the educations table
  4. Use `.distinct` to avoid duplicate candidates if they have multiple education records
  5. Ensure proper indentation and formatting
- **Dependencies**: 
  - `has_many :educations` association (already exists)
- **Implementation Notes**:
  - `joins` performs an INNER JOIN, so only candidates with at least one education record will be returned
  - `distinct` ensures each candidate appears only once in the result set
  - This scope returns an `ActiveRecord::Relation`, making it chainable with other scopes

### Step 2: Implement `experienced` Scope

- **File**: `app/models/candidate.rb`
- **Action**: Add scope to find candidates with recent work experience (end_date is NULL or after 1 year ago)
- **Function Signature**:
  ```ruby
  scope :experienced, -> { 
    joins(:work_experiences)
      .where("work_experiences.end_date IS NULL OR work_experiences.end_date > ?", 1.year.ago)
      .distinct
  }
  ```
- **Implementation Steps**:
  1. Add the scope in the `# Scopes` section
  2. Use `joins(:work_experiences)` to join with work_experiences table
  3. Use `where` with SQL condition to check:
     - `end_date IS NULL` (current/ongoing position)
     - OR `end_date > 1.year.ago` (ended within the last year)
  4. Use `1.year.ago` for the date comparison (Rails time helper)
  5. Add `.distinct` to avoid duplicate candidates
- **Dependencies**:
  - `has_many :work_experiences` association (already exists)
  - Rails time helpers (`1.year.ago`)
- **Implementation Notes**:
  - `1.year.ago` calculates the date exactly one year before the current time
  - The SQL condition uses `OR` to handle both ongoing positions (NULL end_date) and recent positions
  - `distinct` ensures candidates with multiple matching work experiences appear only once

### Step 3: Implement `by_skill` Scope

- **File**: `app/models/candidate.rb`
- **Action**: Add scope to find candidates whose work experience descriptions contain a specified skill (case-insensitive search)
- **Function Signature**:
  ```ruby
  scope :by_skill, ->(skill) { 
    joins(:work_experiences)
      .where("work_experiences.description ILIKE ?", "%#{skill}%")
      .distinct
  }
  ```
- **Implementation Steps**:
  1. Add the scope in the `# Scopes` section
  2. Accept a `skill` parameter (string)
  3. Use `joins(:work_experiences)` to join with work_experiences table
  4. Use `where` with `ILIKE` for case-insensitive pattern matching
  5. Use `%#{skill}%` pattern to search for the skill anywhere in the description
  6. Add `.distinct` to avoid duplicate candidates
  7. **Note**: Since `candidates` table doesn't have a `description` field, we search in `work_experiences.description`
- **Dependencies**:
  - `has_many :work_experiences` association (already exists)
  - PostgreSQL `ILIKE` operator (case-insensitive LIKE)
- **Implementation Notes**:
  - `ILIKE` is PostgreSQL-specific and performs case-insensitive pattern matching
  - The `%` wildcards allow matching the skill anywhere in the description
  - Parameterized query (`?`) prevents SQL injection
  - If the skill parameter is empty or nil, the scope will still execute but may return unexpected results (consider validation)
  - **Important**: The ticket example shows `where("description ILIKE ?", "%#{skill}%")`, but since `candidates` table has no `description` field, we search in `work_experiences.description`. If a `description` field is needed on `candidates`, a migration must be created first.

### Step 4: Implement `recent_applications` Scope

- **File**: `app/models/candidate.rb`
- **Action**: Add scope to find candidates with applications made in the last 30 days
- **Function Signature**:
  ```ruby
  scope :recent_applications, -> { 
    joins(:applications)
      .where("applications.application_date > ?", 30.days.ago)
      .distinct
  }
  ```
- **Implementation Steps**:
  1. Add the scope in the `# Scopes` section
  2. Use `joins(:applications)` to join with applications table
  3. Use `where` to filter applications where `application_date > 30.days.ago`
  4. Use `30.days.ago` for the date comparison (Rails time helper)
  5. Add `.distinct` to avoid duplicate candidates
- **Dependencies**:
  - `has_many :applications` association (already exists)
  - Rails time helpers (`30.days.ago`)
- **Implementation Notes**:
  - `30.days.ago` calculates the date exactly 30 days before the current time
  - Only candidates with at least one application in the last 30 days will be returned
  - `distinct` ensures candidates with multiple recent applications appear only once

### Step 5: Write Unit Tests

- **File**: `spec/models/candidate_spec.rb` (create if it doesn't exist, or update existing)
- **Action**: Write comprehensive RSpec tests for all four scopes
- **Implementation Steps**:

#### 5.1 Test Setup
1. Create or open `spec/models/candidate_spec.rb`
2. Set up RSpec describe block for `Candidate` model
3. Use FactoryBot to create test data (candidates, educations, work_experiences, applications)
4. Ensure proper test isolation (use `before` blocks for setup, `after` blocks for cleanup if needed)

#### 5.2 Test `with_education` Scope

**Successful Cases**:
- Test that scope returns candidates with at least one education record
- Test that scope does not return candidates without education records
- Test that scope returns distinct candidates (no duplicates even if candidate has multiple educations)
- Test that scope can be chained with other scopes

**Edge Cases**:
- Test with candidates that have multiple education records (should appear once)
- Test with empty result set (no candidates with education)

#### 5.3 Test `experienced` Scope

**Successful Cases**:
- Test that scope returns candidates with ongoing work experience (end_date IS NULL)
- Test that scope returns candidates with work experience ending within the last year
- Test that scope does not return candidates with work experience ending more than 1 year ago
- Test that scope returns distinct candidates
- Test that scope can be chained with other scopes

**Edge Cases**:
- Test with candidates that have multiple work experiences (some recent, some old)
- Test with candidates that have no work experiences
- Test with candidates that have work experiences exactly 1 year ago (boundary condition)
- Test with candidates that have work experiences exactly 1 year and 1 day ago (should not be included)

#### 5.4 Test `by_skill` Scope

**Successful Cases**:
- Test that scope returns candidates whose work experience descriptions contain the skill (case-insensitive)
- Test that scope matches skill at the beginning of description
- Test that scope matches skill at the end of description
- Test that scope matches skill in the middle of description
- Test case-insensitive matching (uppercase, lowercase, mixed case)
- Test that scope returns distinct candidates
- Test that scope can be chained with other scopes

**Edge Cases**:
- Test with empty skill parameter (should handle gracefully or return all candidates)
- Test with nil skill parameter
- Test with skill that doesn't match any descriptions
- Test with special characters in skill parameter (SQL injection prevention)
- Test with candidates that have multiple work experiences (some matching, some not)

#### 5.5 Test `recent_applications` Scope

**Successful Cases**:
- Test that scope returns candidates with applications made in the last 30 days
- Test that scope does not return candidates with applications older than 30 days
- Test that scope returns distinct candidates
- Test that scope can be chained with other scopes

**Edge Cases**:
- Test with candidates that have multiple applications (some recent, some old)
- Test with candidates that have no applications
- Test with applications exactly 30 days ago (boundary condition)
- Test with applications exactly 31 days ago (should not be included)

#### 5.6 Test Scope Chaining

**Combinability Tests**:
- Test chaining `with_education` and `experienced` scopes
- Test chaining `by_skill` and `recent_applications` scopes
- Test chaining all four scopes together
- Test chaining scopes with existing `by_name` scope
- Verify that chained scopes return correct results

#### 5.7 Test Performance Considerations

- Test that scopes use appropriate joins (avoid N+1 queries)
- Test that `distinct` is used where needed
- Verify that queries are optimized (can use `explain` in tests if needed)

- **Dependencies**:
  - RSpec testing framework
  - FactoryBot for test data creation
  - Database test setup
- **Implementation Notes**:
  - All test descriptions must be in English
  - Use descriptive test names following RSpec conventions
  - Use `let` or `before` blocks for test data setup
  - Ensure tests are isolated and don't depend on each other
  - Use `expect` syntax (not `should`)
  - Test both positive and negative cases

### Step 6: Update Candidates Controller (Optional Enhancement)

- **File**: `app/controllers/api/v1/candidates_controller.rb`
- **Action**: Optionally update the `index` action to support the new scopes as query parameters
- **Implementation Steps**:
  1. Review the current `index` action implementation
  2. Add support for optional query parameters:
     - `with_education=true` - Filter candidates with education
     - `experienced=true` - Filter candidates with recent experience
     - `skill=ruby` - Filter candidates by skill
     - `recent_applications=true` - Filter candidates with recent applications
  3. Chain scopes conditionally based on parameters
  4. Ensure scopes can be combined
  5. Maintain existing functionality (search, sorting, pagination)
- **Dependencies**: 
  - New scopes from Steps 1-4
- **Implementation Notes**:
  - This is an optional enhancement, not required by the ticket
  - Maintain backward compatibility with existing API
  - Document new query parameters if implemented
  - All code and comments must be in English

### Step 7: Update Technical Documentation

- **Action**: Review and update technical documentation according to changes made
- **Implementation Steps**:
  1. **Review Changes**: Analyze all code changes made during implementation
     - New scopes added to `Candidate` model
     - Test coverage added
     - Optional controller updates
  2. **Identify Documentation Files**: Determine which documentation files need updates:
     - **Data Model**: Update `ai-specs/specs/data-model.md` to document the new scopes
     - **API Specification**: Update `ai-specs/specs/api-spec.yml` if controller was updated with new query parameters
     - **Backend Standards**: Review `ai-specs/specs/backend-standards.mdc` if new patterns were established
  3. **Update Documentation**: For each affected file:
     - **data-model.md**: 
       - Add section documenting the four new scopes
       - Include scope signatures, parameters, and usage examples
       - Document scope combinability
     - **api-spec.yml** (if controller updated):
       - Add query parameters for the new scopes
       - Document parameter combinations
       - Include example requests
     - **backend-standards.mdc** (if applicable):
       - Document scope patterns and best practices
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

1. **Step 0**: Create Feature Branch (`feature/SCRUM-7-backend`)
2. **Step 1**: Implement `with_education` Scope
3. **Step 2**: Implement `experienced` Scope
4. **Step 3**: Implement `by_skill` Scope
5. **Step 4**: Implement `recent_applications` Scope
6. **Step 5**: Write Unit Tests
7. **Step 6**: Update Candidates Controller (Optional Enhancement)
8. **Step 7**: Update Technical Documentation

## Testing Checklist

### Post-Implementation Verification

- [ ] **Scope Implementation**:
  - [ ] `with_education` scope returns candidates with education records
  - [ ] `experienced` scope returns candidates with recent work experience
  - [ ] `by_skill` scope returns candidates matching skill in work experience descriptions
  - [ ] `recent_applications` scope returns candidates with applications in last 30 days
  - [ ] All scopes return distinct results (no duplicates)
  - [ ] All scopes can be chained together

- [ ] **Query Performance**:
  - [ ] Scopes use appropriate joins (no N+1 queries)
  - [ ] `distinct` is used where needed
  - [ ] Queries are optimized for performance

- [ ] **Scope Chaining**:
  - [ ] Scopes can be combined: `Candidate.with_education.experienced`
  - [ ] Scopes can be combined with existing `by_name` scope
  - [ ] Multiple scopes can be chained: `Candidate.with_education.experienced.by_skill('ruby')`
  - [ ] Chained scopes return correct results

- [ ] **Edge Cases**:
  - [ ] Empty result sets handled correctly
  - [ ] Boundary conditions tested (exactly 1 year ago, exactly 30 days ago)
  - [ ] Nil/empty parameters handled gracefully
  - [ ] Special characters in `by_skill` parameter don't cause SQL injection

- [ ] **Testing**:
  - [ ] All unit tests pass
  - [ ] Test coverage meets project standards
  - [ ] Tests are isolated and don't depend on each other
  - [ ] All test descriptions are in English

- [ ] **Code Quality**:
  - [ ] Code follows Rails conventions
  - [ ] Code is properly formatted
  - [ ] No linter errors
  - [ ] Code comments are clear and in English

- [ ] **Documentation**:
  - [ ] Data model documentation updated
  - [ ] API documentation updated (if controller was modified)
  - [ ] Code comments are clear and in English
  - [ ] All documentation is in English

## Error Response Format

Since scopes return `ActiveRecord::Relation` objects, they don't directly raise errors. However, if used incorrectly:

- **Invalid Parameter Types**: If `by_skill` receives a non-string parameter, ActiveRecord may raise a type error
- **SQL Errors**: If database schema changes, scopes may raise SQL errors
- **Nil Parameters**: If `by_skill` receives `nil`, the query will still execute but may return unexpected results

**Best Practice**: Validate parameters before using scopes in controllers or services.

## Scope Usage Examples

### Basic Usage

```ruby
# Find candidates with education
Candidate.with_education

# Find experienced candidates
Candidate.experienced

# Find candidates by skill
Candidate.by_skill('Ruby')

# Find candidates with recent applications
Candidate.recent_applications
```

### Chained Usage

```ruby
# Find experienced candidates with education
Candidate.with_education.experienced

# Find candidates with education who know Ruby
Candidate.with_education.by_skill('Ruby')

# Find experienced candidates with recent applications
Candidate.experienced.recent_applications

# Complex query: experienced candidates with education who know Ruby and have recent applications
Candidate.with_education.experienced.by_skill('Ruby').recent_applications
```

### Combined with Existing Scopes

```ruby
# Find candidates by name who have education
Candidate.by_name('John').with_education

# Find experienced candidates by name
Candidate.by_name('Jane').experienced
```

### With Pagination and Sorting

```ruby
# Use scopes with pagination
Candidate.with_education.experienced.page(1).per(10)

# Use scopes with sorting
Candidate.by_skill('Python').order(created_at: :desc)
```

## Dependencies

### External Libraries

- **ActiveRecord**: Rails ORM (already in project)
- **PostgreSQL**: Database with `ILIKE` support (already configured)

### Internal Dependencies

- `app/models/candidate.rb` - Model with associations
- `app/models/education.rb` - Related model
- `app/models/work_experience.rb` - Related model
- `app/models/application.rb` - Related model
- RSpec testing framework
- FactoryBot for test data

## Notes

### Business Rules

- **`with_education`**: Returns candidates who have at least one education record
- **`experienced`**: Returns candidates with work experience that is either ongoing (end_date IS NULL) or ended within the last year
- **`by_skill`**: Searches for skills in work experience descriptions (case-insensitive)
- **`recent_applications`**: Returns candidates with at least one application in the last 30 days
- All scopes are combinable and can be chained together
- Scopes return `ActiveRecord::Relation` objects, making them chainable and lazy-loaded

### Technical Constraints

- **PostgreSQL Required**: `ILIKE` operator is PostgreSQL-specific. If database changes, `by_skill` scope needs modification
- **Rails Time Helpers**: Uses `1.year.ago` and `30.days.ago` which are Rails-specific
- **SQL Injection Prevention**: All scopes use parameterized queries to prevent SQL injection
- **Performance**: Scopes use `joins` and `distinct` to optimize queries and avoid N+1 problems

### Language Requirements

- All code, comments, test descriptions, and documentation must be in **English**
- Variable names, method names, and scope names must be in English
- Error messages must be in English

### Important Considerations

1. **`by_skill` Scope Field**: The ticket example shows searching in `description`, but the `candidates` table doesn't have this field. The implementation searches in `work_experiences.description` instead. If a `description` field is needed on `candidates`, a migration must be created first.

2. **Scope Parameter Validation**: Consider adding validation for `by_skill` parameter (e.g., reject empty strings or nil values) to avoid unexpected query results.

3. **Performance**: All scopes use `distinct` to avoid duplicate results. This is important when joining with related tables that may have multiple records per candidate.

4. **Combinability**: All scopes are designed to be chainable. When chaining multiple scopes, ensure the resulting query is still performant.

## Next Steps After Implementation

1. **Integration Testing** (if controller was updated):
   - Test API endpoints with new query parameters
   - Verify scope combinations work correctly in API context
   - Test pagination and sorting with scopes

2. **Performance Testing**:
   - Profile queries with large datasets
   - Verify indexes are used appropriately
   - Consider adding database indexes if needed

3. **Frontend Integration** (future):
   - Update frontend to use new query parameters
   - Add UI filters for the new scopes
   - Test scope combinations in user interface

4. **Documentation**:
   - Update API documentation with new query parameters
   - Create usage examples for developers
   - Document scope combinations and best practices

## Implementation Verification

### Code Quality

- [ ] Code follows Rails conventions and project standards
- [ ] Code is properly formatted (no linter errors)
- [ ] All scopes have proper TypeScript/Ruby type annotations (if applicable)
- [ ] Code is well-documented with comments
- [ ] No code duplication (DRY principle)

### Functionality

- [ ] All four scopes work correctly individually
- [ ] Scopes can be chained together
- [ ] Scopes return correct results for all test cases
- [ ] Edge cases are handled appropriately
- [ ] Performance is acceptable (no N+1 queries)

### Testing

- [ ] All unit tests pass
- [ ] Test coverage meets project standards (90%+)
- [ ] All edge cases are tested
- [ ] Scope chaining is tested
- [ ] Tests are isolated and don't depend on each other

### Integration

- [ ] Scopes work correctly with existing `by_name` scope
- [ ] Scopes work correctly with pagination (Kaminari)
- [ ] Scopes work correctly with sorting
- [ ] Controller integration works (if implemented)

### Documentation Updates Completed

- [ ] Data model documentation updated with new scopes
- [ ] API documentation updated (if controller was modified)
- [ ] Code comments are clear and in English
- [ ] All documentation is in English
- [ ] Usage examples are provided

