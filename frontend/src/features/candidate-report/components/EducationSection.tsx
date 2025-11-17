import { Box, VStack, Text, Heading } from '@chakra-ui/react'
import type { CandidateReport } from '@/services/api/types'
import dayjs from 'dayjs'

type EducationSectionProps = {
  education: CandidateReport['education']
}

export function EducationSection({ education }: EducationSectionProps) {
  if (education.length === 0) {
    return (
      <Box>
        <Heading size="md" mb={4}>
          Education
        </Heading>
        <Text color="gray.400">No education records found.</Text>
      </Box>
    )
  }

  const formatDateRange = (startDate: string, endDate?: string) => {
    const start = dayjs(startDate).format('YYYY')
    const end = endDate ? dayjs(endDate).format('YYYY') : 'Present'
    return `${start} - ${end}`
  }

  return (
    <Box>
      <Heading size="md" mb={4}>
        Education ({education.length})
      </Heading>
      <VStack gap={4} align="stretch">
        {education.map((edu) => (
          <Box
            key={edu.id}
            bg="gray.800"
            border="1px solid"
            borderColor="whiteAlpha.200"
            borderRadius="lg"
            p={4}
          >
            <VStack align="flex-start" gap={1}>
              <Text fontWeight="semibold" fontSize="md">
                {edu.title}
              </Text>
              <Text color="gray.400" fontSize="sm">
                {edu.institution}
              </Text>
              <Text color="gray.500" fontSize="xs" mt={1}>
                {formatDateRange(edu.start_date, edu.end_date)}
              </Text>
            </VStack>
          </Box>
        ))}
      </VStack>
    </Box>
  )
}

