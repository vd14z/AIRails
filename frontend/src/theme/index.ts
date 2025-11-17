// En Chakra UI v3, usamos createSystem y defaultConfig
import { createSystem, defaultConfig } from '@chakra-ui/react'

export const system = createSystem(defaultConfig, {
  theme: {
    tokens: {
      colors: {
        brand: {
          50: { value: '#f1f5ff' },
          100: { value: '#dbe4ff' },
          200: { value: '#bac9ff' },
          300: { value: '#94a9ff' },
          400: { value: '#6f88ff' },
          500: { value: '#4a68ff' },
          600: { value: '#364fdb' },
          700: { value: '#2639a8' },
          800: { value: '#182575' },
          900: { value: '#0b1347' },
        },
      },
    },
  },
  globalCss: {
    body: {
      bg: 'gray.900',
      color: 'gray.100',
    },
  },
})

