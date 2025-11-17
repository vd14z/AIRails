import { Box, Heading, Text, Flex, Icon } from '@chakra-ui/react'
import type { ComponentProps } from 'react'
import type { ComponentType } from 'react'

type StatCardProps = ComponentProps<typeof Box> & {
  label: string
  value: string
  delta?: string
  icon?: ComponentType<{ size?: string | number; color?: string }>
}

export function StatCard({ label, value, delta, icon: IconComponent, ...rest }: StatCardProps) {
  return (
    <Box bg="gray.900" border="1px solid" borderColor="whiteAlpha.200" borderRadius="lg" p={6} {...rest}>
        <Flex align="center" justify="space-between">
          <div>
            <Text textTransform="uppercase" fontSize="xs" color="gray.500" letterSpacing="wide">
              {label}
            </Text>
            <Heading size="lg" mt={2}>
              {value}
            </Heading>
            {delta ? (
              <Text fontSize="sm" color="green.300" mt={1}>
                {delta}
              </Text>
            ) : null}
          </div>
          {IconComponent ? <Icon as={IconComponent} boxSize={8} color="brand.400" /> : null}
        </Flex>
    </Box>
  )
}

