import AuthLayout from '@/components/ui/AuthLayout'
import { API_ROUTE, PAGE_ROUTE } from '@/constants/routeName'
import { useAuth } from '@/contexts/AuthContext'
import useToast from '@/hooks/useToast'
import { api } from '@/lib/api'
import { useMutation } from '@tanstack/react-query'
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'

interface LoginFormInputs {
  username: string
  password: string
}

const LoginPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>({
    defaultValues: {
      username: '',
      password: '',
    },
  })

  const { login } = useAuth()

  const { showToast } = useToast()

  const {
    mutate: loginUser,
    isError,
    error,
  } = useMutation({
    mutationFn: (data: { username: string; password: string }) =>
      api.post(API_ROUTE.AUTH.LOGIN, data),

    onSuccess: (response: {
      data: {
        user: { username: string; id: number; planId: number }
      }
    }) => {
      showToast({
        message: `어서오세요, ${response.data.user.username}님!`,
        type: 'success',
      })
      login(response.data.user)
    },
    onError: (error) => {
      console.log(error)
    },
  })

  const onSubmit: SubmitHandler<LoginFormInputs> = (data) => {
    loginUser(data)
  }

  return (
    <AuthLayout>
      <h2 className="mb-8 text-4xl font-bold">Login</h2>
      {isError && <p className="text-red-500">{error.message}</p>}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg dark:bg-gray-700"
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="username" className="block font-medium">
              Username
            </label>
            <input
              id="username"
              className="mt-1 w-full rounded-md border p-2 text-black"
              {...register('username', {
                required: 'Username is required',
                minLength: { value: 3, message: 'Username is too short' },
                maxLength: { value: 50, message: 'Username is too long' },
              })}
            />
            {errors.username && (
              <p className="mt-1 text-red-500">{errors.username.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="password" className="block font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="mt-1 w-full rounded-md border p-2 text-black"
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 8, message: 'Password is too short' },
                maxLength: { value: 100, message: 'Password is too long' },
              })}
            />
            {errors.password && (
              <p className="mt-1 text-red-500">{errors.password.message}</p>
            )}
          </div>
          <button
            type="submit"
            className="mt-4 w-full rounded-md bg-teal-500 p-2 text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Loading...' : 'Login'}
          </button>
          <div className="flex">
            <p>계정이 없으신가요?</p>
            <Link to={PAGE_ROUTE.REGISTER} className="ml-1 text-blue-500">
              Register
            </Link>
          </div>
        </div>
      </form>
    </AuthLayout>
  )
}

export default LoginPage
