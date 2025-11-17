import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Badge,
  Button,
  Icon,
} from '@chakra-ui/react'
import { useState } from 'react'
import { FiChevronDown, FiChevronUp } from 'react-icons/fi'
import type { CandidateReport } from '@/services/api/types'
import dayjs from 'dayjs'

type ApplicationsSectionProps = {
  applications: CandidateReport['applications']
}

function getStatusColor(status: string): string {
  const statusColors: Record<string, string> = {
    Open: 'green',
    Closed: 'gray',
    'In Progress': 'blue',
    Cancelled: 'red',
  }
  return statusColors[status] || 'gray'
}

export function ApplicationsSection({ applications }: ApplicationsSectionProps) {
  const [expandedInterviews, setExpandedInterviews] = useState<Set<number>>(new Set())

  const toggleInterviewHistory = (applicationId: number) => {
    const newExpanded = new Set(expandedInterviews)
    if (newExpanded.has(applicationId)) {
      newExpanded.delete(applicationId)
    } else {
      newExpanded.add(applicationId)
    }
    setExpandedInterviews(newExpanded)
  }

  if (applications.length === 0) {
    return (
      <Box>
        <Heading size="md" mb={4}>
          Applications
        </Heading>
        <Text color="gray.400">No applications found.</Text>
      </Box>
    )
  }

  return (
    <Box>
      <Heading size="md" mb={4}>
        Applications ({applications.length})
      </Heading>
      <VStack gap={4} align="stretch">
        {applications.map((application) => {
          const isExpanded = expandedInterviews.has(application.id)
          return (
            <Box
              key={application.id}
              bg="gray.800"
              border="1px solid"
              borderColor="whiteAlpha.200"
              borderRadius="lg"
              p={4}
            >
              <HStack justify="space-between" align="flex-start" mb={3}>
                <VStack align="flex-start" gap={1}>
                  <Heading size="sm">{application.position.title}</Heading>
                  <Text fontSize="sm" color="gray.400">
                    {application.position.company} • {application.position.location}
                  </Text>
                  <HStack gap={2} mt={2}>
                    <Badge colorScheme={getStatusColor(application.position.status)}>
                      {application.position.status}
                    </Badge>
                    <Badge colorScheme="purple" bg="purple.900" color="purple.200">
                      Score: {application.average_score}%
                    </Badge>
                  </HStack>
                </VStack>
              </HStack>

              <HStack gap={4} fontSize="sm" color="gray.400" mb={3}>
                <Text>
                  Applied: {dayjs(application.application_date).format('MMM DD, YYYY')}
                </Text>
                <Text>Step: {application.interview_step_name}</Text>
              </HStack>

              {application.interviews.length > 0 && (
                <Box>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleInterviewHistory(application.id)}
                    px={0}
                    py={2}
                    mb={isExpanded ? 2 : 0}
                  >
                    <HStack gap={2}>
                      <Icon as={isExpanded ? FiChevronUp : FiChevronDown} />
                      <Text fontSize="sm" fontWeight="semibold">
                        Interview History ({application.interviews.length})
                      </Text>
                    </HStack>
                  </Button>
                  {isExpanded && (
                    <VStack gap={3} align="stretch" mt={2}>
                      {application.interviews.map((interview) => (
                        <Box
                          key={interview.id}
                          bg="gray.900"
                          border="1px solid"
                          borderColor="whiteAlpha.100"
                          borderRadius="md"
                          p={3}
                        >
                          <HStack justify="space-between" mb={2}>
                            <Text fontSize="sm" fontWeight="semibold">
                              {interview.interview_step}
                            </Text>
                            {interview.score !== undefined && (
                              <Badge colorScheme="blue">{interview.score}%</Badge>
                            )}
                          </HStack>
                          <VStack align="flex-start" gap={1} fontSize="xs" color="gray.400">
                            <Text>
                              Date: {dayjs(interview.interview_date).format('MMM DD, YYYY')}
                            </Text>
                            <Text>Interviewer: {interview.employee}</Text>
                            {interview.result && <Text>Result: {interview.result}</Text>}
                            {interview.notes && (
                              <Text mt={1} color="gray.300">
                                Notes: {interview.notes}
                              </Text>
                            )}
                          </VStack>
                        </Box>
                      ))}
                    </VStack>
                  )}
                </Box>
              )}
            </Box>
          )
        })}
      </VStack>
    </Box>
  )
}
