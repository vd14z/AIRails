# Fullstack Project Configuration and Best Practices

## Table of Contents

- [Overview](#overview)
- [Demo Scope](#demo-scope)
  - [Personas](#personas)
  - [Functional Highlights](#functional-highlights)
  - [IA Capabilities](#ia-capabilities)
- [Technology Stack](#technology-stack)
  - [Backend](#backend)
  - [Frontend](#frontend)
  - [Shared Tooling](#shared-tooling)
- [Project Structure](#project-structure)
- [Coding Standards](#coding-standards)
  - [Rails Conventions](#rails-conventions)
  - [React Conventions](#react-conventions)
  - [Service Layer Architecture](#service-layer-architecture)
- [UI/UX Standards](#uiux-standards)
  - [Design System](#design-system)
  - [Form Handling](#form-handling)
  - [Navigation Patterns](#navigation-patterns)
  - [Accessibility](#accessibility)
- [Testing Standards](#testing-standards)
  - [Backend Testing](#backend-testing)
  - [Frontend Testing](#frontend-testing)
  - [End-to-End Testing](#end-to-end-testing)
- [Configuration Standards](#configuration-standards)
  - [Ruby & Rails Configuration](#ruby--rails-configuration)
  - [TypeScript Configuration](#typescript-configuration)
  - [Environment Configuration](#environment-configuration)
- [Performance Best Practices](#performance-best-practices)
  - [Backend Optimization](#backend-optimization)
  - [Frontend Optimization](#frontend-optimization)
  - [AI Performance Considerations](#ai-performance-considerations)
- [Development Workflow](#development-workflow)
  - [Git Workflow](#git-workflow)
  - [Development Scripts](#development-scripts)
  - [Code Quality](#code-quality)
- [Migration Strategy](#migration-strategy)
  - [Legacy Data Integration](#legacy-data-integration)
  - [Progressive Enhancements](#progressive-enhancements)

---

## Overview

Este documento describe la configuración de referencia y las buenas prácticas para construir la demo fullstack que combina **Ruby on Rails 8** y **React 18**. El objetivo es exhibir un producto con estándares profesionales, alineado al manifiesto de buenas prácticas del equipo y que además demuestre capacidades de IA integradas de forma responsable.

## Demo Scope

### Personas
- **Recruiter Lead**: necesita visualizar vacantes, candidatos y recomendaciones inteligentes para acelerar decisiones.
- **Hiring Manager**: revisa evaluaciones generadas por IA, realiza feedback y aprueba movimientos en el pipeline.
- **Talent Ops**: administra fuentes de datos, entrena prompts y ajusta flujos de automatización.

### Functional Highlights
- Gestión de vacantes y candidatos con pipelines configurables.
- Recomendaciones IA para priorizar candidatos según afinidad cultural y técnica.
- Generación asistida de descripciones de rol y resúmenes ejecutivos.
- Trazabilidad completa de decisiones y auditoría de prompts/respuestas.

### IA Capabilities
- **Embeddings semánticos** vía OpenAI o Azure OpenAI para ranking de candidatos.
- **Resumidores y generadores de texto** para descripciones y feedback, con guardrails configurables.
- **Prompt templates versionados** y evaluaciones automáticas con métricas de sesgo y calidad.

## Technology Stack

### Backend
- **Ruby 3.3.x** como versión mínima soportada.
- **Ruby on Rails 8.0** (modo API, Hotwire deshabilitado, Zeitwerk).
- **PostgreSQL 15** como base de datos primaria con extensiones `pgvector` y `uuid-ossp`.
- **Redis 7** para caché, Action Cable y colas.
- **Sidekiq 7** para procesamiento asíncrono.
- **dry-rb** (dry-struct, dry-validation) para contratos y validaciones.
- **Blueprinter** para serialización consistente.
- **OpenAI Ruby SDK** (o proveedor equivalente) encapsulado en adaptadores.
- **StimulusReflex** reservado para futuras interacciones en tiempo real.

### Frontend
- **React 18.3** con componentes funcionales y hooks.
- **TypeScript 5.4** con tipado estricto.
- **Vite 5** como bundler y servidor de desarrollo.
- **React Router DOM 6.23** para navegación cliente.
- **TanStack Query** para manejo de datos asíncronos y caching.
- **Zustand** como estado global ligero (paneles, chat IA).
- **Chakra UI 3.29** como sistema de diseño accesible.
- **React Hook Form + Zod** para formularios robustos.
- **Storybook 8** para documentar componentes.

### Shared Tooling
- **Nx** para orquestar el monorepo y pipelines compartidos.
- **ESLint + Prettier + Stylelint** con reglas alineadas al manifiesto.
- **Rubocop + StandardRB** para estilo Ruby.
- **Overcommit** para hooks pre-commit/pre-push automatizados.
- **Docker Compose** para levantar infraestructura local (PostgreSQL, Redis, vector DB, mailcatcher).
- **OpenTelemetry** para trazabilidad extremo a extremo.

## Project Structure

```
.
├── backend/                     # Aplicación Rails 8 en modo API
│   ├── app/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── services/
│   │   ├── serializers/
│   │   ├── adapters/
│   │   └── workers/
│   ├── config/
│   ├── db/
│   ├── spec/
│   └── Gemfile
├── frontend/                    # Aplicación React + Vite
│   ├── src/
│   │   ├── components/
│   │   ├── features/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── services/
│   │   └── theme/
│   ├── public/
│   ├── cypress/
│   └── package.json
├── docs/
│   ├── architecture/
│   ├── ia/
│   └── runbooks/
├── infra/
│   ├── docker/
│   └── terraform/
├── nx.json
├── package.json
└── pnpm-workspace.yaml
```

## Coding Standards

### Rails Conventions
- **Arquitectura hexagonal ligera**: controladores delgados, servicios y repositorios encapsulan reglas de negocio.
- **Serializadores** (Blueprinter) para exponer contratos consistentes hacia el frontend.
- **Contracts** con dry-validation para validar params y payloads de IA antes de persistir.
- **Service Objects** en `app/services`, nombrados por caso de uso (`Candidates::ScoreAiFit`).
- **Workers** Sidekiq con idempotencia, reintentos limitados y monitoreo vía Sidekiq Web.
- **Auditoría** con PaperTrail o Audited para registrar prompts y respuestas de IA.
- **Guardrails de IA** aplicando JSON Schema y validaciones de contenido antes de publicar recomendaciones.

```
```ruby
# app/services/candidates/score_ai_fit.rb
module Candidates
  class ScoreAiFit
    include Dry::Monads[:result, :do]

    def call(candidate)
      payload = yield build_payload(candidate)
      response = yield adapters.ai.completions(payload)
      yield validate_response(response)
      persist_score(candidate, response[:score])
      Success(response[:score])
    end
  end
end
```
```

### React Conventions
- Componentes funcionales con hooks y `React.FC` tipado.
- Pastas por feature con `index.ts`, `routes.tsx`, `api.ts`, `components/`.
- `TanStack Query` maneja fetching, caching y sincronización con invalidaciones explícitas.
- `Zustand` encapsula estado compartido (p. ej. panel IA) con middlewares de logging y persistencia.
- Cada feature incluye pruebas (`*.spec.tsx`) y documentación interactiva (`*.stories.tsx`).

```
```typescript
type Candidate = {
  id: string;
  fullName: string;
  fitScore: number;
  lastInteraction: string;
};

export const CandidateCard: React.FC<{ candidate: Candidate }> = ({ candidate }) => (
  <Card variant="elevated">
    <Heading size="md">{candidate.fullName}</Heading>
    <Stat>
      <StatLabel>Fit IA</StatLabel>
      <StatNumber>{candidate.fitScore}</StatNumber>
    </Stat>
    <Text>Última interacción: {dayjs(candidate.lastInteraction).fromNow()}</Text>
  </Card>
);
```
```

### Service Layer Architecture
- **API RESTful + GraphQL**: Rails expone endpoints REST para CRUDs y GraphQL para queries agregadas.
- **Adapters IA** en `app/adapters/ai/` abstraen proveedores (OpenAI, Azure, Vertex) tras una interfaz común.
- **Event-driven**: eventos de dominio publicados en PostgreSQL (Logical Replication) o Redis Streams para analítica y auditoría.
- **Frontend API Layer**: generada con OpenAPI/GraphQL Codegen para hooks tipados (`useGetCandidatesQuery`).
- **Observabilidad**: instrumentación con OpenTelemetry, reportes a Honeycomb/New Relic, trazas con atributos de prompt.

## UI/UX Standards

### Design System
- **Chakra UI v3** extendido con tokens de marca usando `createSystem` y `defaultConfig`.
- **Theme configuration** via `createSystem` API with custom color tokens and global styles.
- **Component replacements**: Deprecated components (Card, Alert, Switch, Tag, FormControl, Divider, Table, Avatar, Tooltip) replaced with Box-based alternatives or native HTML elements.
- **Color mode**: Managed via `@chakra-ui/color-mode` package with `useColorMode` and `useColorModeValue` hooks.
- **Modos claro/oscuro** con persistencia en local storage y preferencia del sistema.
- **Iconografía** consistente usando React Icons (react-icons).
- **Storybook 8** para documentar componentes reutilizables y variaciones de estado.

### Form Handling
- Formularios controlados con React Hook Form y validación declarativa via Zod.
- **Estados optimistas** y mensajes de confirmación accesibles con Alert components (Chakra UI v3 removed `useToast`).
- **Autosave** en borradores mediante mutaciones TanStack Query con debouncing.
- **Segmentación de submit**: secciona formularios extensos en pasos (Stepper) y validaciones parciales.
- **Form components**: Use `VStack` and `Text` instead of deprecated `FormControl` and `FormLabel`.

### Navigation Patterns
- **React Router** con rutas anidadas y loaders para datos críticos.
- **Breadcrumbs** automáticos según árbol de navegación, integrados a `DocumentTitle`.
- **Deep linking** para abrir modales contextuales (review IA, histórico de interacciones).
- **Content Security Policy**: navegación segura, rutas privadas protegidas con guardias.

### Accessibility
- Componentes semánticos, roles explícitos (`role="dialog"`, `aria-modal`).
- Contrastes AA/AAA validados con addons de Storybook y pruebas automatizadas.
- Soporte completo de teclado y lectores de pantalla (Focus Trap, Skip Links).
- Preparación para i18n usando i18next + ICU MessageFormat.

## Testing Standards

### Backend Testing
- **RSpec** para pruebas de modelos, servicios, requests y contratos GraphQL.
- **FactoryBot** y **Faker** con factories tipadas, evitando fixtures estáticos.
- **VCR/WebMock** para aislar llamadas a proveedores de IA y reproducir escenarios.
- **Mutant** en dominios críticos (scoring, prompts) para garantizar cobertura semántica.

### Frontend Testing
- **Vitest + Testing Library** para pruebas unitarias e integración.
- **Storybook Interaction Tests** para validar estados accesibles.
- **MSW (Mock Service Worker)** para simular APIs sincronizado con fixtures RSpec.
- **Loki** o Chromatic para regresión visual en componentes clave.

### End-to-End Testing
- **Cypress 14** para flujos principales (creación pipeline, scoring IA, aprobaciones).
- **Contract Tests** con Pact entre frontend y backend.
- **Smoke tests** automatizados en cada build de vista previa (Vercel/Netlify Preview).

## Configuration Standards

### Ruby & Rails Configuration
- `config/application.rb` en modo API con middlewares mínimos y CORS estrictos.
- `config/credentials/` por entorno para llaves de IA y terceros.
- `config/puma.rb` optimizado para concurrencia (workers + threads).
- `config/sidekiq.yml` definirá colas priorizadas (`critical`, `default`, `low`).
- `config/initializers/ai.rb` centraliza adapters, límites, trazabilidad y masking de datos.
- `config/initializers/otel.rb` instrumenta Rails + Sidekiq + ActiveRecord.

### TypeScript Configuration
- `compilerOptions.strict` habilitado con `noUncheckedIndexedAccess`.
- `verbatimModuleSyntax: true` requires explicit `import type` for type-only imports.
- Path aliases `@features/*`, `@shared/*`, `@services/*`.
- Tipos globales para respuestas IA (`AiScoreResponse`, `PromptAuditEntry`).
- ESLint extiende `@tanstack/eslint-plugin-query` y `eslint-plugin-testing-library`.

### Environment Configuration
- `.env.example` documenta variables compartidas (`OPENAI_API_KEY`, `VECTOR_DB_URL`).
- Docker Compose levanta PostgreSQL, Redis, Weaviate (o pgvector), mailcatcher y minio para assets.
- `cypress.config.ts` sincronizado con backend y mocks IA.
- `app.json` y `Procfile` listos para despliegue en Render/Heroku (Rails API) y Vercel (frontend).

## Performance Best Practices

### Backend Optimization
- **pgvector** para búsquedas semánticas eficientes (`<->` distance, indexes ivfflat).
- **ActiveRecord scopes** selectivos y `includes` para evitar N+1.
- **Caching** con Redis (fragmentos IA, resultados de prompts).
- **Background jobs** para operaciones costosas de IA, con colas diferenciadas.
- **Rate limiting** con Rack::Attack en endpoints sensibles.

### Frontend Optimization
- **Code splitting** con `React.lazy` por ruta y feature.
- **TanStack Query** con caching, revalidación y suspenses controlados.
- **Memoización** con `useMemo`, `useCallback` y `memo` en componentes de lista masivos.
- **Monitoreo** con Web Vitals + Sentry Performance + Lighthouse CI.

### AI Performance Considerations
- **Batching** de prompts donde sea viable y reuso de embeddings cacheados.
- **Fallbacks** a modelos locales (ggml) cuando el proveedor externo falle.
- **Timeouts** y circuit breakers configurables en adapters IA.
- **Evaluaciones offline** programadas para recalibrar scores y detectar sesgos.

## Development Workflow

### Git Workflow
- Branches `feature/<ticket>`, `chore/<scope>`, `fix/<bug>` con prefijos semánticos.
- Commits descriptivos en inglés siguiendo Conventional Commits.
- Pull Requests con checklist del manifiesto (tests, seguridad, accesibilidad, IA).
- Revisión cruzada obligatoria y aprobación del líder técnico antes de merge.

### Development Scripts
```bash
bin/setup                        # Configura backend, frontend e infraestructura local
bin/dev                          # Ejecuta Rails, Vite y Sidekiq con Foreman
bundle exec rspec                # Pruebas backend
bundle exec rubocop              # Linter Ruby
bundle exec brakeman             # Escaneo de seguridad Rails
pnpm --filter frontend dev       # Servidor Vite (si se requiere aislado)
pnpm --filter frontend test:unit # Pruebas unitarias frontend
pnpm --filter frontend lint      # Linter frontend
pnpm --filter frontend cypress:open
pnpm --filter frontend cypress:run
```

### Code Quality
- **CI/CD** ejecuta linters, pruebas, contratos y análisis estático antes de liberar.
- **Brakeman** y **Bundler Audit** en cada PR para seguridad.
- **Stryker Mutator** para medir calidad de pruebas en frontend crítico.
- **SonarQube** y métricas de deuda técnica publicadas en dashboards del equipo.

## Migration Strategy

### Legacy Data Integration
- Migrar datos desde ATS existentes mediante jobs Sidekiq programados.
- Mapear modelos a esquemas normalizados con validaciones y contratos documentados.
- Registrar transformaciones en Data Contracts ubicados en `docs/architecture/contracts`.

### Progressive Enhancements
- Entregas incrementales: API básica → UI read-only → IA asistida → automatización.
- Feature flags (Flipper) para habilitar capacidades IA de forma escalonada.
- Observabilidad activa y feedback continuo con usuarios clave.

Esta guía asegura que la demo represente un producto enterprise listo para producción, cumpla el manifiesto interno y exhiba un uso responsable y diferenciador de IA.



