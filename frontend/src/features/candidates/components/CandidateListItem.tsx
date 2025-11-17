import {
  Box,
  HStack,
  VStack,
  Text,
  Button,
  Badge,
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import type { Candidate } from '@/services/api/types'
import { FiFileText, FiMail, FiPhone, FiMapPin } from 'react-icons/fi'

type CandidateListItemProps = {
  candidate: Candidate
  onViewDetails?: (candidateId: number) => void
}

// Helper function to get initials from name
function getInitials(firstName: string, lastName: string): string {
  return `${firstName[0]}${lastName[0]}`.toUpperCase()
}

export function CandidateListItem({ candidate, onViewDetails }: CandidateListItemProps) {
  const navigate = useNavigate()

  const handleViewReport = () => {
    if (onViewDetails) {
      onViewDetails(candidate.id)
    } else {
      navigate(`/candidates/${candidate.id}/report`)
    }
  }

  const fullName = `${candidate.first_name} ${candidate.last_name}`

  return (
    <Box
      bg="gray.800"
      border="1px solid"
      borderColor="whiteAlpha.200"
      borderRadius="lg"
      p={4}
      _hover={{
        borderColor: 'whiteAlpha.300',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      }}
      transition="all 0.2s"
    >
      <HStack justify="space-between" align="flex-start" mb={3}>
        <HStack gap={3}>
          <Box
            w="40px"
            h="40px"
            borderRadius="full"
            bg="purple.500"
            display="flex"
            alignItems="center"
            justifyContent="center"
            color="white"
            fontSize="sm"
            fontWeight="bold"
            flexShrink={0}
          >
            {getInitials(candidate.first_name, candidate.last_name)}
          </Box>
          <VStack gap={1} align="flex-start">
            <Text fontWeight="semibold" fontSize="md">
              {fullName}
            </Text>
            <HStack gap={2} fontSize="sm" color="gray.400">
              <HStack gap={1}>
                <Box as={FiMail} />
                <Text>{candidate.email}</Text>
              </HStack>
            </HStack>
          </VStack>
        </HStack>
        {candidate.fitScore !== undefined && (
          <Badge colorScheme="blue" bg="blue.900" color="blue.200" px={2} py={1} borderRadius="md">
            Score: {candidate.fitScore}%
          </Badge>
        )}
      </HStack>

      <VStack gap={2} align="stretch" fontSize="sm" color="gray.400" mb={3}>
        {candidate.phone && (
          <HStack gap={2}>
            <Box as={FiPhone} />
            <Text>{candidate.phone}</Text>
          </HStack>
        )}
        {candidate.address && (
          <HStack gap={2}>
            <Box as={FiMapPin} />
            <Text>{candidate.address}</Text>
          </HStack>
        )}
        {candidate.stage && (
          <Badge colorScheme="purple" bg="purple.900" color="purple.200" px={2} py={0.5} borderRadius="md" fontSize="xs" w="fit-content">
            {candidate.stage}
          </Badge>
        )}
      </VStack>

      <HStack justify="flex-end" mt={4}>
        <Button
          size="sm"
          variant="outline"
          onClick={handleViewReport}
        >
          <HStack gap={2}>
            <Box as={FiFileText} />
            <Text>View Report</Text>
          </HStack>
        </Button>
      </HStack>
    </Box>
  )
}

