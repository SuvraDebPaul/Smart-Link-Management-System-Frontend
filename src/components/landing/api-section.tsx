import {
  Braces,
  CheckCircle2,
  Code2,
  Copy,
  KeyRound,
  LockKeyhole,
  Rocket,
  ShieldCheck,
  Sparkles,
  Terminal,
  Zap,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const apiFeatures = [
  {
    title: "Secure API Keys",
    description: "Create and manage API keys from your dashboard.",
    icon: KeyRound,
    gradient: "from-cyan-400 to-blue-600",
  },
  {
    title: "Fast Response",
    description: "Shorten links quickly from your own applications.",
    icon: Zap,
    gradient: "from-emerald-400 to-cyan-600",
  },
  {
    title: "Scoped Access",
    description: "Control what each API key is allowed to do.",
    icon: ShieldCheck,
    gradient: "from-violet-400 to-purple-600",
  },
  {
    title: "Automation Ready",
    description: "Connect your CRM, dashboard, or workflow tools.",
    icon: Rocket,
    gradient: "from-amber-400 to-orange-600",
  },
];

const codeSnippet = `const response = await fetch("https://api.smartlink.com/api/links", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-api-key": "sk_live_xxxxx"
  },
  body: JSON.stringify({
    originalUrl: "https://example.com/product-launch",
    customAlias: "launch",
    expiresAt: "2026-12-31T23:59:59.000Z"
  })
});

const data = await response.json();

console.log(data.data.shortUrl);`;

export function ApiSection() {
  return (
    <section className="relative overflow-hidden bg-[#061A2F] py-24 text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_20%,rgba(34,211,238,0.22),transparent_30%),radial-gradient(circle_at_85%_15%,rgba(139,92,246,0.26),transparent_32%),radial-gradient(circle_at_50%_100%,rgba(16,185,129,0.16),transparent_35%)]" />

      <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
      <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-violet-400/50 to-transparent" />

      <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
        <div>
          <Badge className="rounded-full border border-cyan-300/20 bg-white/10 px-4 py-2 text-sm font-bold text-cyan-200 hover:bg-white/10">
            <Terminal className="mr-2 size-4" />
            Developer API
          </Badge>

          <h2 className="mt-5 max-w-2xl text-4xl font-black tracking-tight text-white md:text-5xl">
            Power your apps with a{" "}
            <span className="bg-gradient-to-r from-cyan-300 via-emerald-300 to-amber-300 bg-clip-text text-transparent">
              simple link API
            </span>
          </h2>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            Create short links from your own application, dashboard, CRM,
            automation workflow, or marketing system using secure API keys.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {apiFeatures.map((item) => (
              <div
                key={item.title}
                className="group rounded-[1.5rem] border border-white/10 bg-white/10 p-4 backdrop-blur transition hover:-translate-y-1 hover:bg-white/15"
              >
                <div
                  className={`mb-4 flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br ${item.gradient} text-white shadow-lg`}
                >
                  <item.icon className="size-6" />
                </div>

                <h3 className="font-black text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button className="h-12 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 px-6 text-base font-bold text-white shadow-xl shadow-cyan-500/25 hover:from-cyan-400 hover:via-blue-600 hover:to-violet-500">
              <Code2 className="mr-2 size-5" />
              View API Docs
            </Button>

            <Button
              variant="outline"
              className="h-12 rounded-2xl border-white/20 bg-white/10 px-6 text-base font-bold text-white backdrop-blur hover:bg-white/20 hover:text-white"
            >
              <KeyRound className="mr-2 size-5" />
              Create API Key
            </Button>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-5 -z-10 rounded-[2.5rem] bg-gradient-to-br from-cyan-400/30 via-blue-500/20 to-violet-500/30 blur-2xl" />

          <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-5 py-4">
              <div className="flex items-center gap-2">
                <span className="size-3 rounded-full bg-red-400" />
                <span className="size-3 rounded-full bg-yellow-400" />
                <span className="size-3 rounded-full bg-green-400" />
              </div>

              <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-cyan-200">
                <Braces className="size-3.5" />
                JavaScript
              </div>
            </div>

            <div className="border-b border-white/10 bg-slate-950 px-5 py-3">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white">
                    <LockKeyhole className="size-5" />
                  </div>

                  <div>
                    <p className="text-sm font-black text-white">
                      POST /api/links
                    </p>
                    <p className="text-xs font-medium text-slate-400">
                      Create a branded short link
                    </p>
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-xl border-white/10 bg-white/10 text-white hover:bg-white/20 hover:text-white"
                >
                  <Copy className="mr-2 size-4" />
                  Copy
                </Button>
              </div>
            </div>

            <pre className="max-h-[470px] overflow-x-auto bg-slate-950 p-6 text-sm leading-7 text-slate-200">
              <code>{codeSnippet}</code>
            </pre>
          </div>

          <div className="absolute -right-4 -top-5 hidden rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 px-4 py-3 text-white shadow-2xl md:block">
            <p className="text-xs font-bold uppercase tracking-wide">
              API Status
            </p>
            <p className="text-xl font-black">Ready</p>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {["Bearer Auth", "API Key Auth", "JSON Response"].map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-bold text-slate-200 backdrop-blur"
              >
                <CheckCircle2 className="size-4 text-emerald-300" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
