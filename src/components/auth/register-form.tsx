"use client";

import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, UserPlus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { AuthService } from "@/services/auth.service";
import { authStorage } from "@/lib/auth-storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type TRegisterForm = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TRegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: TRegisterForm) => {
    try {
      const response = await AuthService.register(values);

      if (!response.success || !response.data) {
        toast.error(response.message || "Registration failed");
        return;
      }

      authStorage.setToken(response.data.accessToken);
      authStorage.setUser(response.data.user);

      toast.success("Account created successfully");
      router.push("/dashboard");
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Failed to create account";

      toast.error(message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label className="mb-2 block text-sm font-bold text-slate-700">
          Full Name
        </label>

        <Input
          type="text"
          placeholder="Your name"
          className="h-12 rounded-2xl"
          {...register("name")}
        />

        {errors.name && (
          <p className="mt-2 text-sm font-medium text-red-500">
            {errors.name.message}
          </p>
        )}
      </div>

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
            placeholder="Create a password"
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
            Creating account...
          </>
        ) : (
          <>
            <UserPlus className="mr-2 size-5" />
            Create Account
          </>
        )}
      </Button>
    </form>
  );
}
