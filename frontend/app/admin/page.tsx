'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Heading,
  Stack,
  Box,
  Grid,
  GridItem,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Spinner,
  Center,
  Button,
  useToast,
} from '@chakra-ui/react';
import { useAuth } from '@/lib/auth-context';
import apiClient from '@/lib/api';

interface CommunityStats {
  total_users: number;
  total_batches: number;
  total_waste_processed_kg: number;
  success_rate_percentage: number;
  normal_logs: number;
  failed_logs: number;
}

interface ModelMetrics {
  precision: number;
  recall: number;
  f1_score: number;
  total_predictions: number;
  uptime_percentage: number;
  average_inference_time_ms: number;
}

export default function AdminPage() {
  const [stats, setStats] = useState<CommunityStats | null>(null);
  const [metrics, setMetrics] = useState<ModelMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push('/login');
      return;
    }

    const loadAdminData = async () => {
      try {
        setLoading(true);
        const [statsRes, metricsRes] = await Promise.all([
          apiClient.get('/api/v1/admin/community-stats'),
          apiClient.get('/api/v1/admin/model-metrics'),
        ]);
        setStats(statsRes.data.data);
        setMetrics(metricsRes.data.data);
      } catch (error: unknown) {
        const err = error as { response?: { data?: { detail?: string } } };
        toast({
          title: 'Error',
          description: err.response?.data?.detail || 'Failed to load admin data',
          status: 'error',
          isClosable: true,
        });
        router.push('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    loadAdminData();
  }, [user, authLoading, router, toast]);

  if (authLoading || loading) {
    return (
      <Center minH="100vh">
        <Spinner color="#34A853" size="xl" />
      </Center>
    );
  }

  return (
    <Container maxW="7xl" py={8}>
      <Stack spacing={8}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Heading size="lg" color="#34A853">
            Admin Dashboard
          </Heading>
          <Button variant="outline" onClick={() => router.push('/dashboard')}>
            Back to Dashboard
          </Button>
        </Box>

        {stats && (
          <Box>
            <Heading size="md" mb={4}>
              Community Statistics
            </Heading>
            <Grid templateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={4}>
              <GridItem>
                <Box borderWidth="1px" borderRadius="lg" p={6} bg="white">
                  <Stat>
                    <StatLabel>Total Users</StatLabel>
                    <StatNumber color="#34A853">{stats.total_users}</StatNumber>
                    <StatHelpText>Active community members</StatHelpText>
                  </Stat>
                </Box>
              </GridItem>

              <GridItem>
                <Box borderWidth="1px" borderRadius="lg" p={6} bg="white">
                  <Stat>
                    <StatLabel>Total Batches</StatLabel>
                    <StatNumber color="#34A853">{stats.total_batches}</StatNumber>
                    <StatHelpText>Fermentation batches created</StatHelpText>
                  </Stat>
                </Box>
              </GridItem>

              <GridItem>
                <Box borderWidth="1px" borderRadius="lg" p={6} bg="white">
                  <Stat>
                    <StatLabel>Waste Processed</StatLabel>
                    <StatNumber color="#34A853">{stats.total_waste_processed_kg.toFixed(2)}</StatNumber>
                    <StatHelpText>kg of organic waste</StatHelpText>
                  </Stat>
                </Box>
              </GridItem>

              <GridItem>
                <Box borderWidth="1px" borderRadius="lg" p={6} bg="white">
                  <Stat>
                    <StatLabel>Success Rate</StatLabel>
                    <StatNumber color={stats.success_rate_percentage >= 80 ? '#34A853' : '#ED8936'}>
                      {stats.success_rate_percentage.toFixed(1)}%
                    </StatNumber>
                    <StatHelpText>Fermentation success</StatHelpText>
                  </Stat>
                </Box>
              </GridItem>

              <GridItem>
                <Box borderWidth="1px" borderRadius="lg" p={6} bg="white">
                  <Stat>
                    <StatLabel>Normal Logs</StatLabel>
                    <StatNumber color="green.600">{stats.normal_logs}</StatNumber>
                    <StatHelpText>Healthy fermentations</StatHelpText>
                  </Stat>
                </Box>
              </GridItem>

              <GridItem>
                <Box borderWidth="1px" borderRadius="lg" p={6} bg="white">
                  <Stat>
                    <StatLabel>Failed Logs</StatLabel>
                    <StatNumber color="red.600">{stats.failed_logs}</StatNumber>
                    <StatHelpText>Issues detected</StatHelpText>
                  </Stat>
                </Box>
              </GridItem>
            </Grid>
          </Box>
        )}

        {metrics && (
          <Box>
            <Heading size="md" mb={4}>
              AI Model Metrics
            </Heading>
            <Grid templateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={4}>
              <GridItem>
                <Box borderWidth="1px" borderRadius="lg" p={6} bg="white">
                  <Stat>
                    <StatLabel>Precision</StatLabel>
                    <StatNumber color="#34A853">{(metrics.precision * 100).toFixed(1)}%</StatNumber>
                    <StatHelpText>Model accuracy</StatHelpText>
                  </Stat>
                </Box>
              </GridItem>

              <GridItem>
                <Box borderWidth="1px" borderRadius="lg" p={6} bg="white">
                  <Stat>
                    <StatLabel>Recall</StatLabel>
                    <StatNumber color="#34A853">{(metrics.recall * 100).toFixed(1)}%</StatNumber>
                    <StatHelpText>Detection sensitivity</StatHelpText>
                  </Stat>
                </Box>
              </GridItem>

              <GridItem>
                <Box borderWidth="1px" borderRadius="lg" p={6} bg="white">
                  <Stat>
                    <StatLabel>F1 Score</StatLabel>
                    <StatNumber color="#34A853">{(metrics.f1_score * 100).toFixed(1)}%</StatNumber>
                    <StatHelpText>Overall performance</StatHelpText>
                  </Stat>
                </Box>
              </GridItem>

              <GridItem>
                <Box borderWidth="1px" borderRadius="lg" p={6} bg="white">
                  <Stat>
                    <StatLabel>Total Predictions</StatLabel>
                    <StatNumber color="#34A853">{metrics.total_predictions.toLocaleString()}</StatNumber>
                    <StatHelpText>AI inferences made</StatHelpText>
                  </Stat>
                </Box>
              </GridItem>

              <GridItem>
                <Box borderWidth="1px" borderRadius="lg" p={6} bg="white">
                  <Stat>
                    <StatLabel>Uptime</StatLabel>
                    <StatNumber color="#34A853">{metrics.uptime_percentage.toFixed(1)}%</StatNumber>
                    <StatHelpText>System availability</StatHelpText>
                  </Stat>
                </Box>
              </GridItem>

              <GridItem>
                <Box borderWidth="1px" borderRadius="lg" p={6} bg="white">
                  <Stat>
                    <StatLabel>Avg Inference</StatLabel>
                    <StatNumber color="#34A853">{metrics.average_inference_time_ms}</StatNumber>
                    <StatHelpText>milliseconds</StatHelpText>
                  </Stat>
                </Box>
              </GridItem>
            </Grid>
          </Box>
        )}
      </Stack>
    </Container>
  );
}
