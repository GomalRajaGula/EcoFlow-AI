'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Text,
  useToast,
  Heading,
  Divider,
} from '@chakra-ui/react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();

  const handleSuccess = () => {
    router.push('/dashboard');
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      handleSuccess();
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast({
        title: 'Authentication Error',
        description: err.message || 'Authentication failed',
        status: 'error',
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);

    try {
      await signInWithPopup(auth, googleProvider);
      handleSuccess();
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast({
        title: 'Google Sign-In Error',
        description: err.message || 'Google sign-in failed',
        status: 'error',
        isClosable: true,
      });
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <Container maxW="sm" py={{ base: '12', md: '24' }}>
      <Stack spacing="8">
        <Stack spacing="6">
          <Heading textAlign="center" size="xl" color="#34A853">
            EcoFlow
          </Heading>
          <Text textAlign="center" fontSize="sm" color="gray.600">
            Smart Eco-Enzyme Fermentation Assistant
          </Text>
        </Stack>

        <Box
          py={{ base: '0', sm: '8' }}
          px={{ base: '4', sm: '10' }}
          bg={{ base: 'transparent', sm: 'white' }}
          boxShadow={{ base: 'none', sm: 'md' }}
          borderRadius="lg"
        >
          <Stack spacing="4">
            <Button
              type="button"
              onClick={handleGoogleSignIn}
              isLoading={googleLoading}
              bg="white"
              color="gray.800"
              borderWidth="1px"
              borderColor="gray.300"
              _hover={{ bg: 'gray.50' }}
            >
              Sign in with Google
            </Button>

            <Divider />

            <form onSubmit={handleAuth}>
              <Stack spacing="6">
                <FormControl>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </FormControl>

                <FormControl>
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </FormControl>

                <Button
                  type="submit"
                  bg="#34A853"
                  color="white"
                  isLoading={loading}
                  _hover={{ bg: '#2a8a42' }}
                >
                  {isSignUp ? 'Sign Up' : 'Sign In'}
                </Button>

                <Text textAlign="center" fontSize="sm">
                  {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                  <Button
                    variant="link"
                    color="#34A853"
                    onClick={() => setIsSignUp(!isSignUp)}
                  >
                    {isSignUp ? 'Sign In' : 'Sign Up'}
                  </Button>
                </Text>
              </Stack>
            </form>
          </Stack>
        </Box>
      </Stack>
    </Container>
  );
}
