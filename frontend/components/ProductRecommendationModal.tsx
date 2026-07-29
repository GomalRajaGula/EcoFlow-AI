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
    <Modal isOpen={isOpen} onClose={handleClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Product Recommendations</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit}>
          <ModalBody>
            <Stack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Harvest Volume (Liters)</FormLabel>
                <Input
                  type="number"
                  placeholder="e.g., 5.5"
                  value={harvestVolume}
                  onChange={(e) => setHarvestVolume(e.target.value)}
                  step="0.1"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Final Color</FormLabel>
                <Select value={finalColor} onChange={(e) => setFinalColor(e.target.value)}>
                  <option value="light_brown">Light Brown</option>
                  <option value="dark_brown">Dark Brown</option>
                  <option value="amber">Amber</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Aroma Intensity</FormLabel>
                <Select value={aromaIntensity} onChange={(e) => setAromaIntensity(e.target.value)}>
                  <option value="mild">Mild</option>
                  <option value="medium">Medium</option>
                  <option value="strong">Strong</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Intent</FormLabel>
                <Select value={userIntent} onChange={(e) => setUserIntent(e.target.value)}>
                  <option value="household">Household Use</option>
                  <option value="commercial">Commercial</option>
                </Select>
              </FormControl>

              {recommendations && (
                <Box borderTop="1px" borderColor="gray.200" pt={4}>
                  <Text fontWeight="bold" mb={3}>
                    Recommended Products:
                  </Text>
                  <VStack spacing={3} align="start">
                    {recommendations.map((rec: Record<string, unknown>, idx: number) => (
                      <Box key={idx} w="100%" p={3} borderRadius="md" bg="gray.50">
                        <HStack justifyContent="space-between" mb={2}>
                          <Text fontWeight="medium">{String(rec.name)}</Text>
                          <Badge colorScheme="green">#{idx + 1}</Badge>
                        </HStack>
                        <Text fontSize="sm" color="gray.600">
                          Score: {Number(rec.compatibility_score).toFixed(2)}
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
            <Button variant="ghost" mr={3} onClick={handleClose}>
              {recommendations ? 'Close' : 'Cancel'}
            </Button>
            {!recommendations && (
              <Button
                type="submit"
                bg="#34A853"
                color="white"
                isLoading={loading}
                _hover={{ bg: '#2a8a42' }}
              >
                Get Recommendations
              </Button>
            )}
            {recommendations && (
              <Button
                bg="#34A853"
                color="white"
                onClick={() => {
                  onSuccess();
                  handleClose();
                }}
                _hover={{ bg: '#2a8a42' }}
              >
                Continue to Analysis
              </Button>
            )}
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
