import {
  CheckCircle2,
  Copy,
  Globe2,
  LockKeyhole,
  Route,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const domainFeatures = [
  {
    label: "DNS Verification",
    icon: ShieldCheck,
    color: "text-emerald-300",
  },
  {
    label: "SSL Ready",
    icon: LockKeyhole,
    color: "text-cyan-300",
  },
  {
    label: "Branded Redirects",
    icon: Route,
    color: "text-amber-300",
  },
];

const domainExamples = [
  {
    url: "https://yourbrand.com/sale",
    tag: "Main Campaign",
    gradient: "from-cyan-500 to-blue-600",
  },
  {
    url: "https://go.yourbrand.com/launch",
    tag: "Product Launch",
    gradient: "from-emerald-500 to-cyan-600",
  },
  {
    url: "https://links.yourbrand.com/offer",
    tag: "Special Offer",
    gradient: "from-violet-500 to-purple-600",
  },
];

export function CustomDomainSection() {
  return (
    <section className="relative overflow-hidden bg-white py-24">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_15%,rgba(34,211,238,0.16),transparent_30%),radial-gradient(circle_at_85%_20%,rgba(139,92,246,0.14),transparent_32%),radial-gradient(circle_at_50%_100%,rgba(16,185,129,0.12),transparent_35%)]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-xl bg-[#061A2F] p-6 text-white shadow-2xl md:p-10 lg:p-12">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.24),transparent_30%),radial-gradient(circle_at_80%_15%,rgba(139,92,246,0.26),transparent_34%),radial-gradient(circle_at_50%_90%,rgba(16,185,129,0.16),transparent_35%)]" />

          <div className="absolute -left-20 top-10 size-72 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="absolute -right-20 bottom-10 size-72 rounded-full bg-violet-500/20 blur-3xl" />

          <div className="relative grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
            <div>
              <Badge className="rounded-full border border-cyan-300/20 bg-white/10 px-4 py-2 text-sm font-bold text-cyan-200 hover:bg-white/10">
                <Globe2 className="mr-2 size-4" />
                Branded Domains
              </Badge>

              <h2 className="mt-5 max-w-2xl text-4xl font-black tracking-tight text-white md:text-5xl">
                Use your own{" "}
                <span className="bg-gradient-to-r from-cyan-300 via-emerald-300 to-amber-300 bg-clip-text text-transparent">
                  branded domain
                </span>{" "}
                for every short link
              </h2>

              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
                Turn long and messy URLs into trusted branded links. Add your
                custom domain, verify DNS, enable SSL-ready redirects, and start
                sharing links that build trust.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {domainFeatures.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur"
                  >
                    <item.icon className={`mb-3 size-6 ${item.color}`} />
                    <p className="text-sm font-black text-white">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button className="h-12 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 px-6 text-base font-bold text-white shadow-xl shadow-cyan-500/25 hover:from-cyan-400 hover:via-blue-600 hover:to-violet-500">
                  Add Custom Domain
                </Button>

                <Button
                  variant="outline"
                  className="h-12 rounded-2xl border-white/20 bg-white/10 px-6 text-base font-bold text-white backdrop-blur hover:bg-white/20 hover:text-white"
                >
                  View DNS Guide
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-5 -z-10 rounded-[2.5rem] bg-gradient-to-br from-cyan-400/30 via-blue-500/20 to-violet-500/30 blur-2xl" />

              <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/10 p-4 shadow-2xl backdrop-blur">
                <div className="rounded-[1.5rem] bg-white p-5 text-slate-950">
                  <div className="mb-5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white">
                        <Globe2 className="size-6" />
                      </div>

                      <div>
                        <h3 className="text-lg font-black">Domain Manager</h3>
                        <p className="text-sm font-medium text-slate-500">
                          go.yourbrand.com
                        </p>
                      </div>
                    </div>

                    <Badge className="rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-50">
                      Verified
                    </Badge>
                  </div>

                  <div className="space-y-4">
                    {domainExamples.map((item) => (
                      <div
                        key={item.url}
                        className="group rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-lg"
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <div
                                className={`size-3 rounded-full bg-gradient-to-r ${item.gradient}`}
                              />
                              <p className="break-all text-base font-black text-slate-950">
                                {item.url}
                              </p>
                            </div>

                            <p className="mt-1 text-sm font-medium text-slate-500">
                              {item.tag}
                            </p>
                          </div>

                          <Button
                            size="sm"
                            variant="outline"
                            className="rounded-xl"
                          >
                            <Copy className="mr-2 size-4" />
                            Copy
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 rounded-[1.5rem] border border-emerald-200 bg-gradient-to-br from-emerald-50 via-cyan-50 to-white p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-500 text-white">
                        <CheckCircle2 className="size-6" />
                      </div>

                      <div>
                        <p className="font-black text-slate-950">
                          DNS verified and ready to use
                        </p>
                        <p className="mt-1 text-sm leading-6 text-slate-600">
                          Your branded domain is connected and available for new
                          short links.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl bg-cyan-50 p-4 text-center">
                      <Zap className="mx-auto mb-2 size-5 text-cyan-600" />
                      <p className="text-lg font-black">Fast</p>
                      <p className="text-xs font-bold text-slate-500">
                        Redirects
                      </p>
                    </div>

                    <div className="rounded-2xl bg-emerald-50 p-4 text-center">
                      <ShieldCheck className="mx-auto mb-2 size-5 text-emerald-600" />
                      <p className="text-lg font-black">Safe</p>
                      <p className="text-xs font-bold text-slate-500">
                        Verified
                      </p>
                    </div>

                    <div className="rounded-2xl bg-violet-50 p-4 text-center">
                      <Sparkles className="mx-auto mb-2 size-5 text-violet-600" />
                      <p className="text-lg font-black">Brand</p>
                      <p className="text-xs font-bold text-slate-500">
                        Trusted
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -right-4 -top-5 hidden rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 px-4 py-3 text-white shadow-2xl md:block">
                <p className="text-xs font-bold uppercase tracking-wide">
                  Domain Status
                </p>
                <p className="text-xl font-black">Verified</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
