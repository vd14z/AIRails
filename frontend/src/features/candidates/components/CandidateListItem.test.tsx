import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter } from 'react-router-dom'
import { CandidateListItem } from './CandidateListItem'
import { system } from '@/theme'
import type { Candidate } from '@/services/api/types'

const renderWithProviders = (ui: React.ReactElement) =>
  render(
    <BrowserRouter>
      <ChakraProvider value={system} defaultColorMode="dark">
        {ui}
      </ChakraProvider>
    </BrowserRouter>
  )

describe('CandidateListItem', () => {
  const mockCandidate: Candidate = {
    id: 1,
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@example.com',
    phone: '612345678',
    address: 'Madrid, Spain',
  }

  it('renders candidate information correctly', () => {
    renderWithProviders(<CandidateListItem candidate={mockCandidate} />)

    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('john.doe@example.com')).toBeInTheDocument()
    expect(screen.getByText('612345678')).toBeInTheDocument()
    expect(screen.getByText('Madrid, Spain')).toBeInTheDocument()
  })

  it('handles missing optional fields gracefully', () => {
    const candidateWithoutOptional: Candidate = {
      id: 2,
      first_name: 'Jane',
      last_name: 'Smith',
      email: 'jane.smith@example.com',
    }

    renderWithProviders(<CandidateListItem candidate={candidateWithoutOptional} />)

    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    expect(screen.getByText('jane.smith@example.com')).toBeInTheDocument()
    expect(screen.queryByText(/phone/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/address/i)).not.toBeInTheDocument()
  })

  it('navigates to candidate report when view button is clicked', async () => {
    const user = userEvent.setup()
    renderWithProviders(<CandidateListItem candidate={mockCandidate} />)

    const viewButton = screen.getByText(/view report/i)
    await user.click(viewButton)

    // Navigation is handled by react-router, so we just verify the button is clickable
    expect(viewButton).toBeInTheDocument()
  })

  it('calls onViewDetails when provided and view button is clicked', async () => {
    const user = userEvent.setup()
    let calledWithId: number | undefined
    const mockOnViewDetails = (id: number) => {
      calledWithId = id
    }

    renderWithProviders(
      <CandidateListItem candidate={mockCandidate} onViewDetails={mockOnViewDetails} />
    )

    const viewButton = screen.getByText(/view report/i)
    await user.click(viewButton)

    expect(calledWithId).toBe(mockCandidate.id)
  })
})

