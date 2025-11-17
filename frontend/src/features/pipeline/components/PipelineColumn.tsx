import { Box, Heading } from '@chakra-ui/react'
import { CandidateCard } from './CandidateCard'

type ColumnCandidate = {
  id: number
  name: string
  score: number
  step: string
  lastInteraction?: string
}

type PipelineColumnProps = {
  title: string
  candidates: ColumnCandidate[]
}

export function PipelineColumn({ title, candidates }: PipelineColumnProps) {
  return (
    <Box flex="1" minW="250px">
      <Heading size="sm" mb={3} color="gray.300">
        {title}
      </Heading>
      {candidates.length === 0 ? (
        <Box
          border="1px dashed"
          borderColor="whiteAlpha.300"
          borderRadius="md"
          p={4}
          color="gray.500"
          fontSize="sm"
        >
          Sin candidatos en esta etapa
        </Box>
      ) : (
        candidates.map((candidate) => (
          <CandidateCard
            key={candidate.id}
            name={candidate.name}
            score={candidate.score}
            step={candidate.step}
            lastInteraction={candidate.lastInteraction}
            candidateId={candidate.id}
          />
        ))
      )}
    </Box>
  )
}

