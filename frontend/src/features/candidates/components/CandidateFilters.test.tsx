import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter } from 'react-router-dom'
import { CandidateFilters } from './CandidateFilters'
import { system } from '@/theme'
import type { CandidateFilters as CandidateFiltersType } from '@/services/api/types'

const renderWithProviders = (ui: React.ReactElement) =>
  render(
    <BrowserRouter>
      <ChakraProvider value={system} defaultColorMode="dark">
        {ui}
      </ChakraProvider>
    </BrowserRouter>
  )

describe('CandidateFilters', () => {
  const mockFilters: CandidateFiltersType = {
    page: 1,
    limit: 10,
    sort: 'first_name',
    order: 'asc',
  }

  const mockOnFiltersChange = () => {}
  const mockOnReset = () => {}

  it('renders all filter controls', () => {
    renderWithProviders(
      <CandidateFilters
        filters={mockFilters}
        onFiltersChange={mockOnFiltersChange}
        onReset={mockOnReset}
      />
    )

    expect(screen.getByPlaceholderText(/search by name or email/i)).toBeInTheDocument()
    expect(screen.getByText(/with education/i)).toBeInTheDocument()
    expect(screen.getByText(/experienced/i)).toBeInTheDocument()
    expect(screen.getByText(/recent applications/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/filter by skill/i)).toBeInTheDocument()
    expect(screen.getByText(/reset/i)).toBeInTheDocument()
  })

  it('updates search input when text is entered', async () => {
    const user = userEvent.setup()
    let updatedFilters: CandidateFiltersType | undefined
    const handleChange = (filters: CandidateFiltersType) => {
      updatedFilters = filters
    }

    renderWithProviders(
      <CandidateFilters
        filters={mockFilters}
        onFiltersChange={handleChange}
        onReset={mockOnReset}
      />
    )

    const searchInput = screen.getByPlaceholderText(/search by name or email/i)
    await user.type(searchInput, 'John')

    expect(updatedFilters).toEqual({
      ...mockFilters,
      search: 'John',
      page: 1,
    })
  })

  it('calls onReset when reset button is clicked', async () => {
    const user = userEvent.setup()
    let resetCalled = false
    const handleReset = () => {
      resetCalled = true
    }

    renderWithProviders(
      <CandidateFilters
        filters={mockFilters}
        onFiltersChange={mockOnFiltersChange}
        onReset={handleReset}
      />
    )

    const resetButton = screen.getByText(/reset/i)
    await user.click(resetButton)

    expect(resetCalled).toBe(true)
  })

  it('updates filters when checkboxes are toggled', async () => {
    const user = userEvent.setup()
    let updatedFilters: CandidateFiltersType | undefined
    const handleChange = (filters: CandidateFiltersType) => {
      updatedFilters = filters
    }

    renderWithProviders(
      <CandidateFilters
        filters={mockFilters}
        onFiltersChange={handleChange}
        onReset={mockOnReset}
      />
    )

    const withEducationLabel = screen.getByText(/with education/i)
    await user.click(withEducationLabel)

    expect(updatedFilters).toEqual({
      ...mockFilters,
      with_education: true,
      page: 1,
    })
  })

  it('updates skill input when text is entered', async () => {
    const user = userEvent.setup()
    let updatedFilters: CandidateFiltersType | undefined
    const handleChange = (filters: CandidateFiltersType) => {
      updatedFilters = filters
    }

    renderWithProviders(
      <CandidateFilters
        filters={mockFilters}
        onFiltersChange={handleChange}
        onReset={mockOnReset}
      />
    )

    const skillInput = screen.getByPlaceholderText(/filter by skill/i)
    await user.type(skillInput, 'Ruby')

    expect(updatedFilters).toEqual({
      ...mockFilters,
      skill: 'Ruby',
      page: 1,
    })
  })
})

