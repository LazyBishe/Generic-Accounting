import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ChakraProvider, Container } from '@chakra-ui/react'
import './index.css'
import App from './App.jsx'

function Root() {
  return (
    <StrictMode>
      <ChakraProvider>
        <App />
      </ChakraProvider>
    </StrictMode>
  )
}

createRoot(document.getElementById('root')).render(<Root />)
