"use client";

import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, LogIn } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { AuthService } from "@/services/auth.service";
import { authStorage } from "@/lib/auth-storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type TLoginForm = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TLoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: TLoginForm) => {
    try {
      const response = await AuthService.login(values);

      if (!response.success || !response.data) {
        toast.error(response.message || "Login failed");
        return;
      }

      authStorage.setToken(response.data.accessToken);
      authStorage.setUser(response.data.user);

      toast.success("Login successful");
      router.push("/dashboard");
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Invalid email or password";

      toast.error(message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label className="mb-2 block text-sm font-bold text-slate-700">
          Email Address
        </label>

        <Input
          type="email"
          placeholder="you@example.com"
          className="h-12 rounded-2xl"
          {...register("email")}
        />

        {errors.email && (
          <p className="mt-2 text-sm font-medium text-red-500">
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm font-bold text-slate-700">
          Password
        </label>

        <div className="flex rounded-2xl border border-input bg-background p-1">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            className="h-11 border-0 shadow-none focus-visible:ring-0"
            {...register("password")}
          />

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setShowPassword((value) => !value)}
            className="h-11 w-11 rounded-xl"
          >
            {showPassword ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </Button>
        </div>

        {errors.password && (
          <p className="mt-2 text-sm font-medium text-red-500">
            {errors.password.message}
          </p>
        )}
      </div>

      <Button
        disabled={isSubmitting}
        className="h-12 w-full rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 text-base font-bold text-white shadow-xl shadow-cyan-500/25 hover:from-cyan-400 hover:via-blue-600 hover:to-violet-500"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 size-5 animate-spin" />
            Logging in...
          </>
        ) : (
          <>
            <LogIn className="mr-2 size-5" />
            Login
          </>
        )}
      </Button>
    </form>
  );
}
