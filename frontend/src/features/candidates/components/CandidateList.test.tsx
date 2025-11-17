import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ChakraProvider } from '@chakra-ui/react'
import { CandidateList } from './CandidateList'
import { system } from '@/theme'
import type { Candidate } from '@/services/api/types'

const renderWithProviders = (ui: React.ReactElement) =>
  render(
    <ChakraProvider value={system} defaultColorMode="dark">
      {ui}
    </ChakraProvider>
  )

describe('CandidateList', () => {
  const mockCandidates: Candidate[] = [
    {
      id: 1,
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
    },
    {
      id: 2,
      first_name: 'Jane',
      last_name: 'Smith',
      email: 'jane.smith@example.com',
    },
  ]

  const mockPagination = {
    total: 20,
    page: 1,
    limit: 10,
    total_pages: 2,
  }

  it('renders list of candidates', () => {
    renderWithProviders(
      <CandidateList
        candidates={mockCandidates}
        isLoading={false}
        error={null}
        pagination={mockPagination}
      />
    )

    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
  })

  it('displays loading state correctly', () => {
    renderWithProviders(
      <CandidateList
        candidates={[]}
        isLoading={true}
        error={null}
      />
    )

    expect(screen.getByText(/loading candidates/i)).toBeInTheDocument()
  })

  it('displays error state with error message', () => {
    const error = new Error('Network error')
    renderWithProviders(
      <CandidateList
        candidates={[]}
        isLoading={false}
        error={error}
      />
    )

    expect(screen.getByText(/unable to load candidates/i)).toBeInTheDocument()
    expect(screen.getByText('Network error')).toBeInTheDocument()
  })

  it('displays empty state when no candidates', () => {
    renderWithProviders(
      <CandidateList
        candidates={[]}
        isLoading={false}
        error={null}
      />
    )

    expect(screen.getByText(/no candidates found/i)).toBeInTheDocument()
    expect(screen.getByText(/try adjusting your filters/i)).toBeInTheDocument()
  })

  it('renders pagination controls when pagination data is available', () => {
    renderWithProviders(
      <CandidateList
        candidates={mockCandidates}
        isLoading={false}
        error={null}
        pagination={mockPagination}
        onPageChange={() => {}}
      />
    )

    expect(screen.getByText(/page 1 of 2/i)).toBeInTheDocument()
    expect(screen.getByText(/previous/i)).toBeInTheDocument()
    expect(screen.getByText(/next/i)).toBeInTheDocument()
  })

  it('calls onPageChange when pagination button is clicked', async () => {
    const user = userEvent.setup()
    let calledWithPage: number | undefined
    const mockOnPageChange = (page: number) => {
      calledWithPage = page
    }

    renderWithProviders(
      <CandidateList
        candidates={mockCandidates}
        isLoading={false}
        error={null}
        pagination={mockPagination}
        onPageChange={mockOnPageChange}
      />
    )

    const nextButton = screen.getByText(/next/i)
    await user.click(nextButton)

    expect(calledWithPage).toBe(2)
  })

  it('disables previous button on first page', () => {
    renderWithProviders(
      <CandidateList
        candidates={mockCandidates}
        isLoading={false}
        error={null}
        pagination={mockPagination}
        onPageChange={() => {}}
      />
    )

    const previousButton = screen.getByText(/previous/i)
    expect(previousButton).toBeDisabled()
  })

  it('disables next button on last page', () => {
    const lastPagePagination = {
      ...mockPagination,
      page: 2,
    }

    renderWithProviders(
      <CandidateList
        candidates={mockCandidates}
        isLoading={false}
        error={null}
        pagination={lastPagePagination}
        onPageChange={vi.fn()}
      />
    )

    const nextButton = screen.getByText(/next/i)
    expect(nextButton).toBeDisabled()
  })
})

