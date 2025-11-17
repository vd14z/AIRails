import type { Preview } from '@storybook/react'
import { ChakraProvider } from '@chakra-ui/react'
import { theme } from '../src/theme'

const preview: Preview = {
  decorators: [
    (Story) => (
      <ChakraProvider theme={theme}>
        <Story />
      </ChakraProvider>
    ),
  ],

  tags: ['autodocs']
}

export default preview

