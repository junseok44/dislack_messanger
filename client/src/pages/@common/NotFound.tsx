import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Text, VStack } from "@chakra-ui/react";

const NotFound = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/");
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      bgGradient="linear(to-r, gray.300, yellow.400, pink.200)"
    >
      <VStack spacing={4}>
        <Text fontSize="4xl" fontWeight="bold">
          Page Not Found
        </Text>
        <Text fontSize="xl">The page you are looking for does not exist.</Text>
        <Button onClick={handleClick} colorScheme="teal" size="lg" mt={4}>
          Go to Home
        </Button>
      </VStack>
    </Box>
  );
};

export default NotFound;
