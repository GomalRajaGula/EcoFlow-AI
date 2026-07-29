'use client';

import Link from 'next/link';
import { Box, Button, Container, Heading, Text, VStack, HStack, Grid, Icon } from '@chakra-ui/react';
import { FiTrendingUp, FiCheckCircle, FiZap } from 'react-icons/fi';
import { BiBot, BiChart } from 'react-icons/bi';

export default function Home() {
  const features = [
    {
      icon: BiBot,
      title: 'AI Fermentation Assistant',
      description: 'Real-time monitoring dengan AI untuk prediksi status fermentasi (Normal, Caution, Failed)'
    },
    {
      icon: FiCheckCircle,
      title: 'Smart Product Recommendation',
      description: 'Rekomendasi produk otomatis berdasarkan karakteristik hasil fermentasi eco-enzyme'
    },
    {
      icon: BiChart,
      title: 'Business Analysis',
      description: 'Analisis kelayakan bisnis lengkap: COGS, margin profit, break-even, dan proyeksi revenue'
    },
    {
      icon: FiTrendingUp,
      title: 'Batch Management',
      description: 'Kelola seluruh siklus fermentasi dari pembuatan batch hingga panen dengan tracking detail'
    },
    {
      icon: FiZap,
      title: 'Automated Calculations',
      description: 'Perhitungan otomatis kebutuhan air & gula, estimasi panen 90 hari, dan health score'
    },
    {
      icon: BiBot,
      title: 'Smart Insights',
      description: 'Dashboard komprehensif dengan milestone tracking dan rekomendasi aksi preventif'
    }
  ];

  return (
    <Box bg="white" minH="100vh">
      <Container maxW="100%" px={0}>
        <VStack spacing={0}>
          <Box w="100%" bg="linear-gradient(135deg, #34A853 0%, #2a8a42 100%)" color="white" py={{ base: '16', md: '24' }} px={{ base: '4', md: '8' }}>
            <Container maxW="6xl" mx="auto">
              <VStack spacing={{ base: '6', md: '8' }} align="start">
                <VStack spacing={{ base: '2', md: '4' }} align="start" w="100%">
                  <Heading size="2xl" fontWeight="bold" maxW="2xl">
                    Smart Eco-Enzyme Fermentation Assistant
                  </Heading>
                  <Text fontSize={{ base: 'lg', md: 'xl' }} opacity={0.95} maxW="2xl">
                    Optimalkan proses pembuatan eco-enzyme dengan AI-powered monitoring, product recommendations, dan business analysis. Dari rumahan hingga skala komersial.
                  </Text>
                </VStack>

                <HStack spacing={{ base: '3', md: '4' }} pt={{ base: '4', md: '8' }} w={{ base: '100%', md: 'auto' }}>
                  <Link href="/login">
                    <Button
                      bg="white"
                      color="#34A853"
                      size={{ base: 'md', md: 'lg' }}
                      fontWeight="bold"
                      _hover={{ bg: 'gray.100', transform: 'translateY(-2px)' }}
                      transition="all 0.2s"
                    >
                      Mulai Sekarang
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button
                      bg="transparent"
                      color="white"
                      borderWidth="2px"
                      borderColor="white"
                      size={{ base: 'md', md: 'lg' }}
                      fontWeight="bold"
                      _hover={{ bg: 'whiteAlpha.100', transform: 'translateY(-2px)' }}
                      transition="all 0.2s"
                    >
                      Login
                    </Button>
                  </Link>
                </HStack>
              </VStack>
            </Container>
          </Box>

          <Box w="100%" py={{ base: '16', md: '24' }} px={{ base: '4', md: '8' }} bg="gray.50">
            <Container maxW="6xl" mx="auto">
              <VStack spacing={{ base: '12', md: '16' }}>
                <VStack spacing={{ base: '2', md: '4' }} textAlign="center">
                  <Heading size="xl" color="gray.900">
                    Fitur Utama EcoFlow
                  </Heading>
                  <Text fontSize="lg" color="gray.600" maxW="2xl">
                    Platform lengkap untuk mengelola fermentasi eco-enzyme dengan teknologi AI terdepan
                  </Text>
                </VStack>

                <Grid
                  templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}
                  gap={{ base: '6', md: '8' }}
                  w="100%"
                >
                  {features.map((feature, idx) => (
                    <Box
                      key={idx}
                      bg="white"
                      p={{ base: '6', md: '8' }}
                      borderRadius="lg"
                      boxShadow="sm"
                      _hover={{ boxShadow: 'md', transform: 'translateY(-4px)' }}
                      transition="all 0.3s"
                    >
                      <VStack align="start" spacing="4">
                        <Box
                          p="3"
                          bg="#E8F5E9"
                          borderRadius="lg"
                          color="#34A853"
                          fontSize="24px"
                        >
                          <Icon as={feature.icon} />
                        </Box>
                        <Heading size="md" color="gray.900">
                          {feature.title}
                        </Heading>
                        <Text fontSize="sm" color="gray.600" lineHeight="1.6">
                          {feature.description}
                        </Text>
                      </VStack>
                    </Box>
                  ))}
                </Grid>
              </VStack>
            </Container>
          </Box>

          <Box w="100%" py={{ base: '16', md: '24' }} px={{ base: '4', md: '8' }} bg="white">
            <Container maxW="6xl" mx="auto">
              <VStack spacing={{ base: '12', md: '16' }}>
                <VStack spacing={{ base: '2', md: '4' }} textAlign="center">
                  <Heading size="xl" color="gray.900">
                    Bagaimana Cara Kerjanya?
                  </Heading>
                  <Text fontSize="lg" color="gray.600" maxW="2xl">
                    4 langkah sederhana untuk memulai proses fermentasi yang optimal
                  </Text>
                </VStack>

                <Grid
                  templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
                  gap={{ base: '8', md: '10' }}
                  w="100%"
                >
                  {[
                    { num: '1', title: 'Buat Batch', desc: 'Input berat sampah organik dan tanggal mulai. Sistem otomatis hitung kebutuhan air & gula.' },
                    { num: '2', title: 'Monitor Fermentasi', desc: 'Catat observasi harian (aroma, warna, gas, suhu). AI prediksi status & kesehatan batch.' },
                    { num: '3', title: 'Dapatkan Rekomendasi', desc: 'Setelah panen, AI rekomendasikan produk terbaik berdasarkan karakteristik hasil.' },
                    { num: '4', title: 'Analisis Bisnis', desc: 'Lihat kelayakan bisnis: COGS, margin, break-even point, dan proyeksi profit 12 bulan.' }
                  ].map((step, idx) => (
                    <Box
                      key={idx}
                      display="flex"
                      gap="6"
                      alignItems="flex-start"
                    >
                      <Box
                        minW="50px"
                        h="50px"
                        borderRadius="full"
                        bg="#34A853"
                        color="white"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        fontWeight="bold"
                        fontSize="xl"
                        flexShrink={0}
                      >
                        {step.num}
                      </Box>
                      <VStack align="start" spacing="2">
                        <Heading size="md" color="gray.900">
                          {step.title}
                        </Heading>
                        <Text fontSize="sm" color="gray.600" lineHeight="1.6">
                          {step.desc}
                        </Text>
                      </VStack>
                    </Box>
                  ))}
                </Grid>
              </VStack>
            </Container>
          </Box>

          <Box w="100%" bg="linear-gradient(135deg, #34A853 0%, #2a8a42 100%)" color="white" py={{ base: '12', md: '16' }} px={{ base: '4', md: '8' }}>
            <Container maxW="6xl" mx="auto">
              <VStack spacing={{ base: '4', md: '6' }} textAlign="center">
                <Heading size="lg">
                  Siap Memulai Fermentasi Cerdas?
                </Heading>
                <Text fontSize="lg" opacity={0.95} maxW="2xl">
                  Bergabunglah dengan entrepreneur eco-enzyme yang menggunakan EcoFlow untuk meningkatkan efisiensi dan profitabilitas.
                </Text>
                <Link href="/login">
                  <Button
                    bg="white"
                    color="#34A853"
                    size="lg"
                    fontWeight="bold"
                    mt="4"
                    _hover={{ bg: 'gray.100', transform: 'translateY(-2px)' }}
                    transition="all 0.2s"
                  >
                    Mulai Gratis Sekarang
                  </Button>
                </Link>
              </VStack>
            </Container>
          </Box>

          <Box w="100%" bg="gray.900" color="gray.300" py="8" px={{ base: '4', md: '8' }}>
            <Container maxW="6xl" mx="auto">
              <VStack spacing="4" align="start">
                <Text fontSize="sm" fontWeight="bold" color="white">
                  EcoFlow AI v0.1.0
                </Text>
                <Text fontSize="xs">
                  Smart Eco-Enzyme Fermentation Assistant — Optimize your fermentation process with AI-powered insights.
                </Text>
                <HStack spacing="8" pt="4" fontSize="xs">
                  <Link href="/">
                    <Text _hover={{ color: 'white' }} cursor="pointer">
                      Home
                    </Text>
                  </Link>
                  <Link href="/login">
                    <Text _hover={{ color: 'white' }} cursor="pointer">
                      Dashboard
                    </Text>
                  </Link>
                  <Text>© 2026 EcoFlow AI. All rights reserved.</Text>
                </HStack>
              </VStack>
            </Container>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}
