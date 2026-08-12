import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Button from "../../../components/ui/Button/Button.jsx";
import Input from "../../../components/ui/Input/Input.jsx";

import tokenService from "../../../services/token.service.js";
import storageService from "../../../services/storage.service.js";

import { useLogin } from "../hooks/useLogin.js";
import { loginSchema } from "../schemas/auth.schema.js";

function LoginPage() {
  const navigate = useNavigate();

  const [serverError, setServerError] = useState("");

  const savedEmail = typeof window !== "undefined" ? localStorage.getItem("remembered_owner_email") || "" : "";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: savedEmail,
      password: "",
      remember_me: Boolean(savedEmail),
    },
  });

  const loginMutation = useLogin();

  const onSubmit = (formData) => {
    setServerError("");

    loginMutation.mutate(formData, {
      onSuccess: (data) => {
        if (!data?.token || !data?.user) {
          setServerError(
            "Login response is missing authentication data."
          );
          return;
        }

        // Handle Remember Me persistence
        if (formData.remember_me) {
          localStorage.setItem("remembered_owner_email", formData.email);
        } else {
          localStorage.removeItem("remembered_owner_email");
        }

        // Store JWT
        tokenService.setToken(data.token);

        // Store property owner information
        storageService.setOwner(data.user);

        // Redirect to Owner Dashboard
        navigate("/owner/dashboard", {
          replace: true,
        });
      },

      onError: (error) => {
        const message =
          error?.response?.data?.message ||
          "Unable to login. Please try again.";

        setServerError(message);
      },
    });
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-8">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        {/* Header */}
        <header className="mb-6">
          <div className="mb-4 text-lg font-bold text-konkan-700">
            KonkanTrip
          </div>

          <h1 className="mb-2 text-2xl font-semibold tracking-tight text-slate-900">
            Welcome back
          </h1>

          <p className="m-0 text-sm leading-6 text-slate-600">
            Sign in to manage your properties.
          </p>
        </header>

        {/* Server Error */}
        {serverError && (
          <div
            className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            role="alert"
          >
            {serverError}
          </div>
        )}

        {/* Login Form */}
        <form
          className="flex flex-col gap-5"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <Input
            id="email"
            label="Email address"
            type="email"
            placeholder="Enter your email"
            autoComplete="email"
            required
            error={errors.email?.message}
            {...register("email")}
          />

          <Input
            id="password"
            label="Password"
            type="password"
            placeholder="Enter your password"
            autoComplete="current-password"
            required
            error={errors.password?.message}
            {...register("password")}
          />

          {/* Remember me Checkbox */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2.5 text-sm text-slate-700 cursor-pointer select-none">
              <input
                id="remember_me"
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                {...register("remember_me")}
              />
              <span>Remember me for 30 days</span>
            </label>
          </div>

          <Button
            type="submit"
            size="lg"
            fullWidth
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending
              ? "Signing in..."
              : "Sign in"}
          </Button>
        </form>

        {/* Register Link */}
        <div className="mt-6 border-t border-slate-100 pt-5 text-center">
          <p className="mb-2 text-sm text-slate-500">
            Don't have an owner account?
          </p>

          <Link
            to="/register"
            className="text-sm font-semibold text-konkan-700 transition-colors hover:text-konkan-800"
          >
            Create an account
          </Link>
        </div>
      </div>
    </main>
  );
}

export default LoginPage;