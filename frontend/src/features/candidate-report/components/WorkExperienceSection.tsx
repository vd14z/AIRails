import { Box, VStack, HStack, Text, Heading } from '@chakra-ui/react'
import type { CandidateReport } from '@/services/api/types'
import dayjs from 'dayjs'

type WorkExperienceSectionProps = {
  workExperience: CandidateReport['work_experience']
}

export function WorkExperienceSection({ workExperience }: WorkExperienceSectionProps) {
  if (workExperience.length === 0) {
    return (
      <Box>
        <Heading size="md" mb={4}>
          Work Experience
        </Heading>
        <Text color="gray.400">No work experience records found.</Text>
      </Box>
    )
  }

  const formatDateRange = (startDate: string, endDate?: string) => {
    const start = dayjs(startDate).format('MMM YYYY')
    const end = endDate ? dayjs(endDate).format('MMM YYYY') : 'Present'
    return `${start} - ${end}`
  }

  return (
    <Box>
      <Heading size="md" mb={4}>
        Work Experience ({workExperience.length})
      </Heading>
      <VStack gap={4} align="stretch">
        {workExperience.map((exp) => (
          <Box
            key={exp.id}
            bg="gray.800"
            border="1px solid"
            borderColor="whiteAlpha.200"
            borderRadius="lg"
            p={4}
          >
            <VStack align="flex-start" gap={2}>
              <HStack justify="space-between" width="100%">
                <VStack align="flex-start" gap={0}>
                  <Text fontWeight="semibold" fontSize="md">
                    {exp.position}
                  </Text>
                  <Text color="gray.400" fontSize="sm">
                    {exp.company}
                  </Text>
                </VStack>
                <Text color="gray.500" fontSize="xs">
                  {formatDateRange(exp.start_date, exp.end_date)}
                </Text>
              </HStack>
              {exp.description && (
                <Text color="gray.300" fontSize="sm" mt={2}>
                  {exp.description}
                </Text>
              )}
            </VStack>
          </Box>
        ))}
      </VStack>
    </Box>
  )
}

