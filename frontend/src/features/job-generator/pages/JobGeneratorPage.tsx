import { Box, SimpleGrid, Skeleton, Alert, AlertTitle, AlertDescription } from '@chakra-ui/react'
import { useState } from 'react'
import { PromptBuilder } from '../components/PromptBuilder'
import type { JobFormValues } from '../components/PromptBuilder'
import { PreviewPanel } from '../components/PreviewPanel'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { AiInsightCard } from '@/components/ui/AiInsightCard'
import { Icon } from '@chakra-ui/react'
import { FiCheckCircle } from 'react-icons/fi'

const mockDescriptions: Record<string, string> = {
  default: `Estamos buscando un perfil senior en plataformas cloud con dominio de Ruby on Rails, Kubernetes y observabilidad moderna. Liderarás la evolución de nuestra infraestructura multi-tenant y programas de automatización IA.`,
}

export function JobGeneratorPage() {
  const [description, setDescription] = useState<string>()
  const [summary, setSummary] = useState<string>()
  const [loading, setLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleGenerate = async (values: JobFormValues) => {
    setLoading(true)
    setShowSuccess(false)
    await new Promise((resolve) => setTimeout(resolve, 1200))
    setDescription(
      `${values.role} (${values.seniority})\n\n${mockDescriptions.default}\n\nRequerimientos: ${values.requirements}`,
    )
    setSummary('Perfil orientado a plataforma con experiencia liderando squads DevEx e IA aplicada a operaciones.')
    setShowSuccess(true)
    setLoading(false)
    setTimeout(() => setShowSuccess(false), 5000)
  }

  return (
    <Box>
      <SectionHeader
        title="Generador de puestos asistido por IA"
        description="Documenta necesidades y obtén una propuesta lista para revisar y auditar."
      />

      {showSuccess && (
        <Alert status="success" borderRadius="md" mb={6} bg="green.900" border="1px solid" borderColor="green.300">
          <Icon as={FiCheckCircle} boxSize={5} color="green.400" />
          <Box flex="1" ml={3}>
            <AlertTitle fontSize="sm">Descripción generada</AlertTitle>
            <AlertDescription fontSize="sm">
              Puedes revisarla, enviar feedback o guardarla como plantilla.
            </AlertDescription>
          </Box>
        </Alert>
      )}

      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
        <Box border="1px solid" borderColor="whiteAlpha.200" borderRadius="lg" p={6}>
          <PromptBuilder onSubmit={handleGenerate} isLoading={loading} />
        </Box>
        <Skeleton isLoaded={!loading} borderRadius="lg">
          <PreviewPanel description={description} summary={summary} />
        </Skeleton>
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mt={8}>
        <AiInsightCard
          title="Hallazgo IA: sesgo de lenguaje"
          description="Se detectaron frases que podrían desalentar postulaciones de perfiles junior."
          confidence={74}
        />
        <AiInsightCard
          title="Sugerencia de métricas"
          description="Incluye impacto esperado: reducir MTTR 30% y habilitar pipeline IA en 90 días."
          confidence={88}
        />
      </SimpleGrid>
    </Box>
  )
}

