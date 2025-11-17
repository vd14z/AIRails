import {
  Box,
  HStack,
  VStack,
  Text,
  IconButton,
  Badge,
} from '@chakra-ui/react'
import { FiMoreHorizontal, FiThumbsDown, FiThumbsUp, FiFileText } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { ScoreBadge } from '@/components/ui/ScoreBadge'

type CandidateCardProps = {
  name: string
  score: number
  step: string
  lastInteraction?: string
  candidateId?: number
}

// Helper function to get initials from name
function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function CandidateCard({ name, score, step, lastInteraction, candidateId }: CandidateCardProps) {
  const navigate = useNavigate()

  const handleViewReport = () => {
    if (candidateId) {
      navigate(`/candidates/${candidateId}/report`)
    }
  }

  return (
    <Box bg="gray.800" border="1px solid" borderColor="whiteAlpha.200" borderRadius="lg" p={4} mb={3}>
        <HStack justify="space-between" align="flex-start">
          <HStack spacing={3}>
            <Box
              w="32px"
              h="32px"
              borderRadius="full"
              bg="purple.500"
              display="flex"
              alignItems="center"
              justifyContent="center"
              color="white"
              fontSize="xs"
              fontWeight="bold"
              flexShrink={0}
            >
              {getInitials(name)}
            </Box>
            <VStack spacing={0} align="flex-start">
              <Text fontWeight="semibold">{name}</Text>
              <Badge colorScheme="purple" bg="purple.900" color="purple.200" px={2} py={0.5} borderRadius="md" fontSize="xs">
                {step}
              </Badge>
            </VStack>
          </HStack>
          <ScoreBadge score={score} />
        </HStack>
        {lastInteraction ? (
          <Text color="gray.400" fontSize="xs" mt={2}>
            Última interacción: {lastInteraction}
          </Text>
        ) : null}
        <HStack mt={3} spacing={2}>
          <Box title="Aprobar movimiento">
            <IconButton aria-label="Aprobar" size="sm" icon={<FiThumbsUp />} variant="ghost" />
          </Box>
          <Box title="Solicitar cambios">
            <IconButton aria-label="Rechazar" size="sm" icon={<FiThumbsDown />} variant="ghost" />
          </Box>
          {candidateId && (
            <Box title="View Report">
              <IconButton
                aria-label="View Report"
                size="sm"
                icon={<FiFileText />}
                variant="ghost"
                onClick={handleViewReport}
              />
            </Box>
          )}
          <Box title="Ver más acciones">
            <IconButton aria-label="Más acciones" size="sm" icon={<FiMoreHorizontal />} variant="ghost" />
          </Box>
        </HStack>
    </Box>
  )
}

