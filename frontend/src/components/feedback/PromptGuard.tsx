import { Box, HStack, Text, Icon } from '@chakra-ui/react'
import { FiAlertTriangle } from 'react-icons/fi'
import { useState } from 'react'

type PromptGuardProps = {
  onToggle?: (enabled: boolean) => void
}

export function PromptGuard({ onToggle }: PromptGuardProps) {
  const [enabled, setEnabled] = useState(true)

  const handleChange = () => {
    setEnabled((prev) => {
      const next = !prev
      onToggle?.(next)
      return next
    })
  }

  return (
    <Box
      borderRadius="md"
      bg="yellow.900"
      border="1px solid"
      borderColor="yellow.300"
      p={4}
      display="flex"
      alignItems="center"
      gap={3}
    >
      <Icon as={FiAlertTriangle} boxSize={5} color="yellow.400" />
      <Box flex="1">
        <Text fontSize="sm" fontWeight="semibold" mb={1}>
          Guardrails activos
        </Text>
        <Text fontSize="sm" color="gray.300">
          Sanitizamos entradas y salidas para evitar sesgos, datos sensibles o fuga de secretos.
        </Text>
      </Box>
      <HStack ml="auto" spacing={3}>
        <Text fontSize="sm">On/Off</Text>
        <Box
          as="button"
          type="button"
          role="switch"
          aria-checked={enabled}
          onClick={handleChange}
          w="44px"
          h="24px"
          borderRadius="full"
          bg={enabled ? 'yellow.400' : 'gray.600'}
          position="relative"
          transition="background-color 0.2s"
          _focus={{ outline: '2px solid', outlineColor: 'yellow.500', outlineOffset: '2px' }}
        >
          <Box
            as="span"
            position="absolute"
            top="2px"
            left={enabled ? '22px' : '2px'}
            w="20px"
            h="20px"
            borderRadius="full"
            bg="white"
            transition="left 0.2s"
          />
        </Box>
      </HStack>
    </Box>
  )
}

