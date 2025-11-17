# AIRails Backend - Ruby on Rails API

Backend API para el sistema de gestión de talento con capacidades de IA.

## Requisitos

- Ruby 3.2.0 o superior
- PostgreSQL 15+
- Redis 7+
- Bundler

## Configuración

### 1. Instalar dependencias

```bash
bundle install
```

### 2. Configurar base de datos

```bash
# Crear base de datos
rails db:create

# Ejecutar migraciones
rails db:migrate

# Cargar datos de ejemplo
rails db:seed
```

### 3. Variables de entorno

Crea un archivo `.env` (o exporta variables en tu entorno) tomando como referencia `env.example`:

```bash
cp env.example .env
```

Variables disponibles:

- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_TEST_NAME`, `DB_USER`, `DB_PASSWORD`
- `REDIS_URL`
- `CORS_ORIGINS`
- `OPENAI_API_KEY`, `AI_ADAPTER`

### 4. Iniciar servidor

```bash
# Servidor de desarrollo
rails server

# Con Sidekiq (en otra terminal)
bundle exec sidekiq
```

**Note**: Sidekiq requires Redis to be running. Make sure Redis is accessible at the URL specified in `REDIS_URL` environment variable.

### 5. Levantar PostgreSQL con Docker

```bash
docker compose up db
```

Esto levantará un contenedor PostgreSQL usando las credenciales definidas en tu `.env`.

## Scripts de Demo

### Cargar datos de demostración

```bash
bin/demo:seed
```

Este script carga datos de ejemplo incluyendo:
- Compañías
- Empleados
- Candidatos con educación y experiencia
- Posiciones de trabajo
- Aplicaciones e entrevistas

## Estructura del Proyecto

```
backend/
├── app/
│   ├── adapters/          # Adapters para servicios externos (IA, etc.)
│   ├── controllers/       # Controladores API
│   ├── models/           # Modelos ActiveRecord
│   ├── serializers/      # Serializadores Blueprinter
│   └── services/         # Service objects (lógica de negocio)
├── config/
│   ├── initializers/     # Configuraciones iniciales
│   └── routes.rb         # Rutas API
└── db/
    ├── migrate/          # Migraciones
    └── seeds.rb          # Seeds básicos
```

## API Endpoints

### Candidatos

- `GET /api/v1/candidates` - Listar candidatos (con paginación y búsqueda)
- `GET /api/v1/candidates/:id` - Detalles de candidato
- `POST /api/v1/candidates` - Crear candidato
- `PUT /api/v1/candidates/:id` - Actualizar etapa de entrevista
- `GET /api/v1/candidates/:id/report` - Obtener reporte de proceso del candidato (síncrono, genera on-demand)
- `POST /api/v1/candidates/:id/generate_report` - Generar reporte de proceso del candidato (asíncrono, via Sidekiq)

### Posiciones

- `GET /api/v1/positions` - Listar posiciones visibles
- `GET /api/v1/positions/:id` - Detalles de posición
- `PUT /api/v1/positions/:id` - Actualizar posición
- `GET /api/v1/positions/:id/candidates` - Candidatos de una posición
- `GET /api/v1/positions/:id/candidates/names` - Nombres de candidatos
- `GET /api/v1/positions/:id/interviewflow` - Flujo de entrevistas

### Upload

- `POST /api/v1/upload` - Subir archivo (PDF/DOCX)

## Testing

```bash
# Ejecutar tests RSpec
bundle exec rspec

# Con coverage
COVERAGE=true bundle exec rspec
```

## Code Quality

```bash
# Linter Ruby
bundle exec rubocop

# Auto-fix
bundle exec rubocop -a
```

## Arquitectura

El proyecto sigue principios de **Domain-Driven Design (DDD)** y **SOLID**:

- **Service Objects**: Lógica de negocio encapsulada en servicios (`app/services/`)
- **Adapters**: Abstracción de servicios externos (`app/adapters/`)
- **Serializers**: Contratos consistentes de API (`app/serializers/`)
- **Models**: Validaciones y relaciones (`app/models/`)

## Integración con IA

El sistema incluye adapters para integración con servicios de IA:

- `Ai::OpenAiAdapter` - Integración con OpenAI
- `Candidates::ScoreAiFitService` - Scoring de candidatos usando IA

Ver `config/initializers/ai.rb` para configuración.

## Background Jobs

El sistema utiliza **Sidekiq** para procesamiento asíncrono de tareas en segundo plano.

### Configuración

- ActiveJob está configurado para usar Sidekiq como adaptador de cola
- Redis es requerido para el funcionamiento de Sidekiq
- La URL de Redis se configura mediante la variable de entorno `REDIS_URL`

### Iniciar Sidekiq Worker

```bash
# En una terminal separada
bundle exec sidekiq
```

### Monitoreo de Jobs

- **Sidekiq Web UI**: Disponible en `/sidekiq` (solo en desarrollo y staging)
- Accede a `http://localhost:3000/sidekiq` para ver el estado de los jobs
- En producción, el Web UI debe estar protegido con autenticación

### Jobs Disponibles

- `Candidates::ProcessResumeJob` - Genera reportes de proceso de candidatos
  - **Uso**: `Candidates::ProcessResumeJob.perform_later(candidate_id)`
  - **Endpoint**: `POST /api/v1/candidates/:id/generate_report`
  - **Retry**: 3 intentos con espera exponencial
  - **Discard**: Se descarta si el candidato no existe

### Ejemplo de Uso

```ruby
# Enqueue job desde código
Candidates::ProcessResumeJob.perform_later(candidate.id)

# O desde el endpoint API
POST /api/v1/candidates/1/generate_report
# Respuesta: { "message": "Report generation started", "job_id": "...", "candidate_id": 1 }
```

## Próximos Pasos

- [ ] Implementar autenticación/autorización
- [ ] Agregar tests completos
- [ ] Configurar CI/CD
- [ ] Implementar más funcionalidades IA
- [ ] Agregar métricas y observabilidad
