import Navbar from "@/components/Navbar";
import { API_ROUTE } from "@/constants/routeName";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/fetch";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Heading,
  VStack,
  useColorModeValue,
  Text,
  Stack,
} from "@chakra-ui/react";

interface LoginFormInputs {
  username: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const { login } = useAuth();

  const {
    mutate: loginUser,
    isError,
    error,
  } = useMutation({
    mutationFn: (data: { username: string; password: string }) =>
      api.post(API_ROUTE.LOGIN, data),

    onSuccess: (data) => {
      login(data.user);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const onSubmit: SubmitHandler<LoginFormInputs> = (data) => {
    loginUser(data);
  };

  return (
    <Stack minH={"100vh"} direction={"column"}>
      <Navbar />
      <Box bg={useColorModeValue("gray.50", "gray.800")} p={4} flexGrow={1}>
        <VStack spacing={8} align="center" mt={10}>
          <Heading as="h2" size="xl">
            Login
          </Heading>
          {isError && <Text color="red.500">{error.message}</Text>}
          <Box
            as="form"
            onSubmit={handleSubmit(onSubmit)}
            bg={useColorModeValue("white", "gray.700")}
            p={8}
            boxShadow="lg"
            rounded="lg"
          >
            <VStack spacing={4}>
              <FormControl id="username" isInvalid={Boolean(errors.username)}>
                <FormLabel>Username</FormLabel>
                <Input
                  id="username"
                  {...register("username", {
                    required: "Username is required",
                    minLength: { value: 3, message: "Username is too short" },
                    maxLength: { value: 50, message: "Username is too long" },
                  })}
                />
                <FormErrorMessage>
                  {errors.username && errors.username.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl id="password" isInvalid={Boolean(errors.password)}>
                <FormLabel>Password</FormLabel>
                <Input
                  id="password"
                  type="password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 8, message: "Password is too short" },
                    maxLength: { value: 100, message: "Password is too long" },
                  })}
                />
                <FormErrorMessage>
                  {errors.password && errors.password.message}
                </FormErrorMessage>
              </FormControl>
              <Button type="submit" colorScheme="teal" isLoading={isSubmitting}>
                Login
              </Button>
            </VStack>
          </Box>
        </VStack>
      </Box>
    </Stack>
  );
};

export default LoginPage;
