import { AuthCard } from "@/components/auth/auth-card";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <AuthCard
      title="Welcome back"
      description="Login to your Smart Link dashboard and continue managing your links, campaigns, domains, and analytics."
      footerText="Do not have an account?"
      footerLinkText="Create account"
      footerHref="/auth/register"
    >
      <LoginForm />
    </AuthCard>
  );
}
