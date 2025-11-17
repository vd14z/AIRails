import { render, screen } from '@testing-library/react'
import { ChakraProvider } from '@chakra-ui/react'
import { CandidateCard } from './CandidateCard'
import { theme } from '@/theme'

const renderWithChakra = (ui: React.ReactElement) =>
  render(<ChakraProvider theme={theme}>{ui}</ChakraProvider>)

describe('CandidateCard', () => {
  it('renders candidate info', () => {
    renderWithChakra(
      <CandidateCard name="Alice" score={90} step="Screening" lastInteraction="Hoy" />,
    )

    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText(/Fit 90%/i)).toBeInTheDocument()
  })
})

