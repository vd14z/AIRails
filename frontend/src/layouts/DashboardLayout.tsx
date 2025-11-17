import {
  Box,
  Flex,
  Icon,
  IconButton,
  Text,
  VStack,
  HStack,
} from '@chakra-ui/react'
import { useColorMode, useColorModeValue } from '@chakra-ui/color-mode'
import { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import { FiBriefcase, FiCpu, FiHome, FiPieChart, FiSun, FiMoon, FiUsers } from 'react-icons/fi'

const navItems = [
  { to: '/', label: 'Pipeline', icon: FiHome },
  { to: '/candidates', label: 'Candidates', icon: FiUsers },
  { to: '/jobs/new', label: 'Generador IA', icon: FiCpu },
  { to: '/executive-summary', label: 'Resumen ejecutivo', icon: FiBriefcase },
  { to: '/insights', label: 'Insights IA', icon: FiPieChart },
]

export function DashboardLayout({ children }: { children: ReactNode }) {
  const { colorMode, toggleColorMode } = useColorMode()
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200')

  return (
    <Flex minH="100vh" bg="gray.900" color="gray.50">
      <Box
        as="nav"
        w="260px"
        borderRight="1px solid"
        borderColor={borderColor}
        px={6}
        py={8}
      >
        <Text fontWeight="bold" fontSize="xl" mb={8}>
          AI Talent Hub
        </Text>
        <VStack gap={3} align="stretch">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to}>
              {({ isActive }) => (
                <HStack
                  px={3}
                  py={2.5}
                  borderRadius="md"
                  bg={isActive ? 'whiteAlpha.200' : 'transparent'}
                  color={isActive ? 'white' : 'gray.300'}
                  _hover={{ bg: 'whiteAlpha.100', color: 'white' }}
                  transition="all 0.2s"
                >
                  <Icon as={item.icon} />
                  <Text fontWeight={isActive ? 'bold' : 'medium'}>{item.label}</Text>
                </HStack>
              )}
            </NavLink>
          ))}
        </VStack>
      </Box>
      <Flex direction="column" flex="1">
        <HStack
          justify="space-between"
          px={8}
          py={4}
          borderBottom="1px solid"
          borderColor={borderColor}
        >
          <Text fontSize="lg" fontWeight="semibold">
            Demostración de IA responsable
          </Text>
          <IconButton
            aria-label="Cambiar tema"
            icon={colorMode === 'light' ? <FiMoon /> : <FiSun />}
            onClick={toggleColorMode}
            variant="ghost"
          />
        </HStack>
        <Box as="main" flex="1" p={8} bg="gray.950">
          {children}
        </Box>
      </Flex>
    </Flex>
  )
}

