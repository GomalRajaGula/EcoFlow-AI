'use client';

import { ChakraProvider } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { AuthProvider } from '@/lib/auth-context';
import ErrorBoundary from '@/components/ErrorBoundary';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ChakraProvider>
      <ErrorBoundary>
        <AuthProvider>{children}</AuthProvider>
      </ErrorBoundary>
    </ChakraProvider>
  );
}
