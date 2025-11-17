import { Box, VStack, HStack, Text, Heading, Button, Badge } from '@chakra-ui/react'
import type { CandidateReport } from '@/services/api/types'
import { FiFile, FiDownload } from 'react-icons/fi'
import dayjs from 'dayjs'

type ResumesSectionProps = {
  resumes: CandidateReport['resumes']
}

function getFileTypeColor(fileType: string): string {
  const type = fileType.toLowerCase()
  if (type.includes('pdf')) return 'red'
  if (type.includes('doc') || type.includes('docx')) return 'blue'
  return 'gray'
}

export function ResumesSection({ resumes }: ResumesSectionProps) {
  if (resumes.length === 0) {
    return (
      <Box>
        <Heading size="md" mb={4}>
          Resumes
        </Heading>
        <Text color="gray.400">No resumes uploaded.</Text>
      </Box>
    )
  }

  const handleDownload = (filePath: string) => {
    // In a real application, this would download the file
    // For now, we'll just open it in a new tab if it's a URL
    if (filePath.startsWith('http')) {
      window.open(filePath, '_blank')
    } else {
      // If it's a relative path, construct the full URL
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
      window.open(`${apiUrl}${filePath}`, '_blank')
    }
  }

  return (
    <Box>
      <Heading size="md" mb={4}>
        Resumes ({resumes.length})
      </Heading>
      <VStack gap={3} align="stretch">
        {resumes.map((resume) => (
          <Box
            key={resume.id}
            bg="gray.800"
            border="1px solid"
            borderColor="whiteAlpha.200"
            borderRadius="lg"
            p={4}
          >
            <HStack justify="space-between" align="center">
              <HStack gap={3}>
                <Box
                  as={FiFile}
                  boxSize={6}
                  color={`${getFileTypeColor(resume.file_type)}.400`}
                  flexShrink={0}
                />
                <VStack align="flex-start" gap={0}>
                  <HStack gap={2}>
                    <Text fontWeight="semibold" fontSize="sm">
                      Resume
                    </Text>
                    <Badge colorScheme={getFileTypeColor(resume.file_type)} fontSize="xs" px={2} py={0.5}>
                      {resume.file_type.toUpperCase()}
                    </Badge>
                  </HStack>
                  <Text color="gray.400" fontSize="xs">
                    Uploaded: {dayjs(resume.upload_date).format('MMM DD, YYYY')}
                  </Text>
                </VStack>
              </HStack>
              <Button
                size="sm"
                onClick={() => handleDownload(resume.file_path)}
                variant="outline"
              >
                <HStack gap={2}>
                  <Box as={FiDownload} />
                  <Text>Download</Text>
                </HStack>
              </Button>
            </HStack>
          </Box>
        ))}
      </VStack>
    </Box>
  )
}

