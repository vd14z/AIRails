import { Box, SimpleGrid, VStack, Text, HStack, Badge } from '@chakra-ui/react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { StatCard } from '@/components/ui/StatCard'
import { AiInsightCard } from '@/components/ui/AiInsightCard'
import { useAiFeedbackStore } from '@/stores/aiFeedbackStore'
import { FiTrendingUp, FiClock, FiShield } from 'react-icons/fi'

export function InsightsPage() {
  const entries = useAiFeedbackStore((state) => state.entries)

  return (
    <Box>
      <SectionHeader title="Insights de IA" description="Métricas operativas y feedback recopilado." />

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} mb={6}>
        <StatCard label="Precisión recomendaciones" value="87%" delta="+5% semana" icon={FiTrendingUp} />
        <StatCard label="Latencia promedio" value="1.2s" delta="-0.3s" icon={FiClock} />
        <StatCard label="Incidentes detec. guardrails" value="2" delta="-3 casos" icon={FiShield} />
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        <AiInsightCard
          title="Modelo embeddings"
          description="Se recomienda recalibrar embeddings cada 14 días para reducir drift detectado en skills de IA."
          confidence={81}
        />
        <AiInsightCard
          title="Uso de prompts"
          description="El 62% de usuarios aprovecha plantillas aprobadas. Incentivar su uso reduce el tiempo de generación 38%."
          confidence={76}
        />
      </SimpleGrid>

      <Box mt={8}>
        <SectionHeader title="Feedback reciente" />
        <VStack align="stretch" spacing={3}>
          {entries.length === 0 ? (
            <Text color="gray.500">Aún no hay feedback registrado.</Text>
          ) : (
            entries.map((entry) => (
              <Box key={entry.id} border="1px solid" borderColor="whiteAlpha.200" borderRadius="md" p={4}>
                <HStack justify="space-between" mb={2}>
                  <Badge colorScheme="brand">{entry.artifact}</Badge>
                  <Text fontSize="xs" color="gray.500">
                    {new Date(entry.createdAt).toLocaleString()}
                  </Text>
                </HStack>
                <Text color="gray.300">{entry.comment}</Text>
                <Box borderTop="1px solid" borderColor="whiteAlpha.200" my={3} />
                <Text fontSize="sm" color="yellow.200">
                  Utilidad: {entry.rating}/5
                </Text>
              </Box>
            ))
          )}
        </VStack>
      </Box>
    </Box>
  )
}

