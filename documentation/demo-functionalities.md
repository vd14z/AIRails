# Demo IA Talent Hub – Functional Blueprint

## Objetivo

Definir un conjunto de funcionalidades demostrables en 30-45 minutos que destaquen buenas prácticas de ingeniería en Ruby on Rails 8 + React 18, y exhiban usos responsables de IA generativa y embeddings dentro del dominio de adquisición de talento.

## Resumen Ejecutivo

- **Dominio**: gestión de vacantes y candidatos con scoring inteligente.
- **Público**: reclutadores senior, hiring managers y equipos de operaciones de talento.
- **Entrega**: demo navegable con datos de ejemplo, scripts reproducibles (`bin/demo:seed`) y dashboards de métricas IA.

## Casos de Uso Prioritarios

### 1. Pipeline Inteligente de Candidatos
- **Usuario**: Recruiter Lead.
- **Funcionalidad**:
  - Visualizar pipeline Kanban por etapa.
  - Recibir sugerencias IA de candidatos prioritarios según match cultural/técnico.
  - Descartar recomendaciones con feedback que retroalimenta el modelo (aprendizaje supervisado).
- **IA**: embeddings para similitud CV-descripción; prompt con memoria de decisiones previas.
- **KPIs**: tiempo promedio en etapa, ratio de conversión, precisión de recomendaciones.

### 2. Generador de Descripciones de Puestos
- **Usuario**: Talent Ops.
- **Funcionalidad**:
  - Wizard para capturar requerimientos clave.
  - IA genera descripción inicial y variantes según nivel de seniority.
  - Revisión colaborativa con control de versiones y sugerencias.
- **IA**: LLM con prompt estructurado (roles, responsabilidades, métricas de éxito).
- **Guardrails**: filtro de lenguaje inclusivo, verificación de sesgos, auditoría del prompt.

### 3. Resumen Ejecutivo para Hiring Managers
- **Usuario**: Hiring Manager.
- **Funcionalidad**:
  - Panel con candidatos finalistas y resumen IA de fortalezas/riesgos.
  - Botón “Solicitar comparativo” que genera tabla comparativa + preguntas sugeridas para entrevista.
  - Registro de decisiones y motivos (compliance).
- **IA**: Generation + análisis de sentimientos de feedback recopilado.
- **Reglas**: todas las respuestas IA pasan por validación JSON Schema y sanitización.

### 4. Retroalimentación Continua al Modelo
- **Usuario**: Todos.
- **Funcionalidad**:
  - Botón “Calificar utilidad” en cada output IA con escala Likert.
  - Job nocturno recalibra pesos y reentrena prompts.
  - Dashboard con métricas de sesgo, satisfacción y latencia.
- **IA**: Evaluaciones automáticas (OpenAI Evals o LangSmith) + almacenamiento vectorial histórico.

## Historias de Usuario Clave

| ID | Historia | Criterios de Aceptación |
|----|----------|-------------------------|
| US-001 | Como Recruiter Lead quiero ver un pipeline interactivo con recomendaciones IA para priorizar a quién contactar. | Visualización Kanban, etiquetas de score IA, acciones de aceptar/descartar, feedback persistido. |
| US-002 | Como Talent Ops quiero generar una descripción de puesto usando IA que respete nuestras guías de lenguaje inclusivo. | Wizard de inputs, vista previa IA, análisis de sesgo, guardar versión aprobada. |
| US-003 | Como Hiring Manager quiero recibir un resumen ejecutivo de la terna final para preparar la reunión de decisión. | Resumen IA, comparativo descargable, registro de decisión y comentarios manuales. |
| US-004 | Como Equipo IA quiero monitorear la calidad y equidad de las recomendaciones generadas. | Dashboard con métricas (precisión, latencia, sesgo), logs auditados, alertas al superar umbrales. |

## Modelado de Dominio (simplificado)

```
Recruiter
HiringManager
TalentOps
JobOpening
Candidate
Application (Candidate ↔ JobOpening)
Interview
AiRecommendation (belongs_to Application)
PromptTemplate (versioned)
PromptAuditLog
Feedback (polymorphic)
```

## Arquitectura de Funcionalidad

- **Backend Rails**:
  - Controladores en `Api::V1` exponiendo endpoints REST + GraphQL schema en `/graphql`.
  - Service objects (`Candidates::ScoreAiFit`, `Jobs::GenerateDescription`) orquestan adapters IA.
  - Jobs Sidekiq (`Ai::RecalibratePromptJob`) para tareas diferidas.
  - Policies con Pundit para permisos por rol.
  - Serializadores Blueprinter garantizan contratos estables.

- **Frontend React**:
  - Rutas principales: `/pipeline`, `/jobs/new`, `/executive-summary`, `/insights`.
  - Feature hooks: `useCandidatePipeline`, `useGenerateJobDescription`, `useExecutiveSummary`.
  - Estados críticos en Zustand (`useAiFeedbackStore`).
  - Storybook documenta componentes UI y estados IA (loading, éxito, error, fallback).

- **IA Layer**:
  - `Ai::Client` (interface) con implementaciones para OpenAI y Azure.
  - `Ai::Evaluator` ejecuta pruebas automáticas y registra resultados.
  - Prompt templates en YAML versionados con firmas SHA y metadata de aprobación.

## Seguridad y Cumplimiento

- Datos sensibles ofuscados antes de enviar a proveedores IA (PPI masking).
- Logging estructurado con trazas (`prompt_id`, `model`, `latency_ms`, `cost_usd`).
- Rate limiting y retries exponenciales.
- Auditoría completa con exportación en CSV/JSON desde la UI.

## Métricas y Observabilidad

- **Backend**: métricas Prometheus (latencia API, tiempo de jobs, tasa de aciertos IA).
- **Frontend**: Web Vitals + eventos personalizados (`ai_recommendation_clicked`, `feedback_submitted`).
- **IA**: dashboards con precisión, recuerde, fairness (demographic parity) y costo estimado por día.

## Plan de Entrega (Sprints sugeridos)

1. **Sprint 0** – Configuración base (Rails API, React shell, CI/CD, seeds).
2. **Sprint 1** – Pipeline + recomendaciones IA iniciales.
3. **Sprint 2** – Generador de puestos + auditoría de prompts.
4. **Sprint 3** – Resumen ejecutivo + comparativos.
5. **Sprint 4** – Dashboard métricas IA + retroalimentación continua.

Cada sprint concluye con demo interna, retrospectiva y checklist del manifiesto (tests, seguridad, accesibilidad, ética IA).

## Scripts de Demo

- `bin/demo:seed` – carga datos base + embeddings precalculados.
- `bin/demo:reset` – limpia estado (PostgreSQL, Redis, vectores) y reconfigura llaves dummy.
- `pnpm --filter frontend demo` – ejecuta Cypress en modo guiado para reproducir narrativa principal.

## Próximos Pasos

- Completar diagramas en `docs/architecture` (C4 nivel 2 y secuencia IA).
- Refrescar manifiesto de IA en `docs/ia/guardrails.md`.
- Preparar video corto de walkthrough con script narrado (máx. 5 minutos).



