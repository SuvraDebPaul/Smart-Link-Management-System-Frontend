import { CheckCircle2, Crown, Rocket, Sparkles, Star, Zap } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "For personal use and testing.",
    features: ["Basic short links", "Custom aliases", "Basic analytics"],
    highlighted: false,
    badge: "Start Here",
    icon: Sparkles,
    gradient: "from-cyan-400 to-blue-600",
    buttonText: "Start Free",
  },
  {
    name: "Starter",
    price: "$5",
    description: "For creators and freelancers.",
    features: ["More links", "Campaigns", "QR support", "Bio page"],
    highlighted: false,
    badge: "Creator",
    icon: Zap,
    gradient: "from-emerald-400 to-cyan-600",
    buttonText: "Choose Starter",
  },
  {
    name: "Pro",
    price: "$10",
    description: "For teams and growing brands.",
    features: [
      "Advanced analytics",
      "Custom domains",
      "API keys",
      "Password links",
    ],
    highlighted: true,
    badge: "Most Popular",
    icon: Crown,
    gradient: "from-cyan-400 via-blue-600 to-violet-600",
    buttonText: "Choose Pro",
  },
  {
    name: "Business",
    price: "Custom",
    description: "For companies and large teams.",
    features: ["Team access", "High limits", "Priority support", "Admin tools"],
    highlighted: false,
    badge: "Scale",
    icon: Rocket,
    gradient: "from-amber-400 to-orange-600",
    buttonText: "Contact Sales",
  },
];

export function PricingSection() {
  return (
    <section className="relative overflow-hidden bg-white py-24">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_20%,rgba(34,211,238,0.16),transparent_30%),radial-gradient(circle_at_85%_15%,rgba(139,92,246,0.14),transparent_32%),radial-gradient(circle_at_50%_100%,rgba(16,185,129,0.12),transparent_35%)]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <Badge className="rounded-full border border-cyan-500 bg-cyan-50 p-4 text-sm font-bold text-primary hover:bg-cyan-50">
            <Star className="mr-2 size-4" />
            Simple Pricing
          </Badge>

          <h2 className="mt-5 text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
            Start free, upgrade when your{" "}
            <span className="bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 bg-clip-text text-transparent">
              links grow
            </span>
          </h2>

          <p className="mt-5 text-lg leading-8 text-slate-600">
            Choose the plan that fits your link management needs. Start with
            short links, then unlock analytics, custom domains, API keys, and
            advanced controls.
          </p>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-4">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={
                plan.highlighted
                  ? "relative overflow-hidden rounded-xl border-0 bg-[#061A2F] text-white shadow-2xl shadow-cyan-500/20 ring-2 ring-cyan-400/40 transition duration-300 hover:-translate-y-2"
                  : "relative overflow-hidden rounded-xl border-slate-200 bg-white shadow-xl shadow-slate-200/70 transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
              }
            >
              {plan.highlighted && (
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.28),transparent_32%),radial-gradient(circle_at_80%_20%,rgba(139,92,246,0.3),transparent_35%),radial-gradient(circle_at_50%_100%,rgba(16,185,129,0.16),transparent_35%)]" />
              )}

              <div
                className={`absolute -right-12 -top-12 size-36 rounded-xl bg-gradient-to-br ${plan.gradient} opacity-15 blur-2xl`}
              />

              <CardContent className="relative p-6">
                <div className="mb-6 flex items-start justify-between gap-4">
                  <div
                    className={`flex size-14 items-center justify-center rounded-xl bg-gradient-to-br ${plan.gradient} text-white shadow-lg`}
                  >
                    <plan.icon className="size-7" />
                  </div>

                  <Badge
                    className={
                      plan.highlighted
                        ? "rounded-full bg-white/10 text-cyan-100 hover:bg-white/10"
                        : "rounded-full bg-slate-100 text-slate-700 hover:bg-slate-100"
                    }
                  >
                    {plan.badge}
                  </Badge>
                </div>

                <h3
                  className={
                    plan.highlighted
                      ? "text-2xl font-black text-white"
                      : "text-2xl font-black text-slate-950"
                  }
                >
                  {plan.name}
                </h3>

                <div className="mt-5 flex items-end gap-1">
                  <span
                    className={
                      plan.highlighted
                        ? "text-5xl font-black text-white"
                        : "text-5xl font-black text-slate-950"
                    }
                  >
                    {plan.price}
                  </span>

                  {plan.price !== "Custom" && (
                    <span
                      className={
                        plan.highlighted
                          ? "pb-1 text-sm font-bold text-slate-300"
                          : "pb-1 text-sm font-bold text-slate-500"
                      }
                    >
                      /month
                    </span>
                  )}
                </div>

                <p
                  className={
                    plan.highlighted
                      ? "mt-5 text-sm leading-6 text-slate-300"
                      : "mt-5 text-sm leading-6 text-slate-600"
                  }
                >
                  {plan.description}
                </p>

                <div className="mt-7 space-y-4">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-3">
                      <div
                        className={
                          plan.highlighted
                            ? "flex size-7 shrink-0 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-300"
                            : "flex size-7 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600"
                        }
                      >
                        <CheckCircle2 className="size-4" />
                      </div>

                      <span
                        className={
                          plan.highlighted
                            ? "text-sm font-bold text-slate-100"
                            : "text-sm font-bold text-slate-700"
                        }
                      >
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                <Button
                  className={
                    plan.highlighted
                      ? "mt-8 h-12 w-full rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 text-base font-bold text-white shadow-xl shadow-cyan-500/25 hover:from-cyan-400 hover:via-blue-600 hover:to-violet-500"
                      : "mt-8 h-12 w-full rounded-xl bg-[#061A2F] text-base font-bold text-white hover:bg-slate-800"
                  }
                >
                  {plan.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-10 rounded-xl border border-slate-200 bg-[#061A2F] p-5 text-white shadow-2xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-lg font-black">
                Need higher limits or team features?
              </p>
              <p className="mt-1 text-sm text-slate-300">
                Business plan can be customized for agencies, companies, and
                SaaS products.
              </p>
            </div>

            <Button className="rounded-xl bg-white text-slate-950 hover:bg-slate-100">
              Talk to Us
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
