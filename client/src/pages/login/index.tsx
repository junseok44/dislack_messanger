import Navbar from "@/components/Navbar";
import { API_ROUTE, PAGE_ROUTE } from "@/constants/routeName";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link } from "react-router-dom";

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
      api.post(API_ROUTE.AUTH.LOGIN, data),

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
    <div className="flex flex-col min-h-screen">
      {/* <header className="bg-gray-100 dark:bg-gray-900 p-4 shadow-md"> */}
      {/* <Navbar /> */}
      {/* </header> */}
      <main className="flex-grow bg-gray-50 dark:bg-gray-800 p-4">
        <div className="container mx-auto mt-10 flex flex-col items-center">
          <h2 className="text-4xl font-bold mb-8">Login</h2>
          {isError && <p className="text-red-500">{error.message}</p>}
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
                    minLength: { value: 3, message: "Username is too short" },
                    maxLength: { value: 50, message: "Username is too long" },
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
                    minLength: { value: 8, message: "Password is too short" },
                    maxLength: { value: 100, message: "Password is too long" },
                  })}
                />
                {errors.password && (
                  <p className="text-red-500 mt-1">{errors.password.message}</p>
                )}
              </div>
              <button
                type="submit"
                className="mt-4 p-2 w-full bg-teal-500 text-white rounded-md"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Loading..." : "Login"}
              </button>
              <div className="flex">
                <p>계정이 없으신가요?</p>
                <Link to={PAGE_ROUTE.REGISTER} className="text-blue-500 ml-1">
                  Register
                </Link>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
