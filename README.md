# 🚀 AIRails - AI-Powered Talent Management System

[![Ruby](https://img.shields.io/badge/Ruby-3.3+-red.svg)](https://www.ruby-lang.org/)
[![Rails](https://img.shields.io/badge/Rails-8.0-red.svg)](https://rubyonrails.org/)
[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue.svg)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> **Full-stack talent management system** demonstrating **Spec-Driven Development** and **responsible AI integration** for enterprise-grade applications.

## 🎯 Overview

AIRails is a comprehensive talent management platform built with **Ruby on Rails 8** and **React 18**, showcasing:

- ✅ **Spec-Driven Development (SDD)**: All features start with clear, comprehensive specifications
- ✅ **AI-Assisted Development**: Strategic use of AI for rapid, quality development
- ✅ **Enterprise-Grade Architecture**: Clean code, design patterns, comprehensive testing
- ✅ **Responsible AI Integration**: Ethical AI usage with guardrails and audit trails

### Key Highlights

- **Backend**: Rails 8 API with Service Objects, Adapter Pattern, and comprehensive RSpec tests
- **Frontend**: React 18 with TypeScript, Chakra UI v3, TanStack Query, and Vitest tests
- **AI Integration**: OpenAI adapter with versioned prompts, validation, and audit logging
- **Background Jobs**: Sidekiq for async processing (candidate report generation)
- **Advanced Features**: Candidate filtering, pagination, AI-powered scoring, interview management

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React + TypeScript)            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Pipeline   │  │  Candidates  │  │ Job Generator│     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│         │                  │                  │            │
│         └──────────────────┼──────────────────┘            │
│                            │                               │
└────────────────────────────┼───────────────────────────────┘
                             │ REST API
┌────────────────────────────┼───────────────────────────────┐
│                    Backend (Rails 8 API)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Controllers  │→ │   Services   │→ │    Models    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│         │                  │                  │            │
│         └──────────────────┼──────────────────┘            │
│                            │                               │
│  ┌──────────────┐          │          ┌──────────────┐     │
│  │ AI Adapters  │──────────┼─────────→│  PostgreSQL  │     │
│  └──────────────┘          │          └──────────────┘     │
│                            │                               │
│  ┌──────────────┐          │          ┌──────────────┐     │
│  │   Sidekiq    │←─────────┼──────────│    Redis     │     │
│  └──────────────┘                      └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

## 📋 Spec-Driven Development Process

This project follows a **Spec-Driven Development (SDD)** methodology:

1. **📝 Specifications First** (`ai-specs/specs/`): Technical specs, API contracts, data models
2. **📋 Implementation Plans** (`ai-specs/changes/`): Detailed step-by-step implementation guides
3. **💻 Code Implementation**: Following specifications and standards
4. **📚 Documentation**: Always updated with code changes

### Example Workflow

```
┌─────────────────┐
│  Jira Ticket    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Plan Document   │  ← Detailed implementation plan
│  (SCRUM-X.md)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Implementation │  ← Code following plan
│  (Backend/FE)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Tests + Docs   │  ← Quality assurance
└─────────────────┘
```

**See [Spec-Driven Development Guide](./ai-specs/README.md) for details.**

## 🤖 AI Integration Strategy

### Philosophy

AI is used as a **development accelerator**, not a replacement for engineering judgment.

### How AI Was Used

- **Code Generation**: Initial structure and boilerplate
- **Documentation**: Technical docs from specifications
- **Test Generation**: Test cases from requirements
- **Code Review**: AI-assisted review suggestions

### Quality Assurance

- ✅ All AI-generated code is **reviewed by developer**
- ✅ All code is **tested** (unit, integration)
- ✅ All code follows **project standards**
- ✅ All changes are **documented**

### Transparency

- Implementation plans document AI usage
- Code comments explain AI-generated logic
- Audit logs maintained for AI interactions

**See [AI Usage Documentation](./documentation/AI_USAGE.md) for details.**

## 🚀 Quick Start

### Prerequisites

- Ruby 3.3+
- Node.js 20+
- PostgreSQL 15
- Redis 7

### Backend Setup

```bash
cd backend

# Install dependencies
bundle install

# Setup database
cp env.example .env
# Edit .env with your database credentials

# Create and migrate database
rails db:create db:migrate

# Load demo data
rails db:seed
# or
bin/demo:seed

# Start server
rails server
```

Backend runs on `http://localhost:3000`

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Setup environment
cp env.example .env
# Edit .env with API URL

# Start dev server
npm run dev
```

Frontend runs on `http://localhost:5173`

### Docker Compose (Alternative)

```bash
# Start PostgreSQL and Redis
docker-compose up -d

# Then follow backend/frontend setup above
```

## 📚 Documentation

- **[Backend Architecture](./backend/README.md)**: Rails API structure, services, models
- **[Frontend Architecture](./frontend/README.md)**: React app structure, components, hooks
- **[Spec-Driven Development](./ai-specs/README.md)**: SDD process and workflow
- **[Demo Functionalities](./documentation/demo-functionalities.md)**: Feature overview
- **[Project Configuration](./documentation/project-configuration.md)**: Tech stack and standards
- **[AI Usage](./documentation/AI_USAGE.md)**: AI integration strategy

## 🛠️ Tech Stack

### Backend
- **Ruby on Rails 8** (API mode)
- **PostgreSQL 15** (database)
- **Redis 7** (caching, Sidekiq)
- **Sidekiq** (background jobs)
- **Blueprinter** (JSON serialization)
- **RSpec** (testing)
- **FactoryBot** (test data)

### Frontend
- **React 18.3** with **TypeScript 5.9**
- **Vite 5** (build tool)
- **Chakra UI v3** (component library)
- **TanStack Query** (data fetching)
- **React Router DOM 6** (routing)
- **Zustand** (state management)
- **Vitest** (testing)
- **React Testing Library** (component testing)

## 📊 Key Features

### Candidate Management
- ✅ Advanced filtering (education, experience, skills, recent applications)
- ✅ Search by name/email
- ✅ Pagination and sorting
- ✅ Candidate detail views
- ✅ Process reports with background job generation

### Position Management
- ✅ Position CRUD operations
- ✅ Interview flow configuration
- ✅ Candidate pipeline visualization
- ✅ Application tracking

### AI Features
- ✅ AI-powered candidate scoring
- ✅ Job description generation (planned)
- ✅ Executive summaries (planned)

### Background Processing
- ✅ Sidekiq integration
- ✅ Async report generation
- ✅ Sidekiq Web UI for monitoring

## 🧪 Testing

### Backend
- **RSpec** for unit and integration tests
- **FactoryBot** for test data
- **Coverage**: [X]% (run `bundle exec rspec` to see)

### Frontend
- **Vitest** for unit tests
- **React Testing Library** for component tests
- **Coverage**: [X]% (run `npm test` to see)

## 📈 Project Structure

```
AIRails/
├── ai-specs/              # Spec-Driven Development
│   ├── specs/             # Technical specifications
│   └── changes/           # Implementation plans
├── backend/               # Rails API
│   ├── app/
│   │   ├── controllers/  # API controllers
│   │   ├── models/       # ActiveRecord models
│   │   ├── services/     # Service objects
│   │   ├── adapters/     # AI adapters
│   │   └── serializers/  # Blueprinter serializers
│   └── spec/             # RSpec tests
├── frontend/              # React app
│   ├── src/
│   │   ├── features/     # Feature modules
│   │   ├── components/   # Reusable components
│   │   ├── services/     # API services
│   │   └── stores/       # Zustand stores
│   └── src/tests/        # Vitest tests
└── documentation/         # Project documentation
```

## 🎯 Design Patterns & Best Practices

### Backend
- **Service Objects**: Business logic encapsulation
- **Adapter Pattern**: AI provider abstraction
- **Repository Pattern**: Data access abstraction (via ActiveRecord)
- **Serializers**: Consistent JSON responses
- **Background Jobs**: Async processing with Sidekiq

### Frontend
- **Feature-Based Structure**: Organized by features
- **Custom Hooks**: Reusable logic
- **Service Layer**: API communication abstraction
- **State Management**: TanStack Query (server) + Zustand (client)

## 🔒 Security & Best Practices

- ✅ Input validation on all endpoints
- ✅ SQL injection prevention (ActiveRecord)
- ✅ CORS configuration
- ✅ Environment variables for secrets
- ✅ Rate limiting (AI endpoints)
- ✅ Audit logging (AI interactions)

## 📖 License

MIT License - See [LICENSE](LICENSE) file for details

## 👤 Author

**Vanessa Díaz**

- GitHub: [https://github.com/vd14z](https://github.com/vd14z)
- LinkedIn: [https://www.linkedin.com/in/vane-diaz/](https://www.linkedin.com/in/vane-diaz/)

## 🙏 Acknowledgments

- Built with [Ruby on Rails](https://rubyonrails.org/)
- UI components from [Chakra UI](https://chakra-ui.com/)
- Icons from [React Icons](https://react-icons.github.io/react-icons/)

---

**⭐ If you find this project interesting, please give it a star!**

