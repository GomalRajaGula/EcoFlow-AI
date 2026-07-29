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
  Divider,
} from '@chakra-ui/react';
import { useState } from 'react';
import apiClient from '@/lib/api';

interface BusinessAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  batchId: number;
  onSuccess: () => void;
}

export default function BusinessAnalysisModal({
  isOpen,
  onClose,
  batchId,
  onSuccess,
}: BusinessAnalysisModalProps) {
  const [productName, setProductName] = useState('');
  const [productionVolume, setProductionVolume] = useState('');
  const [targetMarket, setTargetMarket] = useState('local');
  const [packagingType, setPackagingType] = useState('bottle');
  const [distributionChannel, setDistributionChannel] = useState('direct');
  const [rawMaterialCost, setRawMaterialCost] = useState('');
  const [packagingCost, setPackagingCost] = useState('');
  const [laborCost, setLaborCost] = useState('');
  const [overheadCost, setOverheadCost] = useState('');
  const [monthlyFixedCosts, setMonthlyFixedCosts] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<Record<string, unknown> | null>(null);
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !productName ||
      !productionVolume ||
      !rawMaterialCost ||
      !packagingCost ||
      !laborCost ||
      !overheadCost ||
      !monthlyFixedCosts
    ) {
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
      const response = await apiClient.post(
        `/api/v1/batches/${batchId}/business-analysis`,
        {
          product_name: productName,
          production_volume_liters: parseFloat(productionVolume),
          target_market: targetMarket,
          packaging_type: packagingType,
          distribution_channel: distributionChannel,
          raw_material_cost: parseFloat(rawMaterialCost),
          packaging_cost: parseFloat(packagingCost),
          labor_cost: parseFloat(laborCost),
          overhead_cost: parseFloat(overheadCost),
          monthly_fixed_costs: parseFloat(monthlyFixedCosts),
        }
      );

      setAnalysis(response.data.data);
      toast({
        title: 'Success',
        description: 'Business analysis completed',
        status: 'success',
        isClosable: true,
      });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { detail?: string } } };
      toast({
        title: 'Error',
        description: err.response?.data?.detail || 'Failed to run analysis',
        status: 'error',
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setProductName('');
    setProductionVolume('');
    setTargetMarket('local');
    setPackagingType('bottle');
    setDistributionChannel('direct');
    setRawMaterialCost('');
    setPackagingCost('');
    setLaborCost('');
    setOverheadCost('');
    setMonthlyFixedCosts('');
    setAnalysis(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg">
      <ModalOverlay />
      <ModalContent maxH="90vh" overflowY="auto">
        <ModalHeader>Business Analysis</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit}>
          <ModalBody>
            <Stack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Product Name</FormLabel>
                <Input
                  placeholder="e.g., Eco-Enzyme Cleaner"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Production Volume (Liters)</FormLabel>
                <Input
                  type="number"
                  placeholder="e.g., 100"
                  value={productionVolume}
                  onChange={(e) => setProductionVolume(e.target.value)}
                  step="0.1"
                />
              </FormControl>

              <HStack spacing={4}>
                <FormControl>
                  <FormLabel>Target Market</FormLabel>
                  <Select value={targetMarket} onChange={(e) => setTargetMarket(e.target.value)}>
                    <option value="local">Local</option>
                    <option value="regional">Regional</option>
                    <option value="national">National</option>
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>Packaging Type</FormLabel>
                  <Select value={packagingType} onChange={(e) => setPackagingType(e.target.value)}>
                    <option value="bottle">Bottle</option>
                    <option value="container">Container</option>
                    <option value="bulk">Bulk</option>
                  </Select>
                </FormControl>
              </HStack>

              <FormControl>
                <FormLabel>Distribution Channel</FormLabel>
                <Select value={distributionChannel} onChange={(e) => setDistributionChannel(e.target.value)}>
                  <option value="direct">Direct Sales</option>
                  <option value="retail">Retail</option>
                  <option value="online">Online</option>
                  <option value="wholesale">Wholesale</option>
                </Select>
              </FormControl>

              <Divider />

              <VStack align="start" spacing={3}>
                <Text fontWeight="bold">Cost Structure</Text>
                <HStack w="100%" spacing={2}>
                  <FormControl isRequired>
                    <FormLabel fontSize="sm">Raw Material ($)</FormLabel>
                    <Input
                      type="number"
                      placeholder="0"
                      value={rawMaterialCost}
                      onChange={(e) => setRawMaterialCost(e.target.value)}
                      step="0.01"
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel fontSize="sm">Packaging ($)</FormLabel>
                    <Input
                      type="number"
                      placeholder="0"
                      value={packagingCost}
                      onChange={(e) => setPackagingCost(e.target.value)}
                      step="0.01"
                    />
                  </FormControl>
                </HStack>

                <HStack w="100%" spacing={2}>
                  <FormControl isRequired>
                    <FormLabel fontSize="sm">Labor ($)</FormLabel>
                    <Input
                      type="number"
                      placeholder="0"
                      value={laborCost}
                      onChange={(e) => setLaborCost(e.target.value)}
                      step="0.01"
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel fontSize="sm">Overhead ($)</FormLabel>
                    <Input
                      type="number"
                      placeholder="0"
                      value={overheadCost}
                      onChange={(e) => setOverheadCost(e.target.value)}
                      step="0.01"
                    />
                  </FormControl>
                </HStack>

                <FormControl isRequired w="50%">
                  <FormLabel fontSize="sm">Monthly Fixed Costs ($)</FormLabel>
                  <Input
                    type="number"
                    placeholder="0"
                    value={monthlyFixedCosts}
                    onChange={(e) => setMonthlyFixedCosts(e.target.value)}
                    step="0.01"
                  />
                </FormControl>
              </VStack>

              {analysis && (
                <Box borderTop="1px" borderColor="gray.200" pt={4}>
                  <Text fontWeight="bold" mb={3}>
                    Analysis Results:
                  </Text>
                  <VStack spacing={2} align="start" fontSize="sm">
                    <HStack justifyContent="space-between" w="100%">
                      <Text color="gray.600">COGS per Liter:</Text>
                      <Text fontWeight="medium">${typeof analysis.cogs_per_liter === 'number' ? analysis.cogs_per_liter.toFixed(2) : 'N/A'}</Text>
                    </HStack>
                    <HStack justifyContent="space-between" w="100%">
                      <Text color="gray.600">Suggested Retail Price:</Text>
                      <Text fontWeight="medium">${typeof analysis.suggested_retail_price === 'number' ? analysis.suggested_retail_price.toFixed(2) : 'N/A'}</Text>
                    </HStack>
                    <HStack justifyContent="space-between" w="100%">
                      <Text color="gray.600">Gross Margin:</Text>
                      <Text fontWeight="medium" color="green.600">
                        {typeof analysis.gross_margin_percentage === 'number' ? analysis.gross_margin_percentage.toFixed(1) : 'N/A'}%
                      </Text>
                    </HStack>
                    <HStack justifyContent="space-between" w="100%">
                      <Text color="gray.600">Break-even (Liters):</Text>
                      <Text fontWeight="medium">{Math.ceil(typeof analysis.break_even_units_liters === 'number' ? analysis.break_even_units_liters : 0)}</Text>
                    </HStack>
                    <HStack justifyContent="space-between" w="100%">
                      <Text color="gray.600">Yearly Net Profit:</Text>
                      <Text fontWeight="medium" color="blue.600">
                        ${typeof analysis.yearly_net_profit === 'number' ? analysis.yearly_net_profit.toFixed(2) : 'N/A'}
                      </Text>
                    </HStack>
                    <HStack justifyContent="space-between" w="100%">
                      <Text color="gray.600">Viability:</Text>
                      <Text fontWeight="bold" color={analysis.viability_rating === 'Viable' ? 'green.600' : analysis.viability_rating === 'Marginal' ? 'orange.500' : 'red.500'}>
                        {String(analysis.viability_rating || 'N/A')}
                      </Text>
                    </HStack>
                  </VStack>
                </Box>
              )}
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={handleClose}>
              {analysis ? 'Close' : 'Cancel'}
            </Button>
            {!analysis && (
              <Button
                type="submit"
                bg="#34A853"
                color="white"
                isLoading={loading}
                _hover={{ bg: '#2a8a42' }}
              >
                Run Analysis
              </Button>
            )}
            {analysis && (
              <Button
                bg="#34A853"
                color="white"
                onClick={() => {
                  onSuccess();
                  handleClose();
                }}
                _hover={{ bg: '#2a8a42' }}
              >
                Done
              </Button>
            )}
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
