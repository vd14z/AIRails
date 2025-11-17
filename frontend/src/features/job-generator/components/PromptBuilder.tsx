import {
  Box,
  Button,
  HStack,
  Input,
  Textarea,
  Wrap,
  WrapItem,
  Tag,
  VStack,
  Text,
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'

const jobSchema = z.object({
  role: z.string().min(3),
  seniority: z.string(),
  requirements: z.string().min(10),
})

export type JobFormValues = z.infer<typeof jobSchema>

const suggestionTags = ['Kubernetes', 'Data Privacy', 'GenAI', 'Compliance', 'FinOps']

type PromptBuilderProps = {
  onSubmit: (values: JobFormValues) => void
  isLoading?: boolean
}

export function PromptBuilder({ onSubmit, isLoading }: PromptBuilderProps) {
  const [requirements, setRequirements] = useState('')
  const { register, handleSubmit, setValue, watch } = useForm<JobFormValues>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      role: 'Senior Ruby Engineer',
      seniority: 'Senior',
      requirements: '',
    },
  })

  const currentRequirements = watch('requirements')

  const appendRequirement = (tag: string) => {
    const nextValue = currentRequirements ? `${currentRequirements}, ${tag}` : tag
    setRequirements(nextValue)
    setValue('requirements', nextValue)
  }

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)}>
      <VStack align="flex-start" spacing={1} mb={4}>
        <Text fontSize="sm" fontWeight="medium">
          Rol buscado
        </Text>
        <Input placeholder="Ej. Staff Platform Engineer" {...register('role')} w="100%" />
      </VStack>
      <HStack spacing={4} mb={4} align="flex-end">
        <VStack align="flex-start" spacing={1} flex="1">
          <Text fontSize="sm" fontWeight="medium">
            Seniority
          </Text>
          <Box
            as="select"
            {...register('seniority')}
            w="100%"
            p={2}
            borderRadius="md"
            border="1px solid"
            borderColor="whiteAlpha.200"
            bg="gray.900"
            color="gray.100"
            _focus={{ borderColor: 'brand.500', outline: 'none' }}
          >
            <option value="Junior">Junior</option>
            <option value="Semi-Senior">Semi Senior</option>
            <option value="Senior">Senior</option>
            <option value="Staff">Staff</option>
          </Box>
        </VStack>
        <VStack align="flex-start" spacing={1} flex="1">
          <Text fontSize="sm" fontWeight="medium">
            Ubicación preferida
          </Text>
          <Input placeholder="Remoto, Madrid, Latam..." w="100%" />
        </VStack>
      </HStack>
      <VStack align="flex-start" spacing={1} mb={4}>
        <Text fontSize="sm" fontWeight="medium">
          Requerimientos clave
        </Text>
        <Textarea
          rows={4}
          placeholder="Microservicios, liderazgo técnico, MLOps..."
          value={requirements}
          {...register('requirements')}
          onChange={(event) => {
            setRequirements(event.target.value)
          }}
          w="100%"
        />
      </VStack>
      <Wrap spacing={2} mb={6}>
        {suggestionTags.map((tag) => (
          <WrapItem key={tag}>
            <Tag
              borderRadius="full"
              px={3}
              py={1}
              cursor="pointer"
              onClick={() => appendRequirement(tag)}
            >
              {tag}
            </Tag>
          </WrapItem>
        ))}
      </Wrap>
      <Button colorScheme="brand" type="submit" isLoading={isLoading}>
        Generar descripción con IA
      </Button>
    </Box>
  )
}

