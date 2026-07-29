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
  NumberInput,
  NumberInputField,
} from '@chakra-ui/react';
import { useState } from 'react';
import apiClient from '@/lib/api';

interface CreateBatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateBatchModal({ isOpen, onClose, onSuccess }: CreateBatchModalProps) {
  const [name, setName] = useState('');
  const [wasteWeight, setWasteWeight] = useState('');
  const [startDate, setStartDate] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !wasteWeight || !startDate) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all fields',
        status: 'error',
        isClosable: true,
      });
      return;
    }

    try {
      setLoading(true);
      const response = await apiClient.post('/api/v1/batches', {
        name,
        waste_weight_kg: parseFloat(wasteWeight),
        start_date: new Date(startDate).toISOString(),
      });

      toast({
        title: 'Success',
        description: `Water: ${response.data.data.calculated_water_liters}L, Sugar: ${response.data.data.calculated_sugar_kg}kg`,
        status: 'success',
        isClosable: true,
        duration: 5,
      });

      setName('');
      setWasteWeight('');
      setStartDate('');
      onSuccess();
      onClose();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { detail?: string } } };
      toast({
        title: 'Error',
        description: err.response?.data?.detail || 'Failed to create batch',
        status: 'error',
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create New Batch</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit}>
          <ModalBody>
            <Stack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Batch Name</FormLabel>
                <Input
                  placeholder="e.g., Kitchen Waste Batch 1"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Waste Weight (kg)</FormLabel>
                <NumberInput value={wasteWeight} onChange={setWasteWeight}>
                  <NumberInputField placeholder="e.g., 10" />
                </NumberInput>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Start Date</FormLabel>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </FormControl>
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              bg="#34A853"
              color="white"
              isLoading={loading}
              _hover={{ bg: '#2a8a42' }}
            >
              Create Batch
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
