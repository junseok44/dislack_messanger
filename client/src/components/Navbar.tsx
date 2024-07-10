import { PAGE_ROUTE } from "@/constants/routeName";
import { useAuth } from "@/contexts/AuthContext";
import {
  Box,
  Flex,
  HStack,
  Button,
  useColorMode,
  useColorModeValue,
  IconButton,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon, SunIcon, MoonIcon } from "@chakra-ui/icons";

import React from "react";
import { Link } from "react-router-dom";
import Container from "./Container";

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { colorMode, toggleColorMode } = useColorMode();

  const bg = useColorModeValue("gray.100", "gray.900");
  const color = useColorModeValue("black", "white");

  return (
    <Box bg={bg} boxShadow="md">
      <Container>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <IconButton
            size={"md"}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={"Open Menu"}
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={"center"}>
            <Box fontWeight="bold" fontSize="xl" color={color}>
              <Link to={PAGE_ROUTE.HOME}>MyApp</Link>
            </Box>
            <HStack
              as={"nav"}
              spacing={4}
              display={{ base: "none", md: "flex" }}
              alignItems={"center"}
            >
              {!user && (
                <>
                  <Link to={PAGE_ROUTE.LOGIN}>
                    <Button variant="link" color={color}>
                      Login
                    </Button>
                  </Link>
                  <Link to={PAGE_ROUTE.REGISTER}>
                    <Button variant="solid" colorScheme="teal" size="sm">
                      Register
                    </Button>
                  </Link>
                </>
              )}
              {user && (
                <Button
                  variant="solid"
                  colorScheme="teal"
                  size="sm"
                  onClick={() => {
                    logout();
                  }}
                >
                  Logout
                </Button>
              )}
            </HStack>
          </HStack>
          <Flex alignItems={"center"}>
            <IconButton
              aria-label="Toggle Color Mode"
              icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
              onClick={toggleColorMode}
              mr={2}
            />
          </Flex>
        </Flex>
        {isOpen ? (
          <Box pb={4} display={{ md: "none" }}>
            <Stack as={"nav"} spacing={4}>
              {!user && (
                <>
                  <Link to={PAGE_ROUTE.LOGIN}>
                    <Button variant="link" color={color} onClick={onClose}>
                      Login
                    </Button>
                  </Link>
                  <Link to={PAGE_ROUTE.REGISTER}>
                    <Button
                      variant="solid"
                      colorScheme="teal"
                      size="sm"
                      onClick={onClose}
                    >
                      Register
                    </Button>
                  </Link>
                </>
              )}
              {user && (
                <Button
                  variant="solid"
                  colorScheme="teal"
                  size="sm"
                  onClick={() => {
                    logout();
                    onClose();
                  }}
                >
                  Logout
                </Button>
              )}
            </Stack>
          </Box>
        ) : null}
      </Container>
    </Box>
  );
};

export default Navbar;
