import {
  Box,
  VStack,
  SimpleGrid,
  Spinner,
  Text,
  Button,
  HStack,
} from '@chakra-ui/react'
import type { Candidate } from '@/services/api/types'
import { CandidateListItem } from './CandidateListItem'

type CandidateListProps = {
  candidates: Candidate[]
  isLoading: boolean
  error: Error | null
  pagination?: {
    total: number
    page: number
    limit: number
    total_pages: number
  }
  onPageChange?: (page: number) => void
}

export function CandidateList({
  candidates,
  isLoading,
  error,
  pagination,
  onPageChange,
}: CandidateListProps) {
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="400px">
        <VStack gap={4}>
          <Spinner size="xl" color="brand.400" />
          <Text color="gray.400">Loading candidates...</Text>
        </VStack>
      </Box>
    )
  }

  if (error) {
    return (
      <Box
        bg="red.900"
        border="1px solid"
        borderColor="red.700"
        borderRadius="lg"
        p={6}
      >
        <VStack gap={4}>
          <Text color="red.200" fontWeight="semibold">
            Unable to load candidates. Please try again.
          </Text>
          <Text color="red.300" fontSize="sm">
            {error.message}
          </Text>
        </VStack>
      </Box>
    )
  }

  if (candidates.length === 0) {
    return (
      <Box
        bg="gray.800"
        border="1px solid"
        borderColor="whiteAlpha.200"
        borderRadius="lg"
        p={8}
        textAlign="center"
      >
        <Text color="gray.400" fontSize="lg" mb={2}>
          No candidates found
        </Text>
        <Text color="gray.500" fontSize="sm">
          Try adjusting your filters to see more results.
        </Text>
      </Box>
    )
  }

  return (
    <VStack gap={6} align="stretch">
      {/* Results Count */}
      {pagination && (
        <HStack justify="space-between" align="center">
          <Text color="gray.400" fontSize="sm">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
            {pagination.total} candidates
          </Text>
        </HStack>
      )}

      {/* Candidate Grid */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={4}>
        {candidates.map((candidate) => (
          <CandidateListItem key={candidate.id} candidate={candidate} />
        ))}
      </SimpleGrid>

      {/* Pagination */}
      {pagination && pagination.total_pages > 1 && onPageChange && (
        <HStack justify="center" gap={2} mt={4}>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onPageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
          >
            Previous
          </Button>
          <Text color="gray.400" fontSize="sm">
            Page {pagination.page} of {pagination.total_pages}
          </Text>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onPageChange(pagination.page + 1)}
            disabled={pagination.page >= pagination.total_pages}
          >
            Next
          </Button>
        </HStack>
      )}
    </VStack>
  )
}

