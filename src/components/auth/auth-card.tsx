import Link from "next/link";
import { BarChart3, Globe2, Link2, LockKeyhole, Sparkles } from "lucide-react";

type TAuthCardProps = {
  children: React.ReactNode;
  title: string;
  description: string;
  footerText: string;
  footerLinkText: string;
  footerHref: string;
};

const highlights = [
  {
    label: "Branded short links",
    icon: Link2,
  },
  {
    label: "Real-time analytics",
    icon: BarChart3,
  },
  {
    label: "Custom domains",
    icon: Globe2,
  },
  {
    label: "Password protection",
    icon: LockKeyhole,
  },
];

export function AuthCard({
  children,
  title,
  description,
  footerText,
  footerLinkText,
  footerHref,
}: TAuthCardProps) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-violet-50">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative hidden overflow-hidden bg-[#061A2F] p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.32),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(139,92,246,0.34),transparent_35%),radial-gradient(circle_at_50%_100%,rgba(16,185,129,0.18),transparent_35%)]" />

          <Link href="/" className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-600 to-violet-600 text-white shadow-lg shadow-cyan-500/25">
              <Link2 className="size-6" />
            </div>

            <div>
              <p className="text-xl font-black">Smart Link</p>
              <p className="text-xs font-semibold text-cyan-200">
                Shorten • Brand • Track
              </p>
            </div>
          </Link>

          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-white/10 px-4 py-2 text-sm font-bold text-cyan-200 backdrop-blur">
              <Sparkles className="size-4" />
              Smart URL management platform
            </div>

            <h1 className="max-w-2xl text-5xl font-black tracking-tight">
              Create smarter links with security, branding and analytics.
            </h1>

            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-300">
              Login to manage short links, campaigns, QR codes, custom domains,
              API keys, and link-in-bio pages from one dashboard.
            </p>

            <div className="mt-8 grid max-w-xl grid-cols-2 gap-4">
              {highlights.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur"
                >
                  <item.icon className="mb-3 size-6 text-cyan-300" />
                  <p className="text-sm font-bold text-white">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-sm text-slate-400">
            © {new Date().getFullYear()} Smart Link. All rights reserved.
          </p>
        </section>

        <section className="flex items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
          <div className="w-full max-w-md">
            <div className="mb-8 text-center lg:hidden">
              <Link href="/" className="inline-flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-600 to-violet-600 text-white">
                  <Link2 className="size-6" />
                </div>

                <span className="text-xl font-black text-slate-950">
                  Smart Link
                </span>
              </Link>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-200/70 sm:p-8">
              <div className="mb-8">
                <h2 className="text-3xl font-black tracking-tight text-slate-950">
                  {title}
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {description}
                </p>
              </div>

              {children}

              <p className="mt-6 text-center text-sm font-medium text-slate-600">
                {footerText}{" "}
                <Link
                  href={footerHref}
                  className="font-black text-primary hover:underline"
                >
                  {footerLinkText}
                </Link>
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
