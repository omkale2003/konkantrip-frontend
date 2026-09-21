import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";

import Button from "../../../components/ui/Button/Button.jsx";
import Input from "../../../components/ui/Input/Input.jsx";

import { useRegister } from "../hooks/useRegister.js";
import { useRequestRegistrationOtp } from "../hooks/useRequestRegistrationOtp.js";
import { registerSchema } from "../schemas/auth.schema.js";

function RegisterPage() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [formData, setFormData] = useState(null);

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
      confirm_password: "",
    },
  });

  const registerMutation = useRegister();
  const requestOtpMutation = useRequestRegistrationOtp();

  const onFormSubmit = (data) => {
    setServerError("");
    setFormData(data);

    requestOtpMutation.mutate(
      { email: data.email, phone: data.phone },
      {
        onSuccess: () => {
          setStep(2);
        },
        onError: (error) => {
          setServerError(
            error?.response?.data?.message || "Failed to send OTP. Please try again."
          );
        },
      }
    );
  };

  const onOtpSubmit = (e) => {
    e.preventDefault();
    if (otp.length < 5) return;
    setServerError("");

    registerMutation.mutate(
      { ...formData, otp },
      {
        onSuccess: (data) => {
          const msg = data?.message || "Property owner registered successfully. Please log in.";
          reset();
          navigate("/login", { state: { message: msg } });
        },
        onError: (error) => {
          setServerError(
            error?.response?.data?.message || "Unable to register. Please check your OTP and try again."
          );
        },
      }
    );
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-8">
      <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        {/* Header */}
        <header className="mb-6">
          <div className="mb-4 text-lg font-bold text-konkan-700">
            KonkanTrip&trade;
          </div>

          <h1 className="mb-2 text-2xl font-semibold tracking-tight text-slate-900">
            Create your owner account
          </h1>

          <p className="m-0 text-sm leading-6 text-slate-600">
            Register to manage your properties and bookings on KonkanTrip&trade;.
          </p>
        </header>

        {/* Server Error Message */}
        {serverError && (
          <div
            className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            role="alert"
          >
            {serverError}
          </div>
        )}

        {/* Dynamic Form Step */}
        {step === 1 ? (
          <form
            className="flex flex-col gap-5"
            onSubmit={handleSubmit(onFormSubmit)}
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

            <div className="flex flex-col gap-1">
              <Input
                id="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                autoComplete="new-password"
                required
                error={errors.password?.message}
                {...register("password")}
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="hover:text-slate-600 focus:outline-none"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                }
              />
              <p className="text-xs text-slate-500 ml-1">
                Must be at least 8 characters, and contain at least one uppercase letter, one lowercase letter, one number, and one special character.
              </p>
            </div>

            <Input
              id="confirm_password"
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              autoComplete="new-password"
              required
              error={errors.confirm_password?.message}
              {...register("confirm_password")}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="hover:text-slate-600 focus:outline-none"
                  aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
            />

            <Button
              type="submit"
              size="lg"
              fullWidth
              disabled={requestOtpMutation.isPending}
            >
              {requestOtpMutation.isPending
                ? "Sending Verification Code..."
                : "Create account"}
            </Button>
          </form>
        ) : (
          <form className="flex flex-col gap-5" onSubmit={onOtpSubmit} noValidate>
            <p className="text-sm font-medium text-slate-700 text-center mb-2">
              We've sent a 6-digit code to <span className="font-bold text-konkan-700">{formData?.email}</span>. Please enter it below.
            </p>
            <Input
              id="otp"
              label="Verification Code"
              type="text"
              placeholder="Enter 6-digit OTP"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <Button
              type="submit"
              size="lg"
              fullWidth
              disabled={registerMutation.isPending || otp.length < 5}
            >
              {registerMutation.isPending
                ? "Verifying and Creating..."
                : "Verify OTP & Register"}
            </Button>
            <button
              type="button"
              className="text-sm text-slate-500 hover:text-konkan-700 mt-2 hover:underline"
              onClick={() => setStep(1)}
              disabled={registerMutation.isPending}
            >
              Go Back
            </button>
          </form>
        )}

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