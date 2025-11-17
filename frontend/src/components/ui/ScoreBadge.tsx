import { Badge } from '@chakra-ui/react'
import type { ComponentProps } from 'react'

type ScoreBadgeProps = ComponentProps<typeof Badge> & {
  score: number
}

export function ScoreBadge({ score, ...rest }: ScoreBadgeProps) {
  const colorScheme = score >= 80 ? 'green' : score >= 60 ? 'yellow' : 'red'

  return (
    <Badge colorScheme={colorScheme} fontSize="0.8rem" borderRadius="full" px={3} py={1} {...rest}>
      Fit {score}%
    </Badge>
  )
}

