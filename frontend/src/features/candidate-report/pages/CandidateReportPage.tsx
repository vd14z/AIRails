import { useParams, useNavigate } from 'react-router-dom'
import {
  Box,
  VStack,
  Button,
  Spinner,
  Text,
  Heading,
  HStack,
  IconButton,
} from '@chakra-ui/react'
import { FiArrowLeft, FiRefreshCw } from 'react-icons/fi'
import { useCandidateReportQuery } from '@/services/api/hooks'
import { ReportSummary } from '../components/ReportSummary'
import { ApplicationsSection } from '../components/ApplicationsSection'
import { EducationSection } from '../components/EducationSection'
import { WorkExperienceSection } from '../components/WorkExperienceSection'
import { ResumesSection } from '../components/ResumesSection'
import { SectionHeader } from '@/components/ui/SectionHeader'
import dayjs from 'dayjs'

export function CandidateReportPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const candidateId = id ? parseInt(id, 10) : 0

  const { data: report, isLoading, error, refetch, isRefetching } = useCandidateReportQuery(
    candidateId,
    Boolean(candidateId)
  )

  if (!candidateId || isNaN(candidateId)) {
    return (
      <Box>
        <Text color="red.400">Invalid candidate ID</Text>
        <Button mt={4} onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </Box>
    )
  }

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="400px">
        <VStack gap={4}>
          <Spinner size="xl" color="brand.400" />
          <Text color="gray.400">Loading candidate report...</Text>
        </VStack>
      </Box>
    )
  }

  if (error) {
    return (
      <Box>
        <SectionHeader
          title="Error Loading Report"
          description="Failed to load candidate report. Please try again."
          rightSlot={
            <HStack gap={2}>
              <Button onClick={() => refetch()} disabled={isRefetching}>
                {isRefetching ? 'Loading...' : 'Retry'}
              </Button>
              <Button variant="outline" onClick={() => navigate(-1)}>
                Go Back
              </Button>
            </HStack>
          }
        />
        <Box bg="red.900" border="1px solid" borderColor="red.700" borderRadius="lg" p={4}>
          <Text color="red.200">
            {error instanceof Error ? error.message : 'An error occurred while loading the report'}
          </Text>
        </Box>
      </Box>
    )
  }

  if (!report) {
    return (
      <Box>
        <Text color="gray.400">No report data available</Text>
        <Button mt={4} onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </Box>
    )
  }

  return (
    <Box>
      <SectionHeader
        title={`Candidate Report: ${report.candidate.full_name}`}
        description={`Generated on ${dayjs(report.generated_at).format('MMMM DD, YYYY [at] HH:mm')}`}
        rightSlot={
          <HStack gap={2}>
            <IconButton
              aria-label="Refresh report"
              onClick={() => {
                void refetch()
              }}
              disabled={isRefetching}
              variant="outline"
            >
              <Box as={FiRefreshCw} />
            </IconButton>
            <Button onClick={() => navigate(-1)} variant="outline">
              <HStack gap={2}>
                <Box as={FiArrowLeft} />
                <Text>Back</Text>
              </HStack>
            </Button>
          </HStack>
        }
      />

      <VStack gap={8} align="stretch">
        {/* Candidate Information */}
        <Box
          bg="gray.800"
          border="1px solid"
          borderColor="whiteAlpha.200"
          borderRadius="lg"
          p={6}
        >
          <Heading size="md" mb={4}>
            Candidate Information
          </Heading>
          <VStack align="flex-start" gap={2}>
            <HStack>
              <Text fontWeight="semibold" color="gray.300">
                Email:
              </Text>
              <Text color="gray.400">{report.candidate.email}</Text>
            </HStack>
            {report.candidate.phone && (
              <HStack>
                <Text fontWeight="semibold" color="gray.300">
                  Phone:
                </Text>
                <Text color="gray.400">{report.candidate.phone}</Text>
              </HStack>
            )}
            {report.candidate.address && (
              <HStack>
                <Text fontWeight="semibold" color="gray.300">
                  Address:
                </Text>
                <Text color="gray.400">{report.candidate.address}</Text>
              </HStack>
            )}
          </VStack>
        </Box>

        {/* Summary */}
        <ReportSummary summary={report.summary} />

        {/* Applications */}
        <ApplicationsSection applications={report.applications} />

        {/* Education */}
        <EducationSection education={report.education} />

        {/* Work Experience */}
        <WorkExperienceSection workExperience={report.work_experience} />

        {/* Resumes */}
        <ResumesSection resumes={report.resumes} />
      </VStack>
    </Box>
  )
}

