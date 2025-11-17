cómo: PO

quiero: Se implementen los siguientes scopes en el modelo Candidate:

with_education: Candidatos que tienen registros en la tabla educations.

experienced: Candidatos con experiencia laboral reciente (fin de experiencia nulo o posterior a hace 1 año).

by_skill(skill): Candidatos cuya descripción contenga la habilidad especificada (búsqueda insensible a mayúsculas).

recent_applications: Candidatos con aplicaciones realizadas en los últimos 30 días.

para: Habilitar una búsqueda avanzada y filtros complejos combinables de candidatos, resultando en queries optimizadas para mejorar el rendimiento de la aplicación. Usando ActiveRecord Scopes y el Query Interface para construir consultas poderosas y expresivas en el modelo Candidate.

 

Detalles del Contenido Original (Referencia)
 



Ruby


# app/models/candidate.rb
scope :with_education, -> { joins(:educations).distinct }
scope :experienced, -> { joins(:work_experiences).where("work_experiences.end_date IS NULL OR work_experiences.end_date > ?", 1.year.ago) }
scope :by_skill, ->(skill) { where("description ILIKE ?", "%#{skill}%") }
scope :recent_applications, -> { joins(:applications).where("applications.application_date > ?", 30.days.ago) }