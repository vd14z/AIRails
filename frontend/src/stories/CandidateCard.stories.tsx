import type { Meta, StoryObj } from '@storybook/react'
import { CandidateCard } from '@/features/pipeline/components/CandidateCard'

const meta: Meta<typeof CandidateCard> = {
  title: 'Pipeline/CandidateCard',
  component: CandidateCard,
}

export default meta

type Story = StoryObj<typeof CandidateCard>

export const Default: Story = {
  args: {
    name: 'Alice Johnson',
    score: 88,
    step: 'Entrevista técnica',
    lastInteraction: 'Hace 1 día',
  },
}

