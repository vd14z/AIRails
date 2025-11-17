import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ChakraProvider } from '@chakra-ui/react'
import App from './App'
import './index.css'
import { QueryProvider } from './providers/QueryProvider'
import { system } from './theme'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ChakraProvider value={system} defaultColorMode="dark">
        <QueryProvider>
          <App />
        </QueryProvider>
      </ChakraProvider>
    </BrowserRouter>
  </StrictMode>,
)
