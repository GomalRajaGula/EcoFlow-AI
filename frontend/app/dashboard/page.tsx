'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Container,
  Heading,
  Stack,
  Text,
  useToast,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Spinner,
  Center,
} from '@chakra-ui/react';
import { useAuth } from '@/lib/auth-context';
import apiClient from '@/lib/api';
import CreateBatchModal from '@/components/CreateBatchModal';
import BatchCard from '@/components/BatchCard';
import FermentationLogModal from '@/components/FermentationLogModal';
import ProductRecommendationModal from '@/components/ProductRecommendationModal';
import BusinessAnalysisModal from '@/components/BusinessAnalysisModal';

interface Batch {
  id: number;
  name: string;
  status: string;
  waste_weight_kg: number;
  water_liters: number;
  sugar_kg: number;
  start_date: string;
  harvest_date: string;
  created_at: string;
}

async function loadBatches(): Promise<Batch[]> {
  const response = await apiClient.get('/api/v1/batches');
  return response.data.data.batches || [];
}

export default function DashboardPage() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loadingBatches, setLoadingBatches] = useState(true);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showLogModal, setShowLogModal] = useState(false);
  const [showRecommendationModal, setShowRecommendationModal] = useState(false);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const { user, loading: authLoading, signOut } = useAuth();
  const router = useRouter();
  const toast = useToast();
  const hasFetched = useRef(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push('/login');
      return;
    }
    if (hasFetched.current) return;
    hasFetched.current = true;

    let cancelled = false;
    loadBatches()
      .then((data) => {
        if (!cancelled) setBatches(data);
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          const err = error as { response?: { data?: { detail?: string } } };
          toast({
            title: 'Error',
            description: err.response?.data?.detail || 'Failed to fetch batches',
            status: 'error',
            isClosable: true,
          });
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingBatches(false);
      });

    return () => { cancelled = true; };
  }, [user, authLoading, router, toast]);

  const refreshBatches = async () => {
    try {
      setLoadingBatches(true);
      const data = await loadBatches();
      setBatches(data);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { detail?: string } } };
      toast({
        title: 'Error',
        description: err.response?.data?.detail || 'Failed to fetch batches',
        status: 'error',
        isClosable: true,
      });
    } finally {
      setLoadingBatches(false);
    }
  };

  const handleCreateBatch = async () => {
    await refreshBatches();
    setShowCreateModal(false);
    toast({
      title: 'Success',
      description: 'Batch created successfully',
      status: 'success',
      isClosable: true,
    });
  };

  const handleLogCreated = async () => {
    await refreshBatches();
    setShowLogModal(false);
    setSelectedBatch(null);
    toast({
      title: 'Success',
      description: 'Fermentation log recorded',
      status: 'success',
      isClosable: true,
    });
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/login');
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to sign out',
        status: 'error',
        isClosable: true,
      });
    }
  };

  const activeBatches = batches.filter(b => b.status !== 'harvested');
  const completedBatches = batches.filter(b => b.status === 'harvested');

  if (authLoading) {
    return (
      <Center minH="100vh">
        <Spinner color="#34A853" size="xl" />
      </Center>
    );
  }

  return (
    <Container maxW="6xl" py={8}>
      <Stack spacing={8}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Heading size="lg" color="#34A853">
            EcoFlow Dashboard
          </Heading>
          <Button
            colorScheme="gray"
            size="sm"
            onClick={handleSignOut}
          >
            Sign Out
          </Button>
        </Box>

        <Box>
          <Button
            bg="#34A853"
            color="white"
            onClick={() => setShowCreateModal(true)}
            _hover={{ bg: '#2a8a42' }}
          >
            Create New Batch
          </Button>
        </Box>

        {loadingBatches ? (
          <Center py={20}>
            <Spinner color="#34A853" size="lg" />
          </Center>
        ) : (
          <Tabs defaultIndex={0} colorScheme="green">
            <TabList>
              <Tab>Active Batches ({activeBatches.length})</Tab>
              <Tab>Completed ({completedBatches.length})</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                {activeBatches.length === 0 ? (
                  <Text color="gray.500" textAlign="center" py={10}>
                    No active batches. Create one to get started!
                  </Text>
                ) : (
                  <Stack spacing={4}>
                    {activeBatches.map((batch) => (
                      <BatchCard
                        key={batch.id}
                        batch={batch}
                        onLogClick={() => {
                          setSelectedBatch(batch);
                          setShowLogModal(true);
                        }}
                        onRecommendationClick={() => {
                          setSelectedBatch(batch);
                          setShowRecommendationModal(true);
                        }}
                        onAnalysisClick={() => {
                          setSelectedBatch(batch);
                          setShowAnalysisModal(true);
                        }}
                      />
                    ))}
                  </Stack>
                )}
              </TabPanel>

              <TabPanel>
                {completedBatches.length === 0 ? (
                  <Text color="gray.500" textAlign="center" py={10}>
                    No completed batches yet.
                  </Text>
                ) : (
                  <Stack spacing={4}>
                    {completedBatches.map((batch) => (
                      <BatchCard
                        key={batch.id}
                        batch={batch}
                        isCompleted={true}
                      />
                    ))}
                  </Stack>
                )}
              </TabPanel>
            </TabPanels>
          </Tabs>
        )}
      </Stack>

      <CreateBatchModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleCreateBatch}
      />

      {selectedBatch && (
        <FermentationLogModal
          isOpen={showLogModal}
          onClose={() => setShowLogModal(false)}
          batch={selectedBatch}
          onSuccess={handleLogCreated}
        />
      )}

      {selectedBatch && (
        <ProductRecommendationModal
          isOpen={showRecommendationModal}
          onClose={() => setShowRecommendationModal(false)}
          batchId={selectedBatch.id}
          onSuccess={() => {
            refreshBatches();
            setShowRecommendationModal(false);
          }}
        />
      )}

      {selectedBatch && (
        <BusinessAnalysisModal
          isOpen={showAnalysisModal}
          onClose={() => setShowAnalysisModal(false)}
          batchId={selectedBatch.id}
          onSuccess={() => {
            refreshBatches();
            setShowAnalysisModal(false);
          }}
        />
      )}
    </Container>
  );
}
