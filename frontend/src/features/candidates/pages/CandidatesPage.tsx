import { useState } from 'react'
import {
  Box,
  SimpleGrid,
} from '@chakra-ui/react'
import { useCandidatesQuery } from '@/services/api/hooks'
import type { CandidateFilters } from '@/services/api/types'
import { CandidateFilters as CandidateFiltersComponent } from '../components/CandidateFilters'
import { CandidateList } from '../components/CandidateList'
import { SectionHeader } from '@/components/ui/SectionHeader'

export function CandidatesPage() {
  const [filters, setFilters] = useState<CandidateFilters>({
    page: 1,
    limit: 10,
    sort: 'first_name',
    order: 'asc',
  })

  const { data, isLoading, error } = useCandidatesQuery(filters)

  const handleFiltersChange = (newFilters: CandidateFilters) => {
    setFilters(newFilters)
  }

  const handleReset = () => {
    setFilters({
      page: 1,
      limit: 10,
      sort: 'first_name',
      order: 'asc',
    })
  }

  const handlePageChange = (page: number) => {
    setFilters({
      ...filters,
      page,
    })
  }

  return (
    <Box>
      <SectionHeader
        title="Candidate Search"
        description="Search and filter candidates using advanced criteria"
      />

      <SimpleGrid columns={{ base: 1, lg: 4 }} gap={6} mt={6}>
        {/* Filters Sidebar */}
        <Box>
          <CandidateFiltersComponent
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onReset={handleReset}
          />
        </Box>

        {/* Candidate List */}
        <Box gridColumn={{ base: 1, lg: '2 / -1' }}>
          <CandidateList
            candidates={data?.data || []}
            isLoading={isLoading}
            error={error}
            pagination={data?.metadata}
            onPageChange={handlePageChange}
          />
        </Box>
      </SimpleGrid>
    </Box>
  )
}

