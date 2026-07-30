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
  Checkbox,
  Textarea,
  NumberInput,
  NumberInputField,
  Box,
  Text,
  VStack,
  HStack,
  Badge,
  Image,
  Icon,
  IconButton
} from '@chakra-ui/react';
import { useState, useCallback, useRef } from 'react';
import { FiUpload, FiX } from 'react-icons/fi';
import apiClient from '@/lib/api';

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

interface FermentationLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  batch: Batch;
  onSuccess: () => void;
}

export default function FermentationLogModal({
  isOpen,
  onClose,
  batch,
  onSuccess,
}: FermentationLogModalProps) {
  const getTodayDate = () => new Date().toISOString().split('T')[0];
  
  const [logDate, setLogDate] = useState(getTodayDate());
  const [aroma, setAroma] = useState('sweet');
  const [color, setColor] = useState('brown');
  const [gasPresence, setGasPresence] = useState(false);
  const [temperature, setTemperature] = useState('25');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<Record<string, unknown> | null>(null);
  
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toast = useToast();

  const resetForm = useCallback(() => {
    setLogDate(getTodayDate());
    setAroma('sweet');
    setColor('brown');
    setGasPresence(false);
    setTemperature('25');
    setNotes('');
    setPrediction(null);
    setSelectedImage(null);
    setImagePreviewUrl(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'Image too large',
          description: 'Please select an image smaller than 5MB',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      
      setSelectedImage(file);
      setImagePreviewUrl(URL.createObjectURL(file));
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setImagePreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!selectedImage) return null;
    
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedImage);
      
      const response = await apiClient.post('/api/v1/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data.data.url;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Upload Failed',
        description: 'Failed to upload the image. Proceeding with log creation without image.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!logDate || !temperature) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        status: 'error',
        isClosable: true,
      });
      return;
    }

    try {
      setLoading(true);
      
      let uploadedImageUrl = null;
      if (selectedImage) {
        uploadedImageUrl = await uploadImage();
      }

      const response = await apiClient.post(
        `/api/v1/batches/${batch.id}/logs`,
        {
          log_date: new Date(logDate).toISOString(),
          aroma,
          color,
          gas_presence: gasPresence,
          temperature_c: parseFloat(temperature),
          notes,
          image_url: uploadedImageUrl || undefined
        }
      );

      setPrediction(response.data.data);

      toast({
        title: 'Success',
        description: 'Fermentation log recorded',
        status: 'success',
        isClosable: true,
      });

      setTimeout(() => {
        resetForm();
        onSuccess();
        onClose();
      }, 1500);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { detail?: string } } };
      toast({
        title: 'Error',
        description: err.response?.data?.detail || 'Failed to create log',
        status: 'error',
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={() => { resetForm(); onClose(); }} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Log Fermentation Progress - {batch.name}</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit}>
          <ModalBody>
            <Stack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Log Date</FormLabel>
                <Input
                  type="date"
                  value={logDate}
                  onChange={(e) => setLogDate(e.target.value)}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Aroma</FormLabel>
                <Select value={aroma} onChange={(e) => setAroma(e.target.value)}>
                  <option value="sweet">Sweet</option>
                  <option value="sour">Sour</option>
                  <option value="fruity">Fruity</option>
                  <option value="slightly_rotten">Slightly Rotten</option>
                  <option value="strongly_rotten">Strongly Rotten</option>
                  <option value="moldy">Moldy</option>
                  <option value="unusual">Unusual</option>
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Color</FormLabel>
                <Select value={color} onChange={(e) => setColor(e.target.value)}>
                  <option value="brown">Brown</option>
                  <option value="dark_brown">Dark Brown</option>
                  <option value="light_brown">Light Brown</option>
                  <option value="amber">Amber</option>
                  <option value="gold">Gold</option>
                  <option value="honey">Honey</option>
                  <option value="unexpected_shift">Unexpected Shift</option>
                  <option value="black">Black</option>
                  <option value="green">Green</option>
                  <option value="white_mold">White Mold</option>
                </Select>
              </FormControl>

              <FormControl display="flex" alignItems="center">
                <Checkbox
                  isChecked={gasPresence}
                  onChange={(e) => setGasPresence(e.target.checked)}
                >
                  Gas Bubbles Present
                </Checkbox>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Temperature (°C)</FormLabel>
                <NumberInput value={temperature} onChange={setTemperature}>
                  <NumberInputField />
                </NumberInput>
              </FormControl>
              
              <FormControl>
                <FormLabel>Observation Photo</FormLabel>
                <Box
                  border="2px dashed"
                  borderColor="gray.300"
                  borderRadius="md"
                  p={4}
                  textAlign="center"
                  cursor="pointer"
                  onClick={() => !imagePreviewUrl && fileInputRef.current?.click()}
                  _hover={!imagePreviewUrl ? { borderColor: 'green.400', bg: 'gray.50' } : {}}
                  position="relative"
                  transition="all 0.2s"
                >
                  <Input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    display="none"
                    onChange={handleImageChange}
                  />
                  
                  {imagePreviewUrl ? (
                    <Box position="relative">
                      <Image 
                        src={imagePreviewUrl} 
                        alt="Preview" 
                        maxH="200px" 
                        mx="auto" 
                        borderRadius="md" 
                      />
                      <IconButton
                        aria-label="Remove image"
                        icon={<FiX />}
                        size="sm"
                        colorScheme="red"
                        position="absolute"
                        top={-2}
                        right={-2}
                        borderRadius="full"
                        onClick={(e) => {
                          e.stopPropagation();
                          clearImage();
                        }}
                      />
                    </Box>
                  ) : (
                    <VStack spacing={2} color="gray.500">
                      <Icon as={FiUpload} boxSize={6} />
                      <Text>Click to upload a photo</Text>
                      <Text fontSize="xs">PNG, JPG up to 5MB</Text>
                    </VStack>
                  )}
                </Box>
              </FormControl>

              <FormControl>
                <FormLabel>Notes</FormLabel>
                <Textarea
                  placeholder="Any additional observations..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </FormControl>

              {prediction && (
                <Box p={4} bg="blue.50" borderRadius="md" borderLeft="4px" borderLeftColor="blue.400">
                  <VStack align="start" spacing={2}>
                     <HStack>
                       <Text fontWeight="bold">Status:</Text>
                       <Badge colorScheme={
                         String(prediction.ai_status_prediction) === 'Normal' ? 'green' :
                         String(prediction.ai_status_prediction) === 'Caution' ? 'orange' :
                         'red'
                       }>
                         {String(prediction.ai_status_prediction)}
                       </Badge>
                     </HStack>
                     <HStack>
                       <Text fontWeight="bold">Confidence:</Text>
                       <Text>{(Number(prediction.ai_confidence_score) * 100).toFixed(0)}%</Text>
                     </HStack>
                     <HStack>
                       <Text fontWeight="bold">Health Score:</Text>
                       <Text>{Number(prediction.health_score)}/100</Text>
                     </HStack>
                     <Box>
                       <Text fontWeight="bold" mb={1}>Suggestion:</Text>
                       <Text fontSize="sm">{String(prediction.corrective_action_suggestion)}</Text>
                     </Box>
                     {Boolean(prediction.harvest_alert_triggered) && (
                       <Badge colorScheme="purple" mt={2}>
                         🌾 Harvest Ready Alert!
                       </Badge>
                     )}
                  </VStack>
                </Box>
              )}
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose} isDisabled={loading || isUploading}>
              Cancel
            </Button>
            <Button
              type="submit"
              bg="#34A853"
              color="white"
              isLoading={loading || isUploading}
              loadingText={isUploading ? "Uploading..." : "Recording..."}
              _hover={{ bg: '#2a8a42' }}
            >
              Record Log
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
