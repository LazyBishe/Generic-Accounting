import { Box, Heading, Button, Container } from '@chakra-ui/react'

export default function App() {
  return (
    <Container maxW="4xl" py={8}>
      <Box p={6} bg="blue.50" borderRadius="lg">
        <Heading>🗓️ Test App</Heading>
        <Button colorScheme="blue" mt={4}>Click Me</Button>
      </Box>
    </Container>
  )
}
