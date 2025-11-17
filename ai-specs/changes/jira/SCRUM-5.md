#### 1. **Background Jobs con Sidekiq** ⭐⭐⭐

**Beneficio Rails**: Incluir Jobs asíncrono nativos

```ruby

# app/jobs/candidates/process_resume_job.rb

class Candidates::ProcessResumeJob < ApplicationJob

  queue_as :default

  def perform(candidate_id, resume_path)

    
    # Generar Reporte

  end

end

```

**Casos de uso**:

Generación de reportes demo para resumir los processos de un candidato