import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import { api } from "@/lib/fetch";
import { useMutation } from "@tanstack/react-query";
import { API_ROUTE } from "@/constants/routeName";

interface RegisterFormInputs {
  username: string;
  password: string;
  confirmPassword: string;
}

const RegisterPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
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
  });

  const onSubmit: SubmitHandler<RegisterFormInputs> = async (data) => {
    try {
      registerUser(data);
      reset();
      // navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  // 비밀번호 일치 확인을 위한 watch 사용
  const password = watch("password");

  return (
    <div>
      <Navbar />
      <h2>Register</h2>
      {isError && (
        <div>
          <p>{error?.message}</p>
        </div>
      )}
      {isSuccess && (
        <div>
          <p>Register success</p>
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            {...register("username", {
              required: "Username is required",
              minLength: {
                value: 6,
                message: "Username must be at least 6 characters",
              },
            })}
          />
          {errors.username && <p>{errors.username.message}</p>}
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
            })}
          />
          {errors.password && <p>{errors.password.message}</p>}
        </div>
        <div>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) =>
                value === password || "Passwords do not match",
            })}
          />
          {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegisterPage;
