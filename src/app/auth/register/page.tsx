import { AuthCard } from "@/components/auth/auth-card";
import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <AuthCard
      title="Create your account"
      description="Start creating branded short links, QR codes, campaigns, custom domains, and analytics from one dashboard."
      footerText="Already have an account?"
      footerLinkText="Login"
      footerHref="/auth/login"
    >
      <RegisterForm />
    </AuthCard>
  );
}
