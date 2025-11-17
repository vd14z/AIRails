Incluir una nueva vista para hacer uso de los nuevos filtros.

 # Uso básico
Candidate.with_education
Candidate.experienced
Candidate.by_skill("Ruby")
Candidate.recent_applications

# Combinación de scopes
Candidate.with_education.experienced.by_skill("Ruby").recent_applications

# Con paginación
Candidate.experienced.page(1).per(10)