import {
  Box,
  VStack,
  HStack,
  Input,
  Button,
  Text,
  Heading,
} from '@chakra-ui/react'
import type { ReactNode } from 'react'
import type { CandidateFilters } from '@/services/api/types'

type CandidateFiltersProps = {
  filters: CandidateFilters
  onFiltersChange: (filters: CandidateFilters) => void
  onReset: () => void
}

// Custom Checkbox component for Chakra UI v3
type CustomCheckboxProps = {
  isChecked: boolean
  onChange: (checked: boolean) => void
  children: ReactNode
}

function CustomCheckbox({ isChecked, onChange, children }: CustomCheckboxProps) {
  return (
    <HStack
      as="label"
      cursor="pointer"
      gap={2}
      onClick={() => onChange(!isChecked)}
    >
      <Box
        w="16px"
        h="16px"
        border="2px solid"
        borderColor={isChecked ? 'brand.400' : 'whiteAlpha.300'}
        bg={isChecked ? 'brand.400' : 'transparent'}
        borderRadius="sm"
        display="flex"
        alignItems="center"
        justifyContent="center"
        transition="all 0.2s"
        _hover={{ borderColor: 'brand.300' }}
      >
        {isChecked && (
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.33334 2.5L3.75001 7.08333L1.66667 5"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </Box>
      {children}
    </HStack>
  )
}

export function CandidateFilters({ filters, onFiltersChange, onReset }: CandidateFiltersProps) {
  const handleSearchChange = (value: string) => {
    onFiltersChange({
      ...filters,
      search: value || undefined,
      page: 1, // Reset to first page when search changes
    })
  }

  const handleCheckboxChange = (key: keyof CandidateFilters, checked: boolean) => {
    onFiltersChange({
      ...filters,
      [key]: checked || undefined,
      page: 1, // Reset to first page when filter changes
    })
  }

  const handleSkillChange = (value: string) => {
    onFiltersChange({
      ...filters,
      skill: value || undefined,
      page: 1, // Reset to first page when skill changes
    })
  }

  return (
    <Box
      bg="gray.800"
      border="1px solid"
      borderColor="whiteAlpha.200"
      borderRadius="lg"
      p={6}
    >
      <HStack justify="space-between" mb={6}>
        <Heading size="md">Filters</Heading>
        <Button size="sm" variant="outline" onClick={onReset}>
          Reset
        </Button>
      </HStack>

      <VStack gap={4} align="stretch">
        {/* Search Input */}
        <Box>
          <Text fontSize="sm" fontWeight="semibold" mb={2} color="gray.300">
            Search
          </Text>
          <Input
            placeholder="Search by name or email..."
            value={filters.search || ''}
            onChange={(e) => handleSearchChange(e.target.value)}
            bg="gray.900"
            borderColor="whiteAlpha.200"
            _hover={{ borderColor: 'whiteAlpha.300' }}
            _focus={{ borderColor: 'brand.400', boxShadow: '0 0 0 1px var(--chakra-colors-brand-400)' }}
          />
        </Box>

        {/* Boolean Filters */}
        <VStack gap={3} align="stretch">
          <Text fontSize="sm" fontWeight="semibold" color="gray.300">
            Filter Options
          </Text>

          <CustomCheckbox
            isChecked={filters.with_education || false}
            onChange={(checked) => handleCheckboxChange('with_education', checked)}
          >
            <Text fontSize="sm" color="gray.200">
              With Education
            </Text>
          </CustomCheckbox>

          <CustomCheckbox
            isChecked={filters.experienced || false}
            onChange={(checked) => handleCheckboxChange('experienced', checked)}
          >
            <Text fontSize="sm" color="gray.200">
              Experienced
            </Text>
          </CustomCheckbox>

          <CustomCheckbox
            isChecked={filters.recent_applications || false}
            onChange={(checked) => handleCheckboxChange('recent_applications', checked)}
          >
            <Text fontSize="sm" color="gray.200">
              Recent Applications
            </Text>
          </CustomCheckbox>
        </VStack>

        {/* Skill Filter */}
        <Box>
          <Text fontSize="sm" fontWeight="semibold" mb={2} color="gray.300">
            Skill
          </Text>
          <Input
            placeholder="Filter by skill (e.g., Ruby, Python)..."
            value={filters.skill || ''}
            onChange={(e) => handleSkillChange(e.target.value)}
            bg="gray.900"
            borderColor="whiteAlpha.200"
            _hover={{ borderColor: 'whiteAlpha.300' }}
            _focus={{ borderColor: 'brand.400', boxShadow: '0 0 0 1px var(--chakra-colors-brand-400)' }}
          />
          <Text fontSize="xs" color="gray.500" mt={1}>
            Searches in work experience descriptions
          </Text>
        </Box>
      </VStack>
    </Box>
  )
}

