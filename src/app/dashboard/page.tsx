"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowRight,
  BarChart3,
  ExternalLink,
  Globe2,
  KeyRound,
  Layers3,
  Link2,
  Loader2,
  MousePointerClick,
  RefreshCcw,
  Smartphone,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  WalletCards,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AnalyticsService } from "@/services/analytics.service";
import type { TAnalyticsOverview } from "@/types/analytics.type";

function formatNumber(value?: number | null) {
  return new Intl.NumberFormat("en-US").format(value ?? 0);
}

function formatPercent(value?: number | null) {
  return `${value ?? 0}%`;
}

function safeArray<T>(value?: T[]) {
  return Array.isArray(value) ? value : [];
}

function getMaxValue(values: number[]) {
  const max = Math.max(...values, 0);
  return max <= 0 ? 1 : max;
}

function getStatusClass(status: string) {
  if (status === "active") {
    return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  }

  if (status === "paused") {
    return "bg-amber-50 text-amber-700 ring-amber-200";
  }

  return "bg-slate-100 text-slate-600 ring-slate-200";
}

type MetricCardProps = {
  title: string;
  value: string;
  description: string;
  icon: React.ElementType;
  gradient: string;
};

function MetricCard({
  title,
  value,
  description,
  icon: Icon,
  gradient,
}: MetricCardProps) {
  return (
    <Card className="group overflow-hidden rounded-[2rem] border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <CardContent className="relative p-6">
        <div
          className={`absolute -right-10 -top-10 size-32 rounded-full bg-gradient-to-br ${gradient} opacity-10 blur-2xl transition group-hover:opacity-20`}
        />

        <div className="relative flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-slate-500">{title}</p>

            <h3 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
              {value}
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              {description}
            </p>
          </div>

          <div
            className={`flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-lg`}
          >
            <Icon className="size-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

type MiniBarProps = {
  label: string;
  value: number;
  maxValue: number;
};

function MiniBar({ label, value, maxValue }: MiniBarProps) {
  const width = Math.max((value / maxValue) * 100, value > 0 ? 8 : 0);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3 text-sm">
        <span className="truncate font-bold text-slate-700">{label}</span>
        <span className="font-black text-slate-950">{formatNumber(value)}</span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-600"
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
      <BarChart3 className="mx-auto size-8 text-slate-400" />
      <p className="mt-3 text-sm font-medium text-slate-500">{message}</p>
    </div>
  );
}

const quickActions = [
  {
    title: "Create Short Link",
    description: "Shorten a URL with alias, password, expiry and QR.",
    icon: Link2,
    href: "/dashboard/links/create",
    gradient: "from-cyan-500 to-blue-600",
  },
  {
    title: "Create Campaign",
    description: "Group links and track marketing performance.",
    icon: Layers3,
    href: "/dashboard/campaigns",
    gradient: "from-violet-500 to-purple-600",
  },
  {
    title: "Create Bio Page",
    description: "Build a public page with multiple tracked links.",
    icon: WalletCards,
    href: "/dashboard/pages",
    gradient: "from-emerald-500 to-cyan-600",
  },
  {
    title: "Create API Key",
    description: "Generate API keys for automation and integrations.",
    icon: KeyRound,
    href: "/dashboard/api-keys",
    gradient: "from-amber-500 to-orange-600",
  },
];

export default function DashboardPage() {
  const [overview, setOverview] = useState<TAnalyticsOverview | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadDashboard = async () => {
    try {
      setIsLoading(true);

      const response = await AnalyticsService.getOverview();

      if (!response.success || !response.data) {
        toast.error(response.message || "Failed to load dashboard");
        return;
      }

      setOverview(response.data);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to load dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const dailyActivity = useMemo(
    () => safeArray(overview?.dailyActivity).slice(-7),
    [overview],
  );

  const topLinks = useMemo(
    () => safeArray(overview?.topLinks).slice(0, 4),
    [overview],
  );

  const topCampaigns = useMemo(
    () => safeArray(overview?.topCampaigns).slice(0, 4),
    [overview],
  );

  const devices = useMemo(
    () => safeArray(overview?.devices).slice(0, 4),
    [overview],
  );

  const browsers = useMemo(
    () => safeArray(overview?.browsers).slice(0, 4),
    [overview],
  );

  const referrers = useMemo(
    () => safeArray(overview?.referrers).slice(0, 4),
    [overview],
  );

  const maxDailyValue = useMemo(() => {
    return getMaxValue(
      dailyActivity.flatMap((item) => [item.clicks ?? 0, item.visits ?? 0]),
    );
  }, [dailyActivity]);

  const maxDeviceValue = useMemo(
    () => getMaxValue(devices.map((item) => item.total ?? 0)),
    [devices],
  );

  const maxBrowserValue = useMemo(
    () => getMaxValue(browsers.map((item) => item.total ?? 0)),
    [browsers],
  );

  const maxReferrerValue = useMemo(
    () => getMaxValue(referrers.map((item) => item.total ?? 0)),
    [referrers],
  );

  const totalLinks = overview?.totalLinks ?? 0;
  const totalClicks = overview?.totalClicks ?? 0;
  const totalCampaigns = overview?.totalCampaigns ?? 0;
  const totalPages = overview?.totalPages ?? 0;
  const totalPageVisits = overview?.totalPageVisits ?? 0;
  const totalPageLinkClicks = overview?.totalPageLinkClicks ?? 0;
  const activeLinks = overview?.activeLinks ?? 0;
  const uniqueVisitors = overview?.uniqueVisitors ?? 0;
  const bioPageCtr = overview?.bioPageCtr ?? 0;
  const conversionRate = overview?.conversionRate ?? 0;

  const activeLinkRate =
    totalLinks > 0 ? Math.round((activeLinks / totalLinks) * 100) : 0;

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[2rem] bg-slate-950 text-white shadow-2xl">
        <div className="relative p-6 md:p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.25),transparent_30%),radial-gradient(circle_at_80%_10%,rgba(139,92,246,0.26),transparent_34%),radial-gradient(circle_at_50%_100%,rgba(16,185,129,0.16),transparent_35%)]" />

          <div className="relative grid gap-8 lg:grid-cols-[1fr_360px] lg:items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-bold text-cyan-200 backdrop-blur">
                <Sparkles className="size-4" />
                Smart Link Business Dashboard
              </div>

              <h1 className="max-w-3xl text-3xl font-black tracking-tight md:text-5xl">
                Track your links, campaigns, bio pages and audience growth.
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
                This is your main command center after login. See performance,
                traffic quality, visitor behavior, and high-performing assets at
                a glance.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button
                  asChild
                  className="h-12 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 px-6 font-bold text-white shadow-xl shadow-cyan-500/25"
                >
                  <Link href="/dashboard/links/create">
                    Create New Link
                    <ArrowRight className="ml-2 size-4" />
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="h-12 rounded-2xl border-white/15 bg-white/10 px-6 font-bold text-white hover:bg-white/20 hover:text-white"
                >
                  <Link href="/dashboard/analytics">
                    View Full Analytics
                    <BarChart3 className="ml-2 size-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/10 p-5 backdrop-blur">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-300">
                    Business Conversion
                  </p>
                  <h2 className="mt-2 text-4xl font-black">
                    {formatPercent(conversionRate)}
                  </h2>
                </div>

                <div className="flex size-14 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-300">
                  <Target className="size-7" />
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-2xl font-black">
                    {formatNumber(uniqueVisitors)}
                  </p>
                  <p className="mt-1 text-xs font-medium text-slate-300">
                    Unique Visitors
                  </p>
                </div>

                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-2xl font-black">
                    {formatPercent(bioPageCtr)}
                  </p>
                  <p className="mt-1 text-xs font-medium text-slate-300">
                    Bio Page CTR
                  </p>
                </div>

                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-2xl font-black">
                    {formatNumber(totalPageVisits)}
                  </p>
                  <p className="mt-1 text-xs font-medium text-slate-300">
                    Bio Visits
                  </p>
                </div>

                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-2xl font-black">
                    {formatPercent(activeLinkRate)}
                  </p>
                  <p className="mt-1 text-xs font-medium text-slate-300">
                    Active Link Rate
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {isLoading ? (
        <Card className="rounded-[2rem] border-slate-200 bg-white shadow-sm">
          <CardContent className="flex items-center gap-2 p-6 text-sm text-slate-500">
            <Loader2 className="size-4 animate-spin" />
            Loading business dashboard...
          </CardContent>
        </Card>
      ) : (
        <>
          <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              title="Total Clicks"
              value={formatNumber(totalClicks)}
              description="All tracked short link clicks"
              icon={MousePointerClick}
              gradient="from-cyan-500 to-blue-600"
            />

            <MetricCard
              title="Total Links"
              value={formatNumber(totalLinks)}
              description={`${formatNumber(activeLinks)} active links`}
              icon={Link2}
              gradient="from-emerald-500 to-cyan-600"
            />

            <MetricCard
              title="Campaigns"
              value={formatNumber(totalCampaigns)}
              description="Marketing campaign groups"
              icon={Layers3}
              gradient="from-violet-500 to-purple-600"
            />

            <MetricCard
              title="Bio Pages"
              value={formatNumber(totalPages)}
              description={`${formatNumber(totalPageVisits)} total visits`}
              icon={WalletCards}
              gradient="from-amber-500 to-orange-600"
            />
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
            <Card className="rounded-[2rem] border-slate-200 bg-white shadow-sm">
              <CardContent className="p-6">
                <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <div>
                    <h3 className="text-xl font-black text-slate-950">
                      7-Day Business Activity
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Link clicks vs bio page visits
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3 text-sm">
                    <div className="flex items-center gap-2 font-semibold text-slate-600">
                      <span className="size-3 rounded-full bg-cyan-500" />
                      Clicks
                    </div>

                    <div className="flex items-center gap-2 font-semibold text-slate-600">
                      <span className="size-3 rounded-full bg-emerald-500" />
                      Visits
                    </div>
                  </div>
                </div>

                {dailyActivity.length === 0 ? (
                  <EmptyState message="No activity data yet. Clicks and visits will appear here after users interact with your links." />
                ) : (
                  <div className="flex h-80 items-end gap-4 overflow-x-auto rounded-[1.5rem] bg-slate-50 p-5">
                    {dailyActivity.map((item) => {
                      const clickHeight = Math.max(
                        ((item.clicks ?? 0) / maxDailyValue) * 100,
                        item.clicks ? 8 : 0,
                      );

                      const visitHeight = Math.max(
                        ((item.visits ?? 0) / maxDailyValue) * 100,
                        item.visits ? 8 : 0,
                      );

                      return (
                        <div
                          key={item.date}
                          className="flex min-w-[76px] flex-1 flex-col items-center gap-3"
                        >
                          <div className="flex h-56 w-full items-end justify-center gap-2">
                            <div
                              title={`${formatNumber(item.clicks)} clicks`}
                              className="w-5 rounded-t-2xl bg-gradient-to-t from-cyan-500 to-blue-600 shadow-sm"
                              style={{ height: `${clickHeight}%` }}
                            />

                            <div
                              title={`${formatNumber(item.visits)} visits`}
                              className="w-5 rounded-t-2xl bg-gradient-to-t from-emerald-500 to-cyan-500 shadow-sm"
                              style={{ height: `${visitHeight}%` }}
                            />
                          </div>

                          <span className="text-xs font-bold text-slate-500">
                            {item.date.slice(5)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="rounded-[2rem] border-slate-200 bg-white shadow-sm">
              <CardContent className="p-6">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-black text-slate-950">
                      Growth Snapshot
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Key performance indicators
                    </p>
                  </div>

                  <TrendingUp className="size-7 text-emerald-500" />
                </div>

                <div className="space-y-4">
                  <div className="rounded-2xl bg-indigo-50 p-4">
                    <p className="text-sm font-bold text-indigo-600">
                      Unique Visitors
                    </p>
                    <p className="mt-1 text-3xl font-black text-slate-950">
                      {formatNumber(uniqueVisitors)}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-emerald-50 p-4">
                    <p className="text-sm font-bold text-emerald-600">
                      Bio Page Link Clicks
                    </p>
                    <p className="mt-1 text-3xl font-black text-slate-950">
                      {formatNumber(totalPageLinkClicks)}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-amber-50 p-4">
                    <p className="text-sm font-bold text-amber-600">
                      Bio Page CTR
                    </p>
                    <p className="mt-1 text-3xl font-black text-slate-950">
                      {formatPercent(bioPageCtr)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <section className="grid gap-6 xl:grid-cols-3">
            <Card className="rounded-[2rem] border-slate-200 bg-white shadow-sm xl:col-span-2">
              <CardContent className="p-6">
                <div className="mb-6 flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-black text-slate-950">
                      Top Smart Links
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Best-performing links by total clicks
                    </p>
                  </div>

                  <Button variant="outline" size="sm" asChild>
                    <Link href="/dashboard/analytics">
                      View All
                      <ArrowRight className="ml-2 size-4" />
                    </Link>
                  </Button>
                </div>

                {topLinks.length === 0 ? (
                  <EmptyState message="No top links yet. Create and share links to start collecting click analytics." />
                ) : (
                  <div className="space-y-3">
                    {topLinks.map((link) => (
                      <div
                        key={link.linkId}
                        className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:bg-white hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="min-w-0">
                          <p className="font-black text-primary">
                            /{link.shortCode}
                          </p>

                          <p className="mt-1 max-w-xl truncate text-sm text-slate-500">
                            {link.originalUrl}
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-black text-emerald-600">
                            {formatNumber(link.clicks)} clicks
                          </div>

                          <Button variant="outline" size="sm" asChild>
                            <Link
                              href={`/dashboard/analytics/links/${link.linkId}`}
                            >
                              <ExternalLink className="size-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="rounded-[2rem] border-slate-200 bg-gradient-to-br from-cyan-50 via-white to-violet-50 shadow-sm">
              <CardContent className="p-6">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-black text-slate-950">
                      Device Mix
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Visitor device usage
                    </p>
                  </div>

                  <Smartphone className="size-7 text-primary" />
                </div>

                {devices.length === 0 ? (
                  <EmptyState message="No device data yet." />
                ) : (
                  <div className="space-y-5">
                    {devices.map((item) => (
                      <MiniBar
                        key={item.device}
                        label={item.device || "Unknown"}
                        value={item.total ?? 0}
                        maxValue={maxDeviceValue}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </section>

          <section className="grid gap-6 xl:grid-cols-3">
            <Card className="rounded-[2rem] border-slate-200 bg-white shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-xl font-black text-slate-950">
                  Top Campaigns
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Campaigns with highest link engagement
                </p>

                <div className="mt-6 space-y-3">
                  {topCampaigns.length === 0 ? (
                    <EmptyState message="No campaign activity yet." />
                  ) : (
                    topCampaigns.map((campaign) => (
                      <div
                        key={campaign.campaignId}
                        className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate font-black text-slate-950">
                              {campaign.name}
                            </p>

                            <span
                              className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-bold capitalize ring-1 ${getStatusClass(
                                campaign.status,
                              )}`}
                            >
                              {campaign.status}
                            </span>
                          </div>

                          <p className="shrink-0 text-sm font-black text-primary">
                            {formatNumber(campaign.clicks)}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[2rem] border-slate-200 bg-white shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-xl font-black text-slate-950">
                  Browser Breakdown
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Most used browsers
                </p>

                <div className="mt-6 space-y-5">
                  {browsers.length === 0 ? (
                    <EmptyState message="No browser data yet." />
                  ) : (
                    browsers.map((item) => (
                      <MiniBar
                        key={item.browser}
                        label={item.browser || "Unknown"}
                        value={item.total ?? 0}
                        maxValue={maxBrowserValue}
                      />
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[2rem] border-slate-200 bg-white shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-xl font-black text-slate-950">
                  Traffic Sources
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Referrers sending visitors
                </p>

                <div className="mt-6 space-y-5">
                  {referrers.length === 0 ? (
                    <EmptyState message="No referrer data yet." />
                  ) : (
                    referrers.map((item) => (
                      <MiniBar
                        key={item.referrer}
                        label={item.referrer || "Direct"}
                        value={item.total ?? 0}
                        maxValue={maxReferrerValue}
                      />
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </section>

          <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {quickActions.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="group rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div
                  className={`mb-5 flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br ${item.gradient} text-white shadow-lg`}
                >
                  <item.icon className="size-6" />
                </div>

                <h3 className="font-black text-slate-950">{item.title}</h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {item.description}
                </p>

                <div className="mt-4 flex items-center gap-2 text-sm font-black text-primary">
                  Open
                  <ArrowRight className="size-4 transition group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </section>

          <section className="rounded-[2rem] border border-slate-200 bg-slate-950 p-6 text-white shadow-xl">
            <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <div className="mb-2 flex items-center gap-2 text-sm font-bold text-cyan-300">
                  <Globe2 className="size-4" />
                  Business Recommendation
                </div>

                <h3 className="text-2xl font-black">
                  Keep your full analytics page as the deep-dive area.
                </h3>

                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
                  This dashboard gives the business summary after login. The
                  Analytics page should remain the detailed reporting center for
                  charts, top links, campaigns, bio pages, devices, browsers and
                  referrers.
                </p>
              </div>

              <Button
                asChild
                className="rounded-2xl bg-white text-slate-950 hover:bg-slate-100"
              >
                <Link href="/dashboard/analytics">
                  Open Analytics
                  <BarChart3 className="ml-2 size-4" />
                </Link>
              </Button>
            </div>
          </section>
        </>
      )}

      <Button
        type="button"
        variant="outline"
        onClick={loadDashboard}
        disabled={isLoading}
        className="fixed bottom-6 right-6 z-20 rounded-2xl bg-white shadow-xl"
      >
        {isLoading ? (
          <Loader2 className="mr-2 size-4 animate-spin" />
        ) : (
          <RefreshCcw className="mr-2 size-4" />
        )}
        Refresh
      </Button>
    </div>
  );
}
