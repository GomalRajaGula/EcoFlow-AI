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
  Text,
  Spinner,
  Center,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
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
  caution_logs: number;
  failed_logs: number;
  total_logs: number;
  users_with_logs: number;
  engagement: {
    log_adoption_percentage: number;
    recommendation_adoption_percentage: number;
    roadmap_adoption_percentage: number;
    average_logs_per_user: number;
  };
}

interface ModelMetrics {
  precision: number;
  recall: number;
  f1_score: number;
  total_predictions: number;
  uptime_percentage: number;
  average_inference_time_ms: number;
}

interface CommunityTrend {
  date: string;
  logs: number;
  normal: number;
  success_rate_percentage: number;
}

interface ProductTemplate {
  id: number;
  name: string;
  description: string;
  processing_instructions: string;
  ingredients: string[];
  equipment: string[];
  time_estimate_hours: number;
  safety_warnings: string;
  base_compatibility_score: number;
}

export default function AdminPage() {
  const [stats, setStats] = useState<CommunityStats | null>(null);
  const [metrics, setMetrics] = useState<ModelMetrics | null>(null);
  const [trends, setTrends] = useState<CommunityTrend[]>([]);
  const [templates, setTemplates] = useState<ProductTemplate[]>([]);
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [templateInstructions, setTemplateInstructions] = useState('');
  const [templateSafety, setTemplateSafety] = useState('');
  const [savingTemplate, setSavingTemplate] = useState(false);
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
        const [statsRes, metricsRes, trendsRes, templatesRes] = await Promise.all([
          apiClient.get('/api/v1/admin/community-stats'),
          apiClient.get('/api/v1/admin/model-metrics'),
          apiClient.get('/api/v1/admin/community-trends?days=30'),
          apiClient.get('/api/v1/admin/product-templates'),
        ]);
        setStats(statsRes.data.data);
        setMetrics(metricsRes.data.data);
        setTrends(trendsRes.data.data.trends || []);
        setTemplates(templatesRes.data.data.templates || []);
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

  const handleCreateTemplate = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!templateName.trim() || !templateDescription.trim() || !templateInstructions.trim() || !templateSafety.trim()) return;
    try {
      setSavingTemplate(true);
      const response = await apiClient.post('/api/v1/admin/product-templates', {
        name: templateName.trim(),
        description: templateDescription.trim(),
        processing_instructions: templateInstructions.trim(),
        ingredients: [],
        equipment: [],
        time_estimate_hours: 1,
        safety_warnings: templateSafety.trim(),
        base_compatibility_score: 0.5,
      });
      const created = templates.find((template) => template.id === response.data.data.id);
      if (!created) {
        setTemplates((current) => [...current, {
          id: response.data.data.id,
          name: templateName.trim(),
          description: templateDescription.trim(),
          processing_instructions: templateInstructions.trim(),
          ingredients: [],
          equipment: [],
          time_estimate_hours: 1,
          safety_warnings: templateSafety.trim(),
          base_compatibility_score: 0.5,
        }]);
      }
      setTemplateName('');
      setTemplateDescription('');
      setTemplateInstructions('');
      setTemplateSafety('');
      toast({ title: 'Berhasil', description: 'Template produk dibuat', status: 'success', isClosable: true });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { detail?: string } } };
      toast({ title: 'Gagal', description: err.response?.data?.detail || 'Template tidak dapat dibuat', status: 'error', isClosable: true });
    } finally {
      setSavingTemplate(false);
    }
  };

  const handleDeleteTemplate = async (templateId: number) => {
    try {
      await apiClient.delete(`/api/v1/admin/product-templates/${templateId}`);
      setTemplates((current) => current.filter((template) => template.id !== templateId));
      toast({ title: 'Berhasil', description: 'Template produk dihapus', status: 'success', isClosable: true });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { detail?: string } } };
      toast({ title: 'Gagal', description: err.response?.data?.detail || 'Template tidak dapat dihapus', status: 'error', isClosable: true });
    }
  };

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

        {stats && (
          <Box>
            <Heading size="md" mb={4}>
              Engagement Komunitas
            </Heading>
            <Grid templateColumns="repeat(auto-fit, minmax(220px, 1fr))" gap={4}>
              <Box borderWidth="1px" borderRadius="lg" p={6} bg="white">
                <Stat>
                  <StatLabel>Adopsi Catatan</StatLabel>
                  <StatNumber color="#34A853">{stats.engagement.log_adoption_percentage.toFixed(1)}%</StatNumber>
                  <StatHelpText>{stats.users_with_logs} pengguna aktif mencatat</StatHelpText>
                </Stat>
              </Box>
              <Box borderWidth="1px" borderRadius="lg" p={6} bg="white">
                <Stat>
                  <StatLabel>Adopsi Rekomendasi</StatLabel>
                  <StatNumber color="#34A853">{stats.engagement.recommendation_adoption_percentage.toFixed(1)}%</StatNumber>
                  <StatHelpText>Pengguna memakai rekomendasi</StatHelpText>
                </Stat>
              </Box>
              <Box borderWidth="1px" borderRadius="lg" p={6} bg="white">
                <Stat>
                  <StatLabel>Adopsi Roadmap</StatLabel>
                  <StatNumber color="#34A853">{stats.engagement.roadmap_adoption_percentage.toFixed(1)}%</StatNumber>
                  <StatHelpText>Pengguna memulai roadmap</StatHelpText>
                </Stat>
              </Box>
              <Box borderWidth="1px" borderRadius="lg" p={6} bg="white">
                <Stat>
                  <StatLabel>Rata-rata Catatan</StatLabel>
                  <StatNumber color="#34A853">{stats.engagement.average_logs_per_user.toFixed(1)}</StatNumber>
                  <StatHelpText>Catatan per pengguna aktif</StatHelpText>
                </Stat>
              </Box>
            </Grid>
          </Box>
        )}

        {trends.length > 0 && (
          <Box>
            <Heading size="md" mb={4}>
              Tren Aktivitas 30 Hari
            </Heading>
            <Box borderWidth="1px" borderRadius="lg" p={6} bg="white" overflowX="auto">
              <Box minW="640px">
                <Box display="flex" alignItems="end" gap={1} h="180px" aria-label="Grafik tren catatan fermentasi">
                  {trends.map((trend) => {
                    const maxLogs = Math.max(...trends.map((item) => item.logs), 1);
                    const height = Math.max((trend.logs / maxLogs) * 100, trend.logs > 0 ? 4 : 1);
                    return (
                      <Box key={trend.date} flex="1" minW="3px" title={`${trend.date}: ${trend.logs} catatan`}>
                        <Box h={`${height}%`} bg="green.400" borderRadius="sm" minH="2px" />
                      </Box>
                    );
                  })}
                </Box>
                <Box display="flex" justifyContent="space-between" mt={2} fontSize="xs" color="gray.500">
                  <Text>{trends[0].date}</Text>
                  <Text>{trends[trends.length - 1].date}</Text>
                </Box>
              </Box>
            </Box>
          </Box>
        )}

        <Box>
          <Heading size="md" mb={4}>
            Manajemen Template Produk
          </Heading>
          <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={6}>
            <Box as="form" onSubmit={handleCreateTemplate} borderWidth="1px" borderRadius="lg" p={6} bg="white">
              <Stack spacing={4}>
                <FormControl isRequired>
                  <FormLabel htmlFor="template-name">Nama Template</FormLabel>
                  <Input id="template-name" value={templateName} onChange={(event) => setTemplateName(event.target.value)} maxLength={120} />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel htmlFor="template-description">Deskripsi</FormLabel>
                  <Textarea id="template-description" value={templateDescription} onChange={(event) => setTemplateDescription(event.target.value)} maxLength={2000} />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel htmlFor="template-instructions">Instruksi Pemrosesan</FormLabel>
                  <Textarea id="template-instructions" value={templateInstructions} onChange={(event) => setTemplateInstructions(event.target.value)} maxLength={5000} />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel htmlFor="template-safety">Peringatan Keamanan</FormLabel>
                  <Textarea id="template-safety" value={templateSafety} onChange={(event) => setTemplateSafety(event.target.value)} maxLength={2000} />
                </FormControl>
                <Button type="submit" colorScheme="green" isLoading={savingTemplate}>Tambah Template</Button>
              </Stack>
            </Box>
            <Stack spacing={3}>
              {templates.map((template) => (
                <Box key={template.id} borderWidth="1px" borderRadius="lg" p={4} bg="white">
                  <Box display="flex" justifyContent="space-between" gap={4} alignItems="start">
                    <Box>
                      <Heading size="sm">{template.name}</Heading>
                      <Text fontSize="sm" color="gray.600" mt={1}>{template.description}</Text>
                    </Box>
                    <Button type="button" size="sm" colorScheme="red" variant="outline" onClick={() => handleDeleteTemplate(template.id)}>Hapus</Button>
                  </Box>
                </Box>
              ))}
              {!templates.length && <Text color="gray.500">Belum ada template produk.</Text>}
            </Stack>
          </Grid>
        </Box>

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
