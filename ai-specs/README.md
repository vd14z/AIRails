# 📋 Spec-Driven Development (SDD) Process

## Overview

This project follows a **Spec-Driven Development (SDD)** methodology where all features start with clear, comprehensive specifications before implementation begins.

## Why Spec-Driven Development?

### Benefits

- ✅ **Clear Requirements**: No ambiguity about what needs to be built
- ✅ **Consistent Architecture**: Specifications ensure architectural consistency
- ✅ **Better Code Quality**: Well-defined specs lead to better implementations
- ✅ **Easier Maintenance**: Clear documentation makes maintenance simpler
- ✅ **Faster Onboarding**: New developers understand the system quickly
- ✅ **AI-Friendly**: Clear specs enable effective AI-assisted development

### The Problem It Solves

Traditional development often suffers from:
- Unclear requirements leading to rework
- Inconsistent implementations
- Poor documentation
- Technical debt accumulation

SDD addresses these by **specifying first, implementing second**.

## Process Flow

```
┌─────────────────────────────────────────────────────────┐
│                   1. Specification                       │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Technical Specs (api-spec.yml, data-model.md)   │  │
│  │  Standards (backend-standards.mdc, etc.)         │  │
│  └───────────────────────────────────────────────────┘  │
└───────────────────────┬─────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│                2. Implementation Plan                   │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Detailed step-by-step plan (SCRUM-X_backend.md) │  │
│  │  - Architecture context                          │  │
│  │  - Implementation steps                          │  │
│  │  - Testing strategy                             │  │
│  │  - Documentation updates                         │  │
│  └───────────────────────────────────────────────────┘  │
└───────────────────────┬─────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│                   3. Implementation                     │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Code following plan and specs                    │  │
│  │  - Service objects                                │  │
│  │  - Controllers                                    │  │
│  │  - Models                                         │  │
│  │  - Tests                                          │  │
│  └───────────────────────────────────────────────────┘  │
└───────────────────────┬─────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│                 4. Documentation                        │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Update documentation to match implementation     │  │
│  │  - API specs                                      │  │
│  │  - Data models                                    │  │
│  │  - READMEs                                        │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## Directory Structure

```
ai-specs/
├── README.md                    # This file
├── specs/                       # Technical specifications
│   ├── api-spec.yml            # OpenAPI specification
│   ├── data-model.md          # Database schema and models
│   ├── backend-standards.mdc  # Backend coding standards
│   ├── frontend-standards.mdc # Frontend coding standards
│   └── base-standards.mdc     # Base development standards
├── changes/                     # Implementation plans
│   ├── SCRUM-5_backend.md     # Example: Background jobs
│   ├── SCRUM-6_frontend.md    # Example: Candidate reports
│   ├── SCRUM-7_backend.md     # Example: Advanced scopes
│   └── SCRUM-8_frontend.md    # Example: Candidate search
└── .commands/                   # AI agent commands
    ├── develop-backend.md     # Backend development workflow
    ├── develop-frontend.md    # Frontend development workflow
    └── plan-frontend-ticket.md # Frontend planning workflow
```

## Specification Types

### 1. API Specifications (`specs/api-spec.yml`)

OpenAPI 3.0 specification defining:
- Endpoints and methods
- Request/response schemas
- Query parameters
- Error responses
- Authentication

**Example**: See `specs/api-spec.yml` for complete API documentation.

### 2. Data Model (`specs/data-model.md`)

Database schema documentation:
- Tables and relationships
- Constraints and validations
- Indexes
- Model scopes and methods

**Example**: See `specs/data-model.md` for complete data model.

### 3. Coding Standards

- **Backend Standards** (`specs/backend-standards.mdc`): Rails conventions, patterns, testing
- **Frontend Standards** (`specs/frontend-standards.mdc`): React conventions, components, testing
- **Base Standards** (`specs/base-standards.mdc`): Common rules (language, naming, etc.)

## Implementation Plans

Each feature has a detailed implementation plan in `changes/`:

### Plan Structure

1. **Overview**: Feature description and goals
2. **Architecture Context**: Components/services involved
3. **Implementation Steps**: Detailed step-by-step guide
4. **Testing Strategy**: Test cases and coverage
5. **Documentation Updates**: What docs need updating
6. **Error Handling**: Error scenarios and handling
7. **UI/UX Considerations**: Design and accessibility

### Example Plans

- **SCRUM-5_backend.md**: Background jobs with Sidekiq
- **SCRUM-6_frontend.md**: Candidate report page
- **SCRUM-7_backend.md**: Advanced candidate scopes
- **SCRUM-8_frontend.md**: Candidate search and filtering

## Workflow Example

### Scenario: Adding a New Feature

1. **Create Specification**
   - Update `api-spec.yml` with new endpoint
   - Update `data-model.md` if schema changes
   - Document in standards if new pattern

2. **Create Implementation Plan**
   - Create `changes/SCRUM-X_backend.md` or `_frontend.md`
   - Detail all steps, dependencies, tests
   - Review plan before coding

3. **Implement**
   - Follow plan step-by-step
   - Write tests as specified
   - Update documentation as you go

4. **Verify**
   - All tests pass
   - Documentation updated
   - Code review (self or peer)
   - Meets standards

## AI-Assisted Development

SDD works exceptionally well with AI:

### How AI Helps

1. **Spec Analysis**: AI reads specs and generates implementation plans
2. **Code Generation**: AI generates code following specs and standards
3. **Documentation**: AI updates docs from code changes
4. **Testing**: AI generates test cases from specs

### Quality Control

- ✅ All AI-generated code is **reviewed**
- ✅ All code is **tested**
- ✅ All code follows **standards**
- ✅ All changes are **documented**

## Benefits in Practice

### For Development

- **Faster Development**: Clear specs = less rework
- **Better Code**: Specs guide architecture decisions
- **Easier Debugging**: Clear requirements = easier to find issues

### For Team

- **Onboarding**: New developers understand system quickly
- **Communication**: Specs serve as communication tool
- **Knowledge Sharing**: Specs document decisions

### For Maintenance

- **Documentation**: Specs are living documentation
- **Refactoring**: Clear specs make refactoring safer
- **Evolution**: Specs guide system evolution

## Best Practices

1. **Keep Specs Updated**: Specs should match implementation
2. **Review Plans**: Review implementation plans before coding
3. **Follow Standards**: Always follow coding standards
4. **Document Changes**: Update docs with code changes
5. **Test Everything**: Write tests as specified in plans

## Tools & Commands

### AI Agent Commands

- `@develop-backend.md @SCRUM-X_backend.md`: Implement backend feature
- `@develop-frontend.md @SCRUM-X_frontend.md`: Implement frontend feature
- `@plan-frontend-ticket.md @TICKET.md`: Create frontend plan

### Manual Workflow

1. Read specification
2. Create/update implementation plan
3. Implement following plan
4. Update documentation
5. Verify everything works

## Conclusion

Spec-Driven Development ensures:
- ✅ **Quality**: Clear specs lead to quality code
- ✅ **Consistency**: Standards ensure consistency
- ✅ **Speed**: Less rework = faster delivery
- ✅ **Maintainability**: Good docs = maintainable code

**This methodology, combined with AI assistance, enables rapid development while maintaining enterprise-grade quality.**

---

**See individual implementation plans in `changes/` for detailed examples.**

