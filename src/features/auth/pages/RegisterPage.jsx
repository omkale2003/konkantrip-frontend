import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Button from "../../../components/ui/Button/Button.jsx";
import Input from "../../../components/ui/Input/Input.jsx";

import { useRegister } from "../hooks/useRegister.js";
import { registerSchema } from "../schemas/auth.schema.js";

function RegisterPage() {
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      phone: "",
      email: "",
      password: "",
    },
  });

  const registerMutation = useRegister();

  const onSubmit = (formData) => {
    setServerError("");
    setSuccessMessage("");

    registerMutation.mutate(formData, {
      onSuccess: (data) => {
        setSuccessMessage(
          data?.message || "Property owner registered successfully"
        );

        reset();
      },

      onError: (error) => {
        const message =
          error?.response?.data?.message ||
          "Unable to register. Please try again.";

        setServerError(message);
      },
    });
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-8">
      <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        {/* Header */}
        <header className="mb-6">
          <div className="mb-4 text-lg font-bold text-konkan-700">
            KonkanTrip
          </div>

          <h1 className="mb-2 text-2xl font-semibold tracking-tight text-slate-900">
            Create your owner account
          </h1>

          <p className="m-0 text-sm leading-6 text-slate-600">
            Register to manage your properties and bookings on KonkanTrip.
          </p>
        </header>

        {/* Error Message */}
        {serverError && (
          <div
            className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            role="alert"
          >
            {serverError}
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div
            className="mb-5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-4"
            role="status"
          >
            <p className="mb-3 text-sm font-medium text-emerald-700">
              {successMessage}
            </p>

            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-lg bg-konkan-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-konkan-700"
            >
              Go to Login
            </Link>
          </div>
        )}

        {/* Register Form */}
        <form
          className="flex flex-col gap-5"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              id="first_name"
              label="First name"
              type="text"
              placeholder="Enter first name"
              autoComplete="given-name"
              required
              error={errors.first_name?.message}
              {...register("first_name")}
            />

            <Input
              id="last_name"
              label="Last name"
              type="text"
              placeholder="Enter last name"
              autoComplete="family-name"
              required
              error={errors.last_name?.message}
              {...register("last_name")}
            />
          </div>

          <Input
            id="phone"
            label="Phone number"
            type="tel"
            inputMode="numeric"
            placeholder="Enter 10-digit phone number"
            autoComplete="tel"
            maxLength={10}
            required
            error={errors.phone?.message}
            {...register("phone")}
          />

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
            placeholder="Create a password"
            autoComplete="new-password"
            required
            error={errors.password?.message}
            {...register("password")}
          />

          <Button
            type="submit"
            size="lg"
            fullWidth
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending
              ? "Creating account..."
              : "Create account"}
          </Button>
        </form>

        {/* Login Link */}
        <div className="mt-6 border-t border-slate-100 pt-5 text-center">
          <p className="mb-2 text-sm text-slate-500">
            Already have an owner account?
          </p>

          <Link
            to="/login"
            className="text-sm font-semibold text-konkan-700 transition-colors hover:text-konkan-800"
          >
            Login to your account
          </Link>
        </div>
      </div>
    </main>
  );
}

export default RegisterPage;