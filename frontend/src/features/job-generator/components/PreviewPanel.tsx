import { Box, Heading, Text, VStack, Button } from '@chakra-ui/react'

type PreviewPanelProps = {
  description?: string
  summary?: string
}

export function PreviewPanel({ description, summary }: PreviewPanelProps) {
  return (
    <Box border="1px solid" borderColor="whiteAlpha.200" borderRadius="lg" p={6} minH="350px">
      <Heading size="sm" mb={4}>
        Vista previa generada
      </Heading>
      {description ? (
        <VStack align="stretch" spacing={4}>
          <Text whiteSpace="pre-wrap" color="gray.200">
            {description}
          </Text>
          <Box borderTop="1px solid" borderColor="whiteAlpha.200" my={2} />
          <Text fontSize="sm" color="gray.400">
            Resumen ejecutivo:
          </Text>
          <Text color="gray.200">{summary}</Text>
        </VStack>
      ) : (
        <Text color="gray.500">Genera tu primera descripción para verla aquí.</Text>
      )}
      <Button mt={6} variant="outline" w="full" isDisabled={!description}>
        Guardar en ATS
      </Button>
    </Box>
  )
}

