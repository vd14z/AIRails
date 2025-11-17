import {
  Box,
  Heading,
  SimpleGrid,
  Text,
  Button,
  VStack,
  HStack,
} from '@chakra-ui/react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { AiInsightCard } from '@/components/ui/AiInsightCard'
import { StatCard } from '@/components/ui/StatCard'
import { FiAward, FiCheckCircle, FiClock, FiShield } from 'react-icons/fi'

const comparison = [
  { name: 'Alice Johnson', fit: '89%', risk: 'Baja', notes: 'Lideró migración cloud global' },
  { name: 'Bob Martínez', fit: '82%', risk: 'Media', notes: 'Gran dominio IA aplicada' },
  { name: 'Carol Williams', fit: '80%', risk: 'Baja', notes: 'Enfocada en gobierno de datos' },
]

export function ExecutiveSummaryPage() {
  return (
    <Box>
      <SectionHeader
        title="Resumen ejecutivo"
        description="Comparativa automatizada para la terna final y decisiones auditables."
        rightSlot={<Button colorScheme="brand">Descargar reporte</Button>}
      />

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} mb={6}>
        <StatCard label="Tiempo a decisión" value="3 días" icon={FiClock} />
        <StatCard label="NPS Hiring Manager" value="9.4" delta="+0.8" icon={FiCheckCircle} />
        <StatCard label="Riesgo cumplimiento" value="Bajo" icon={FiShield} />
      </SimpleGrid>

      <Box mb={8} border="1px solid" borderColor="whiteAlpha.200" borderRadius="lg" p={6} bg="gray.800">
        <Heading size="sm" mb={4}>
          Comparativo de finalistas
        </Heading>
          <VStack align="stretch" spacing={0}>
            <HStack
              borderBottom="1px solid"
              borderColor="whiteAlpha.200"
              pb={2}
              mb={2}
              fontWeight="semibold"
              fontSize="sm"
              color="gray.400"
            >
              <Box flex="1">Nombre</Box>
              <Box w="80px">Fit IA</Box>
              <Box w="100px">Riesgo</Box>
              <Box flex="1">Notas</Box>
            </HStack>
            {comparison.map((row) => (
              <HStack
                key={row.name}
                borderBottom="1px solid"
                borderColor="whiteAlpha.100"
                py={3}
                fontSize="sm"
              >
                <Box flex="1" fontWeight="medium">
                  {row.name}
                </Box>
                <Box w="80px">{row.fit}</Box>
                <Box w="100px">{row.risk}</Box>
                <Box flex="1" color="gray.300">
                  {row.notes}
                </Box>
              </HStack>
            ))}
          </VStack>
      </Box>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        <AiInsightCard
          title="Recomendación final"
          description="Alice Johnson maximiza la alineación cultural y lideró la implementación de guardrails IA en su empresa actual."
          confidence={94}
          action="Emitir oferta condicionada a validación de compensación"
        />
        <AiInsightCard
          title="Checklist de compliance"
          description="Todos los candidatos confirmaron consentimiento explícito para uso de IA y existe traza en PromptAuditLog."
          confidence={100}
          action="Compartir reporte con Legal previo a la firma"
        />
      </SimpleGrid>
    </Box>
  )
}

