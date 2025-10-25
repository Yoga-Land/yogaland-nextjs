"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import FormInput from "@/components/FormInput";
import Button from "@/components/Button";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/lib/validations/loginSchema";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, router]);

  const onSubmit = async (data: LoginFormData) => {
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Invalid credentials");
      }

      toast.success("Login successfully!");
      login(result.user.email);
      router.replace("/dashboard");
    } catch (err: any) {
      toast.error("Login failed!");
      setError(err.message);
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 md:px-8 bg-gradient-to-br from-yellow-50 via-white to-yellow-100">
      <div className="bg-white p-6 sm:p-8 md:p-10 rounded-xl shadow-lg w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-md transition-all">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-amber-600">
            YogaLand TV
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Admin Portal Login
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Email Input */}
          <FormInput
            label="Email"
            type="email"
            className="w-full h-10 sm:h-11 md:h-12 p-2 sm:p-3 border border-gray-300 rounded-lg text-sm sm:text-base"
            placeholder="admin@yogaland.com"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}

          {/* Password Input with toggle */}
          <div className="relative mt-4">
            <FormInput
              label="Password"
              type={showPassword ? "text" : "password"}
              className="w-full h-10 sm:h-11 md:h-12 p-2 sm:p-3 border border-gray-300 rounded-lg text-sm sm:text-base"
              placeholder="••••••••"
              {...register("password")}
            />
            <span
              className="absolute right-3 top-[35px] sm:top-[40px] md:top-[42px] cursor-pointer text-gray-500 text-lg"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </span>
          </div>

          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}

          {/* API Error */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded mt-3 text-sm sm:text-base">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full  lg:w-full bg-amber-500 text-white py-2 sm:py-3 rounded-lg hover:bg-amber-600  transition-colors mt-4 text-sm sm:text-base"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </div>
    </div>
  );
}
