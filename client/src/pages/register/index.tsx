import Navbar from "@/components/Navbar";
import { API_ROUTE, PAGE_ROUTE } from "@/constants/routeName";
import useToast from "@/hooks/useToast";
import { api } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

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

  const { showToast } = useToast();

  const {
    mutate: registerUser,
    isError,
    error,
  } = useMutation({
    mutationFn: (data: { username: string; password: string }) =>
      api.post(API_ROUTE.AUTH.REGISTER, data),
    onSuccess: () => {
      reset();
      showToast({
        message: `회원가입이 완료되었습니다! 로그인해주세요.`,
        type: "success",
      });
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
    <div className="flex flex-col min-h-screen">
      {/* <header className="bg-gray-100 dark:bg-gray-900 p-4 shadow-md">
        <Navbar />
      </header> */}
      <main className="flex-grow bg-gray-50 dark:bg-gray-800 p-4">
        <div className="container mx-auto mt-10 flex flex-col items-center">
          <h2 className="text-4xl font-bold mb-8">Register</h2>
          {isError && <p className="text-red-500">{error?.message}</p>}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white dark:bg-gray-700 p-8 shadow-lg rounded-lg w-full max-w-md"
          >
            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block font-medium">
                  Username
                </label>
                <input
                  id="username"
                  className="mt-1 p-2 w-full border rounded-md text-black"
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
                {errors.username && (
                  <p className="text-red-500 mt-1">{errors.username.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="password" className="block font-medium">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  className="mt-1 p-2 w-full border rounded-md text-black"
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
                {errors.password && (
                  <p className="text-red-500 mt-1">{errors.password.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block font-medium">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  className="mt-1 p-2 w-full border rounded-md text-black"
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === password || "Passwords do not match",
                  })}
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 mt-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
              <button
                type="submit"
                className="mt-4 p-2 w-full bg-teal-500 text-white rounded-md"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Loading..." : "Register"}
              </button>
              <div className="flex">
                <p>이미 계정이 있으신가요? </p>
                <Link to={PAGE_ROUTE.LOGIN} className="text-blue-500 ml-1">
                  Login
                </Link>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default RegisterPage;
