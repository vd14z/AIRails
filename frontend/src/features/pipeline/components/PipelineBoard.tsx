import { HStack } from '@chakra-ui/react'
import { PipelineColumn } from './PipelineColumn'

export type PipelineStage = {
  title: string
  candidates: {
    id: number
    name: string
    score: number
    step: string
    lastInteraction?: string
  }[]
}

type PipelineBoardProps = {
  stages: PipelineStage[]
}

export function PipelineBoard({ stages }: PipelineBoardProps) {
  return (
    <HStack align="flex-start" spacing={6} overflowX="auto" py={2}>
      {stages.map((stage) => (
        <PipelineColumn key={stage.title} title={stage.title} candidates={stage.candidates} />
      ))}
    </HStack>
  )
}

