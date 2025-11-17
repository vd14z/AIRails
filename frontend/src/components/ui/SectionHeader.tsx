import { Heading, HStack, Text } from '@chakra-ui/react'
import type { ComponentProps, ReactNode } from 'react'

type SectionHeaderProps = ComponentProps<typeof HStack> & {
  title: string
  description?: string
  rightSlot?: ReactNode
}

export function SectionHeader({ title, description, rightSlot, ...rest }: SectionHeaderProps) {
  return (
    <HStack justify="space-between" align={{ base: 'flex-start', md: 'center' }} mb={6} {...rest}>
      <div>
        <Heading size="md">{title}</Heading>
        {description ? (
          <Text mt={1} color="gray.400" fontSize="sm">
            {description}
          </Text>
        ) : null}
      </div>
      {rightSlot}
    </HStack>
  )
}

