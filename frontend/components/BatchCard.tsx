'use client';

import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Stack,
  Text,
  Button,
  Badge,
  Divider,
  HStack,
  Progress,
} from '@chakra-ui/react';
import { formatDistanceToNow, parseISO } from 'date-fns';

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

interface BatchCardProps {
  batch: Batch;
  onLogClick?: () => void;
  onRecommendationClick?: () => void;
  onAnalysisClick?: () => void;
  isCompleted?: boolean;
}

export default function BatchCard({ batch, onLogClick, onRecommendationClick, onAnalysisClick, isCompleted }: BatchCardProps) {
  const startDate = parseISO(batch.start_date);
  const harvestDate = parseISO(batch.harvest_date);
  const now = new Date();
  const totalDays = Math.floor((harvestDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const elapsedDays = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const progressPercent = Math.min((elapsedDays / totalDays) * 100, 100);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_progress':
        return 'blue';
      case 'completed':
        return 'green';
      case 'failed':
        return 'red';
      default:
        return 'gray';
    }
  };

  const getStatusLabel = (status: string) => {
    return status.replace(/_/g, ' ').toUpperCase();
  };

  return (
    <Card borderLeft="4px" borderLeftColor="#34A853">
      <CardHeader>
        <HStack justifyContent="space-between">
          <Stack spacing={1}>
            <Heading size="md">{batch.name}</Heading>
            <Text fontSize="sm" color="gray.600">
              Started {formatDistanceToNow(startDate, { addSuffix: true })}
            </Text>
          </Stack>
          <Badge colorScheme={getStatusColor(batch.status)}>
            {getStatusLabel(batch.status)}
          </Badge>
        </HStack>
      </CardHeader>

      <Divider />

      <CardBody>
        <Stack spacing={4}>
          <Box>
            <HStack justifyContent="space-between" mb={2}>
              <Text fontSize="sm" fontWeight="medium">
                Fermentation Progress
              </Text>
              <Text fontSize="sm" color="gray.600">
                Day {Math.max(0, elapsedDays)} of {totalDays}
              </Text>
            </HStack>
            <Progress value={progressPercent} colorScheme="green" size="sm" />
          </Box>

          <Stack spacing={2} fontSize="sm">
            <HStack justifyContent="space-between">
              <Text color="gray.600">Waste Input:</Text>
              <Text fontWeight="medium">{batch.waste_weight_kg} kg</Text>
            </HStack>
            <HStack justifyContent="space-between">
              <Text color="gray.600">Water Required:</Text>
              <Text fontWeight="medium">{batch.water_liters} L</Text>
            </HStack>
            <HStack justifyContent="space-between">
              <Text color="gray.600">Sugar Required:</Text>
              <Text fontWeight="medium">{batch.sugar_kg} kg</Text>
            </HStack>
            <HStack justifyContent="space-between">
              <Text color="gray.600">Expected Harvest:</Text>
              <Text fontWeight="medium">
                {formatDistanceToNow(harvestDate, { addSuffix: true })}
              </Text>
            </HStack>
          </Stack>

          {!isCompleted && batch.status !== 'failed' && (
            <Stack spacing={2}>
              <Button
                mt={4}
                bg="#34A853"
                color="white"
                size="sm"
                onClick={onLogClick}
                _hover={{ bg: '#2a8a42' }}
              >
                Add Fermentation Log
              </Button>
              <Button
                bg="blue.500"
                color="white"
                size="sm"
                onClick={onRecommendationClick}
                _hover={{ bg: 'blue.600' }}
              >
                Get Product Recommendations
              </Button>
              <Button
                bg="purple.500"
                color="white"
                size="sm"
                onClick={onAnalysisClick}
                _hover={{ bg: 'purple.600' }}
              >
                Business Analysis
              </Button>
            </Stack>
          )}
        </Stack>
      </CardBody>
    </Card>
  );
}
