import { Box, Heading, Text, Badge, HStack, Icon } from '@chakra-ui/react'
import type { ComponentProps } from 'react'
import { FiZap } from 'react-icons/fi'

type AiInsightCardProps = ComponentProps<typeof Box> & {
  title: string
  description: string
  confidence: number
  action?: string
}

export function AiInsightCard({ title, description, confidence, action, ...rest }: AiInsightCardProps) {
  return (
    <Box bg="gray.900" border="1px solid" borderColor="whiteAlpha.200" borderRadius="lg" p={6} {...rest}>
        <HStack spacing={2} mb={3}>
          <Icon as={FiZap} color="yellow.400" />
          <Badge colorScheme="yellow" borderRadius="full" px={3} py={1} fontSize="xs">
            IA Insight
          </Badge>
        </HStack>
        <Heading size="sm" mb={2}>
          {title}
        </Heading>
        <Text color="gray.300" fontSize="sm" mb={3}>
          {description}
        </Text>
        <Text fontSize="sm" color="gray.500">
          Confianza: {confidence}%
        </Text>
        {action ? (
          <Text fontSize="sm" color="brand.200" mt={2}>
            Acción sugerida: {action}
          </Text>
        ) : null}
    </Box>
  )
}

