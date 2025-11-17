import { Box, SimpleGrid, Text, Heading, VStack } from '@chakra-ui/react'
import type { CandidateReport } from '@/services/api/types'
import { StatCard } from '@/components/ui/StatCard'
import { FiBriefcase, FiUsers, FiTrendingUp, FiFileText } from 'react-icons/fi'

type ReportSummaryProps = {
  summary: CandidateReport['summary']
}

export function ReportSummary({ summary }: ReportSummaryProps) {
  return (
      <VStack gap={6} align="stretch">
      <Heading size="md">Summary Statistics</Heading>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={4}>
        <StatCard
          label="Total Applications"
          value={summary.total_applications.toString()}
          icon={FiBriefcase}
        />
        <StatCard
          label="Total Interviews"
          value={summary.total_interviews.toString()}
          icon={FiUsers}
        />
        <StatCard
          label="Average Score"
          value={`${summary.average_score}%`}
          icon={FiTrendingUp}
        />
        <StatCard
          label="Current Applications"
          value={summary.current_applications.toString()}
          icon={FiFileText}
        />
      </SimpleGrid>

      {Object.keys(summary.applications_by_status).length > 0 && (
        <Box>
          <Text fontSize="sm" color="gray.400" mb={3} textTransform="uppercase" letterSpacing="wide">
            Applications by Status
          </Text>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={3}>
            {Object.entries(summary.applications_by_status).map(([status, count]) => (
              <Box
                key={status}
                bg="gray.800"
                border="1px solid"
                borderColor="whiteAlpha.200"
                borderRadius="md"
                p={3}
              >
                <Text fontSize="sm" color="gray.400">
                  {status}
                </Text>
                <Text fontSize="xl" fontWeight="bold" mt={1}>
                  {count}
                </Text>
              </Box>
            ))}
          </SimpleGrid>
        </Box>
      )}
    </VStack>
  )
}

