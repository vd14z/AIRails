import type { CandidateFilters } from './types'

export const queryKeys = {
  candidates: (filters?: CandidateFilters) => ['candidates', filters] as const,
  positions: ['positions'] as const,
  pipeline: (positionId: number) => ['pipeline', positionId] as const,
  candidateReport: (candidateId: number) => ['candidate-report', candidateId] as const,
  generateReport: (candidateId: number) => ['generate-report', candidateId] as const,
}

