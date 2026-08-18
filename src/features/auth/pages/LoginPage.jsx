import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Building2, UserCheck, Shield } from "lucide-react";

import Button from "../../../components/ui/Button/Button.jsx";
import Input from "../../../components/ui/Input/Input.jsx";

import tokenService from "../../../services/token.service.js";
import storageService from "../../../services/storage.service.js";

import { useLogin } from "../hooks/useLogin.js";
import { useEmployeeLogin } from "../hooks/useEmployeeLogin.js";
import { loginSchema } from "../schemas/auth.schema.js";

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const successMessage = location.state?.message;

  const isStaffPath = location.pathname.includes("/employee") || location.search.includes("type=employee");
  const [authPortal, setAuthPortal] = useState(isStaffPath ? "employee" : "owner"); // "owner" | "employee"

  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const savedEmail = typeof window !== "undefined" ? localStorage.getItem("remembered_owner_email") || "" : "";

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: savedEmail,
      password: "",
      remember_me: Boolean(savedEmail),
    },
  });

  useEffect(() => {
    if (location.pathname.includes("/employee") || location.search.includes("type=employee")) {
      setAuthPortal("employee");
    }
  }, [location]);

  const ownerLoginMutation = useLogin();
  const employeeLoginMutation = useEmployeeLogin();

  const isSubmitting = ownerLoginMutation.isPending || employeeLoginMutation.isPending;

  const onSubmit = (formData) => {
    setServerError("");

    if (authPortal === "owner") {
      ownerLoginMutation.mutate(formData, {
        onSuccess: (data) => {
          if (!data?.token || !data?.user) {
            setServerError("Login response is missing authentication data.");
            return;
          }

          if (formData.remember_me) {
            localStorage.setItem("remembered_owner_email", formData.email);
          } else {
            localStorage.removeItem("remembered_owner_email");
          }

          tokenService.setToken(data.token);
          storageService.setOwner(data.user);

          navigate("/owner/dashboard", { replace: true });
        },
        onError: (error) => {
          const message = error?.response?.data?.message || "Unable to login as property owner. Please verify credentials.";
          setServerError(message);
        },
      });
    } else {
      // Employee Staff Login
      employeeLoginMutation.mutate(formData, {
        onSuccess: (data) => {
          const empData = data?.data || data?.user;
          if (!data?.token || !empData) {
            setServerError("Staff login response is missing credentials.");
            return;
          }

          if (formData.remember_me) {
            localStorage.setItem("remembered_owner_email", formData.email);
          } else {
            localStorage.removeItem("remembered_owner_email");
          }

          tokenService.setToken(data.token);
          storageService.setEmployee(empData);

          navigate("/owner/dashboard", { replace: true });
        },
        onError: (error) => {
          const message = error?.response?.data?.message || "Invalid employee credentials or inactive account.";
          setServerError(message);
        },
      });
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-8">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        {/* Header */}
        <header className="mb-6 text-center">
          <div className="mb-2 text-xl font-bold tracking-tight text-konkan-700">
            KonkanTrip&trade;
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {authPortal === "owner" ? "Owner Portal Sign In" : "Staff & Operations Sign In"}
          </h1>

          <p className="mt-1 text-xs text-slate-500">
            {authPortal === "owner"
              ? "Sign in to manage your hospitality properties and listings."
              : "Sign in with your assigned staff credentials to access on-site tools."}
          </p>
        </header>

        {/* Portal Switcher Tabs */}
        <div className="mb-6 grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => {
              setServerError("");
              setAuthPortal("owner");
            }}
            className={`flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-semibold transition ${
              authPortal === "owner"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <Building2 className="h-4 w-4 text-emerald-700" />
            Property Owner
          </button>

          <button
            type="button"
            onClick={() => {
              setServerError("");
              setAuthPortal("employee");
            }}
            className={`flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-semibold transition ${
              authPortal === "employee"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <UserCheck className="h-4 w-4 text-emerald-700" />
            Staff / Employee
          </button>
        </div>

        {/* Role Notice for Staff */}
        {authPortal === "employee" && (
          <div className="mb-5 flex items-center gap-2.5 rounded-lg border border-indigo-100 bg-indigo-50/70 p-3 text-xs text-indigo-900">
            <Shield className="h-4 w-4 text-indigo-600 shrink-0" />
            <span>Actions & visible properties are restricted based on your role permissions.</span>
          </div>
        )}

        {/* Server Error */}
        {serverError && (
          <div
            className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            role="alert"
          >
            {serverError}
          </div>
        )}

        {/* Success Message from Redirect */}
        {successMessage && (
          <div
            className="mb-5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
            role="status"
          >
            {successMessage}
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
            label={authPortal === "owner" ? "Owner email address" : "Staff email address"}
            type="email"
            placeholder={authPortal === "owner" ? "owner@example.com" : "staff@example.com"}
            autoComplete="email"
            required
            error={errors.email?.message}
            {...register("email")}
          />

          <Input
            id="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            autoComplete="current-password"
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
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Authenticating..."
              : authPortal === "owner"
              ? "Sign in as Owner"
              : "Sign in as Staff"}
          </Button>
        </form>

        {/* Register Link (only for owners) */}
        {authPortal === "owner" ? (
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
        ) : (
          <div className="mt-6 border-t border-slate-100 pt-5 text-center">
            <p className="text-xs text-slate-500">
              Need staff credentials or password reset? Contact your Property Owner or HR administrator.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

export default LoginPage;