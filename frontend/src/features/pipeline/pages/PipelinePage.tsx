import {
  Box,
  Button,
  Flex,
  Input,
  SimpleGrid,
  VStack,
  Text,
} from '@chakra-ui/react'
import { useMemo, useState } from 'react'
import { usePipelineQuery, usePositionsQuery } from '@/services/api/hooks'
import { PipelineBoard } from '../components/PipelineBoard'
import type { PipelineStage } from '../components/PipelineBoard'
import { StatCard } from '@/components/ui/StatCard'
import { FiClock, FiTrendingUp, FiUsers } from 'react-icons/fi'
import { AiInsightCard } from '@/components/ui/AiInsightCard'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { PromptGuard } from '@/components/feedback/PromptGuard'

const defaultStages: PipelineStage[] = [
  { title: 'Screening', candidates: [] },
  { title: 'Entrevista técnica', candidates: [] },
  { title: 'Panel final', candidates: [] },
  { title: 'Oferta', candidates: [] },
]

export function PipelinePage() {
  const [positionId, setPositionId] = useState<number | undefined>()
  const { data: positions } = usePositionsQuery()
  const { data: pipeline } = usePipelineQuery(positionId)

  const stages = useMemo(() => {
    if (!pipeline) return defaultStages
    return defaultStages.map((stage) => ({
      ...stage,
      candidates: pipeline
        .filter((candidate) => candidate.currentInterviewStep === stage.title || stage.title === 'Screening')
        .map((candidate) => ({
          id: candidate.candidateId,
          name: candidate.fullName,
          score: Math.round(candidate.averageScore),
          step: candidate.currentInterviewStep,
          lastInteraction: 'Hace 2 días',
        })),
    }))
  }, [pipeline])

  return (
    <Box>
      <SectionHeader
        title="Pipeline inteligente"
        description="Gestiona candidatos con recomendaciones IA y auditoría continua."
        rightSlot={<Button colorScheme="brand">Crear vacante</Button>}
      />

      <Box mb={6} border="1px solid" borderColor="whiteAlpha.200" borderRadius="lg" p={6} bg="gray.800">
        <Flex gap={4} wrap="wrap">
          <VStack align="flex-start" spacing={1} w={{ base: '100%', md: '300px' }}>
            <Text fontSize="sm" color="gray.400" fontWeight="medium">
              Vacante
            </Text>
            <Box
              as="select"
              placeholder="Selecciona una vacante"
              value={positionId || ''}
              onChange={(event) => setPositionId(Number(event.target.value))}
              w="100%"
              p={2}
              borderRadius="md"
              border="1px solid"
              borderColor="whiteAlpha.200"
              bg="gray.900"
              color="gray.100"
              _focus={{ borderColor: 'brand.500', outline: 'none' }}
            >
              <option value="">Selecciona una vacante</option>
              {positions?.map((position) => (
                <option key={position.id} value={position.id}>
                  {position.title}
                </option>
              ))}
            </Box>
          </VStack>
          <VStack align="flex-start" spacing={1} w={{ base: '100%', md: '300px' }}>
            <Text fontSize="sm" color="gray.400" fontWeight="medium">
              Buscar candidato
            </Text>
            <Input placeholder="Nombre o email" w="100%" />
          </VStack>
          <Flex align="flex-end">
            <Button variant="outline">Exportar panel</Button>
          </Flex>
        </Flex>
      </Box>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} mb={6}>
        <StatCard label="Tiempo medio etapa" value="5.2 días" delta="-1.4 d" icon={FiClock} />
        <StatCard label="Conversión global" value="34%" delta="+6% vs semana anterior" icon={FiTrendingUp} />
        <StatCard label="Candidatos activos" value={pipeline?.length.toString() ?? '0'} icon={FiUsers} />
      </SimpleGrid>

      <PromptGuard />

      <Box mt={6}>
        <PipelineBoard stages={stages} />
      </Box>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mt={8}>
        <AiInsightCard
          title="Prioriza entrevistas técnicas"
          description="La IA detectó 4 perfiles con match >85% esperando evaluación técnica más de 72h."
          confidence={92}
          action="Agendar en las próximas 24h"
        />
        <AiInsightCard
          title="Sesgo potencial"
          description="La proporción de mujeres en la terna final es 15%. Se recomienda revisar criterios."
          confidence={78}
          action="Añadir filtro de diversidad en sourcing"
        />
      </SimpleGrid>
    </Box>
  )
}

