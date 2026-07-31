'use client';

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  useToast,
  Select,
  VStack,
  HStack,
  Box,
  Text,
  Badge,
} from '@chakra-ui/react';
import { useState } from 'react';
import apiClient from '@/lib/api';

interface ProductRecommendationModalProps {
  isOpen: boolean;
  onClose: () => void;
  batchId: number;
  onSuccess: () => void;
}

export default function ProductRecommendationModal({
  isOpen,
  onClose,
  batchId,
  onSuccess,
}: ProductRecommendationModalProps) {
  const [harvestVolume, setHarvestVolume] = useState('');
  const [finalColor, setFinalColor] = useState('dark_brown');
  const [aromaIntensity, setAromaIntensity] = useState('medium');
  const [userIntent, setUserIntent] = useState('household');
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<Array<Record<string, unknown>> | null>(null);
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!harvestVolume) {
      toast({
        title: 'Validation Error',
        description: 'Please enter harvest volume',
        status: 'error',
        isClosable: true,
      });
      return;
    }

    try {
      setLoading(true);
      const response = await apiClient.post(
        `/api/v1/batches/${batchId}/recommendation`,
        {
          harvest_date: new Date().toISOString(),
          harvest_volume_liters: parseFloat(harvestVolume),
          final_color: finalColor,
          aroma_intensity: aromaIntensity,
          user_intent: userIntent,
        }
      );

      setRecommendations(response.data.data.recommendations);
      toast({
        title: 'Success',
        description: 'Product recommendations generated',
        status: 'success',
        isClosable: true,
      });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { detail?: string } } };
      toast({
        title: 'Error',
        description: err.response?.data?.detail || 'Failed to get recommendations',
        status: 'error',
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setHarvestVolume('');
    setFinalColor('dark_brown');
    setAromaIntensity('medium');
    setUserIntent('household');
    setRecommendations(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg" isCentered>
      <ModalOverlay />
      <ModalContent w={{ base: 'calc(100% - 2rem)', md: '100%' }}>
        <ModalHeader id="product-recommendations-title">Rekomendasi Produk</ModalHeader>
        <ModalCloseButton aria-label="Tutup dialog rekomendasi produk" />
        <form onSubmit={handleSubmit} aria-label="Form rekomendasi produk">
          <ModalBody>
            <Stack spacing={4}>
              <FormControl isRequired>
                <FormLabel htmlFor="harvest-volume">Volume Panen (Liter)</FormLabel>
                <Input
                  id="harvest-volume"
                  name="harvestVolume"
                  type="number"
                  min={0.1}
                  step="0.1"
                  placeholder="Misal, 5.5"
                  value={harvestVolume}
                  onChange={(e) => setHarvestVolume(e.target.value)}
                />
              </FormControl>

              <FormControl>
                <FormLabel htmlFor="final-color">Warna Akhir</FormLabel>
                <Select id="final-color" name="finalColor" value={finalColor} onChange={(e) => setFinalColor(e.target.value)}>
                  <option value="light_brown">Cokelat Muda</option>
                  <option value="dark_brown">Cokelat Gelap</option>
                  <option value="amber">Amber</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel htmlFor="aroma-intensity">Intensitas Aroma</FormLabel>
                <Select id="aroma-intensity" name="aromaIntensity" value={aromaIntensity} onChange={(e) => setAromaIntensity(e.target.value)}>
                  <option value="mild">Ringan</option>
                  <option value="medium">Sedang</option>
                  <option value="strong">Kuat</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel htmlFor="user-intent">Tujuan Penggunaan</FormLabel>
                <Select id="user-intent" name="userIntent" value={userIntent} onChange={(e) => setUserIntent(e.target.value)}>
                  <option value="household">Penggunaan Rumah Tangga</option>
                  <option value="commercial">Komersial</option>
                </Select>
              </FormControl>

              {recommendations && (
                <Box borderTop="1px" borderColor="gray.200" pt={4}>
                  <Text fontWeight="bold" mb={3}>
                    Produk yang Direkomendasikan:
                  </Text>
                  <VStack spacing={3} align="start">
                    {recommendations.map((rec: Record<string, unknown>, idx: number) => (
                      <Box key={idx} w="100%" p={3} borderRadius="md" bg="gray.50">
                        <HStack justifyContent="space-between" mb={2}>
                          <Text fontWeight="medium">{String(rec.name)}</Text>
                          <Badge colorScheme="green">#{idx + 1}</Badge>
                        </HStack>
                        <Text fontSize="sm" color="gray.600">
                          Skor kecocokan: {Number(rec.compatibility_score).toFixed(2)}
                        </Text>
                        {Boolean(rec.processing_instruction_summary) && (
                          <Text fontSize="sm" mt={2} color="gray.700">
                            {String(rec.processing_instruction_summary)}
                          </Text>
                        )}
                      </Box>
                    ))}
                  </VStack>
                </Box>
              )}
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button type="button" variant="ghost" mr={3} onClick={handleClose}>
              {recommendations ? 'Tutup' : 'Batal'}
            </Button>
            {!recommendations && (
              <Button
                type="submit"
                bg="#34A853"
                color="white"
                isLoading={loading}
                _hover={{ bg: '#2a8a42' }}
              >
                Dapatkan Rekomendasi
              </Button>
            )}
            {recommendations && (
              <Button
                type="button"
                bg="#34A853"
                color="white"
                onClick={() => {
                  onSuccess();
                  handleClose();
                }}
                _hover={{ bg: '#2a8a42' }}
              >
                Lanjut ke Analisis
              </Button>
            )}
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
