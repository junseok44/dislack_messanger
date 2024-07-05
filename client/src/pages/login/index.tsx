import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/fetch";
import { API_ROUTE } from "@/constants/routeName";

interface LoginFormInputs {
  username: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const navigate = useNavigate();

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
    <div>
      <Navbar />
      <h2>Login</h2>
      {isError && <p>{error.message}</p>}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            {...register("username", { required: "Username is required" })}
          />
          {errors.username && <p>{errors.username.message}</p>}
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            {...register("password", { required: "Password is required" })}
          />
          {errors.password && <p>{errors.password.message}</p>}
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
