import { useMutation, useQuery } from '@tanstack/react-query'
import { apiClient } from './client'
import type { Candidate, PipelineCandidate, Position, CandidateReport, GenerateReportResponse, CandidateFilters } from './types'
import { queryKeys } from './queryKeys'

type PaginatedResponse<T> = {
  data: T[]
  metadata: {
    total: number
    page: number
    limit: number
    total_pages: number
  }
}

export const useCandidatesQuery = (filters?: CandidateFilters) =>
  useQuery({
    queryKey: queryKeys.candidates(filters),
    queryFn: async () => {
      const params: Record<string, string> = {}
      if (filters?.search) params.search = filters.search
      if (filters?.with_education) params.with_education = 'true'
      if (filters?.experienced) params.experienced = 'true'
      if (filters?.skill) params.skill = filters.skill
      if (filters?.recent_applications) params.recent_applications = 'true'
      if (filters?.page) params.page = filters.page.toString()
      if (filters?.limit) params.limit = filters.limit.toString()
      if (filters?.sort) params.sort = filters.sort
      if (filters?.order) params.order = filters.order

      const response = await apiClient.get<PaginatedResponse<Candidate>>('/candidates', {
        params,
      })
      return response.data
    },
  })

export const usePositionsQuery = () =>
  useQuery({
    queryKey: queryKeys.positions,
    queryFn: async () => {
      const response = await apiClient.get<Position[]>('/positions')
      return response.data
    },
  })

export const usePipelineQuery = (positionId?: number) =>
  useQuery({
    enabled: Boolean(positionId),
    queryKey: queryKeys.pipeline(positionId ?? 0),
    queryFn: async () => {
      const response = await apiClient.get<PipelineCandidate[]>(`/positions/${positionId}/candidates`)
      return response.data
    },
  })

export const useJobDescriptionMutation = () =>
  useMutation({
    mutationFn: async (payload: { role: string; seniority: string; requirements: string }) => {
      const response = await apiClient.post('/ai/job-descriptions', payload)
      return response.data
    },
  })

export const useGenerateReportMutation = () =>
  useMutation({
    mutationFn: async (candidateId: number) => {
      const response = await apiClient.post<GenerateReportResponse>(
        `/candidates/${candidateId}/generate_report`
      )
      return response.data
    },
  })

export const useCandidateReportQuery = (candidateId: number, enabled = true) =>
  useQuery({
    queryKey: queryKeys.candidateReport(candidateId),
    queryFn: async () => {
      const response = await apiClient.get<CandidateReport>(
        `/candidates/${candidateId}/report`
      )
      return response.data
    },
    enabled: enabled && Boolean(candidateId),
  })

