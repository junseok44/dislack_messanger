import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import { api } from "@/lib/fetch";
import { useMutation } from "@tanstack/react-query";
import { API_ROUTE } from "@/constants/routeName";
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

interface RegisterFormInputs {
  username: string;
  password: string;
  confirmPassword: string;
}

const RegisterPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset,
  } = useForm<RegisterFormInputs>();

  const navigate = useNavigate();

  const {
    mutate: registerUser,
    isError,
    error,
    isSuccess,
  } = useMutation({
    mutationFn: (data: { username: string; password: string }) =>
      api.post(API_ROUTE.REGISTER, data),
    onSuccess: () => {
      reset();
      navigate("/login");
    },
    onError: (error) => {},
  });

  const onSubmit: SubmitHandler<RegisterFormInputs> = async (data) => {
    registerUser(data);
  };

  // 비밀번호 일치 확인을 위한 watch 사용
  const password = watch("password");

  return (
    <Stack minH={"100vh"} direction={"column"}>
      <Navbar />
      <Box bg={useColorModeValue("gray.50", "gray.800")} p={4} flexGrow={1}>
        <VStack spacing={8} align="center" mt={10}>
          <Heading as="h2" size="xl">
            Register
          </Heading>
          {isError && <Text color="red.500">{error?.message}</Text>}

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
                    minLength: {
                      value: 3,
                      message: "Username must be at least 3 characters",
                    },
                    maxLength: {
                      value: 50,
                      message: "Username must be at most 50 characters",
                    },
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
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                    maxLength: {
                      value: 100,
                      message: "Password must be at most 100 characters",
                    },
                  })}
                />
                <FormErrorMessage>
                  {errors.password && errors.password.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl
                id="confirmPassword"
                isInvalid={Boolean(errors.confirmPassword)}
              >
                <FormLabel>Confirm Password</FormLabel>
                <Input
                  id="confirmPassword"
                  type="password"
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === password || "Passwords do not match",
                  })}
                />
                <FormErrorMessage>
                  {errors.confirmPassword && errors.confirmPassword.message}
                </FormErrorMessage>
              </FormControl>
              <Button type="submit" colorScheme="teal" isLoading={isSubmitting}>
                Register
              </Button>
            </VStack>
          </Box>
        </VStack>
      </Box>
    </Stack>
  );
};

export default RegisterPage;
