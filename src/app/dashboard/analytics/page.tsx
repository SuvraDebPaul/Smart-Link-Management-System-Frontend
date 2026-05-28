"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  Activity,
  BarChart3,
  CalendarDays,
  ExternalLink,
  Globe2,
  Layers3,
  Link2,
  Loader2,
  MousePointerClick,
  RefreshCcw,
  Smartphone,
  TrendingUp,
  Users,
  WalletCards,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { AnalyticsService } from "@/services/analytics.service";
import type {
  TAnalyticsOverview,
  TDateFilterParams,
} from "@/types/analytics.type";

function formatDateForApi(date: string) {
  if (!date) return undefined;
  return new Date(date).toISOString();
}

function formatNumber(value?: number | null) {
  return new Intl.NumberFormat("en-US").format(value ?? 0);
}

function getPercentage(value?: number | null) {
  return `${value ?? 0}%`;
}

function getLinkStatusClass(isActive: boolean) {
  return isActive
    ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
    : "bg-slate-100 text-slate-600 ring-slate-200";
}

function getCampaignStatusClass(status: string) {
  if (status === "active") {
    return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  }

  if (status === "paused") {
    return "bg-amber-50 text-amber-700 ring-amber-200";
  }

  return "bg-slate-100 text-slate-600 ring-slate-200";
}

function getMaxValue(values: number[]) {
  const max = Math.max(...values, 0);
  return max <= 0 ? 1 : max;
}

function safeArray<T>(value?: T[]) {
  return Array.isArray(value) ? value : [];
}

type SummaryCardProps = {
  title: string;
  value: string | number;
  description: string;
  icon: React.ElementType;
  iconClassName: string;
};

function SummaryCard({
  title,
  value,
  description,
  icon: Icon,
  iconClassName,
}: SummaryCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>

          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            {value}
          </h2>

          <p className="mt-2 text-xs text-slate-500">{description}</p>
        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${iconClassName}`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

type EmptyStateProps = {
  title: string;
  description: string;
};

function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="p-8 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
        <BarChart3 className="h-6 w-6" />
      </div>

      <h3 className="mt-4 text-base font-semibold text-slate-900">{title}</h3>

      <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
        {description}
      </p>
    </div>
  );
}

type SectionCardProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

function SectionCard({ title, description, children }: SectionCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 p-5">
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>

        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>

      {children}
    </div>
  );
}

type BreakdownItemProps = {
  label: string;
  value: number;
  maxValue: number;
};

function BreakdownItem({ label, value, maxValue }: BreakdownItemProps) {
  const width = Math.max((value / maxValue) * 100, value > 0 ? 6 : 0);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3 text-sm">
        <span className="max-w-[180px] truncate font-medium text-slate-700">
          {label}
        </span>

        <span className="font-semibold text-slate-900">
          {formatNumber(value)}
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-indigo-500"
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const [overview, setOverview] = useState<TAnalyticsOverview | null>(null);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [isLoading, setIsLoading] = useState(true);

  const loadOverview = async (params?: TDateFilterParams) => {
    try {
      setIsLoading(true);

      const response = await AnalyticsService.getOverview(params);

      if (!response.success || !response.data) {
        toast.error(response.message || "Failed to load analytics");
        return;
      }

      setOverview(response.data);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to load analytics");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyFilter = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await loadOverview({
      startDate: formatDateForApi(startDate),
      endDate: formatDateForApi(endDate),
    });
  };

  const handleResetFilter = async () => {
    setStartDate("");
    setEndDate("");

    await loadOverview();
  };

  useEffect(() => {
    loadOverview();
  }, []);

  const dailyActivity = useMemo(
    () => safeArray(overview?.dailyActivity),
    [overview],
  );

  const topLinks = useMemo(() => safeArray(overview?.topLinks), [overview]);

  const topCampaigns = useMemo(
    () => safeArray(overview?.topCampaigns),
    [overview],
  );

  const topPages = useMemo(() => safeArray(overview?.topPages), [overview]);

  const devices = useMemo(() => safeArray(overview?.devices), [overview]);
  const browsers = useMemo(() => safeArray(overview?.browsers), [overview]);
  const referrers = useMemo(() => safeArray(overview?.referrers), [overview]);

  const maxDailyValue = useMemo(() => {
    return getMaxValue(
      dailyActivity.flatMap((item) => [item.clicks ?? 0, item.visits ?? 0]),
    );
  }, [dailyActivity]);

  const maxDeviceValue = useMemo(() => {
    return getMaxValue(devices.map((item) => item.total ?? 0));
  }, [devices]);

  const maxBrowserValue = useMemo(() => {
    return getMaxValue(browsers.map((item) => item.total ?? 0));
  }, [browsers]);

  const maxReferrerValue = useMemo(() => {
    return getMaxValue(referrers.map((item) => item.total ?? 0));
  }, [referrers]);

  const totalPageVisits = overview?.totalPageVisits ?? 0;
  const totalPageLinkClicks = overview?.totalPageLinkClicks ?? 0;

  const bioPageCtr =
    overview?.bioPageCtr ??
    (totalPageVisits > 0
      ? Math.round((totalPageLinkClicks / totalPageVisits) * 100)
      : 0);

  const conversionRate = overview?.conversionRate ?? 0;

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="relative p-6">
          <div className="absolute right-0 top-0 h-32 w-32 rounded-bl-full bg-indigo-50" />

          <div className="relative flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div>
              <div className="mb-2 flex items-center gap-2 text-sm font-medium text-indigo-600">
                <BarChart3 className="h-4 w-4" />
                Analytics Command Center
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Analytics Overview
              </h1>

              <p className="mt-1 max-w-3xl text-sm text-slate-500">
                Monitor link clicks, campaigns, bio page visits, audience
                behavior, devices, browsers, and top-performing assets from one
                dashboard.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button variant="outline" asChild>
                <Link href="/dashboard/links">
                  <Link2 className="mr-2 h-4 w-4" />
                  Links
                </Link>
              </Button>

              <Button variant="outline" asChild>
                <Link href="/dashboard/campaigns">
                  <Layers3 className="mr-2 h-4 w-4" />
                  Campaigns
                </Link>
              </Button>

              <Button asChild>
                <Link href="/dashboard/pages">
                  <WalletCards className="mr-2 h-4 w-4" />
                  Bio Pages
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleApplyFilter}
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Filter Analytics
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Choose a date range to analyze clicks, visits, devices, browsers,
              and referrers.
            </p>
          </div>

          <div className="grid flex-1 gap-3 md:grid-cols-[1fr_1fr_auto_auto]">
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                <CalendarDays className="h-4 w-4 text-slate-400" />
                Start Date
              </label>

              <input
                type="date"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                <CalendarDays className="h-4 w-4 text-slate-400" />
                End Date
              </label>

              <input
                type="date"
                value={endDate}
                onChange={(event) => setEndDate(event.target.value)}
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
              />
            </div>

            <Button type="submit" disabled={isLoading} className="mt-7 h-11">
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Activity className="mr-2 h-4 w-4" />
              )}
              Apply
            </Button>

            <Button
              type="button"
              variant="outline"
              disabled={isLoading}
              onClick={handleResetFilter}
              className="mt-7 h-11"
            >
              <RefreshCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
          </div>
        </div>
      </form>

      {isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading analytics...
          </div>
        </div>
      ) : !overview ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Analytics not available
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            We could not load your analytics overview.
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <SummaryCard
              title="Total Clicks"
              value={formatNumber(overview.totalClicks)}
              description="All smart link click events"
              icon={MousePointerClick}
              iconClassName="bg-indigo-50 text-indigo-600"
            />

            <SummaryCard
              title="Total Links"
              value={formatNumber(overview.totalLinks)}
              description={`${formatNumber(overview.activeLinks)} active links`}
              icon={Link2}
              iconClassName="bg-cyan-50 text-cyan-600"
            />

            <SummaryCard
              title="Total Campaigns"
              value={formatNumber(overview.totalCampaigns)}
              description="Marketing campaign groups"
              icon={Layers3}
              iconClassName="bg-violet-50 text-violet-600"
            />

            <SummaryCard
              title="Bio Page Visits"
              value={formatNumber(totalPageVisits)}
              description="Total visits across bio pages"
              icon={WalletCards}
              iconClassName="bg-emerald-50 text-emerald-600"
            />

            <SummaryCard
              title="Active Links"
              value={formatNumber(overview.activeLinks)}
              description={`${formatNumber(overview.inactiveLinks)} inactive links`}
              icon={Activity}
              iconClassName="bg-emerald-50 text-emerald-600"
            />

            <SummaryCard
              title="Bio Link Clicks"
              value={formatNumber(totalPageLinkClicks)}
              description="Clicks inside bio pages"
              icon={TrendingUp}
              iconClassName="bg-amber-50 text-amber-600"
            />

            <SummaryCard
              title="Unique Visitors"
              value={formatNumber(overview.uniqueVisitors)}
              description="Based on unique IP tracking"
              icon={Users}
              iconClassName="bg-rose-50 text-rose-600"
            />

            <SummaryCard
              title="Bio Page CTR"
              value={getPercentage(bioPageCtr)}
              description={`Conversion rate: ${getPercentage(conversionRate)}`}
              icon={BarChart3}
              iconClassName="bg-slate-100 text-slate-700"
            />
          </div>

          <SectionCard
            title="Daily Activity"
            description="Compare smart link clicks and bio page visits over time."
          >
            {dailyActivity.length === 0 ? (
              <EmptyState
                title="No daily activity yet"
                description="Clicks and visits will appear here once users start interacting with your links and bio pages."
              />
            ) : (
              <div className="p-5">
                <div className="mb-5 flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center gap-2 text-slate-600">
                    <span className="h-3 w-3 rounded-full bg-indigo-500" />
                    Link Clicks
                  </div>

                  <div className="flex items-center gap-2 text-slate-600">
                    <span className="h-3 w-3 rounded-full bg-emerald-500" />
                    Bio Page Visits
                  </div>
                </div>

                <div className="flex h-72 items-end gap-3 overflow-x-auto rounded-2xl bg-slate-50 p-4">
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
                        className="flex min-w-[72px] flex-1 flex-col items-center justify-end gap-2"
                      >
                        <div className="flex h-52 items-end gap-1">
                          <div
                            title={`${item.clicks ?? 0} clicks`}
                            className="w-4 rounded-t-lg bg-indigo-500"
                            style={{ height: `${clickHeight}%` }}
                          />

                          <div
                            title={`${item.visits ?? 0} visits`}
                            className="w-4 rounded-t-lg bg-emerald-500"
                            style={{ height: `${visitHeight}%` }}
                          />
                        </div>

                        <span className="text-[11px] font-medium text-slate-500">
                          {item.date.slice(5)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </SectionCard>

          <div className="grid gap-6 xl:grid-cols-2">
            <SectionCard
              title="Top Performing Links"
              description="Your best smart links based on total clicks."
            >
              {topLinks.length === 0 ? (
                <EmptyState
                  title="No click data yet"
                  description="Once your smart links receive clicks, top links will appear here."
                />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase text-slate-500">
                      <tr>
                        <th className="px-5 py-4">Short Code</th>
                        <th className="px-5 py-4">Original URL</th>
                        <th className="px-5 py-4">Status</th>
                        <th className="px-5 py-4">Clicks</th>
                        <th className="px-5 py-4 text-right">Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {topLinks.map((link) => (
                        <tr
                          key={link.linkId}
                          className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50"
                        >
                          <td className="px-5 py-4 font-medium text-slate-900">
                            {link.shortCode}
                          </td>

                          <td className="max-w-[240px] px-5 py-4">
                            <p className="truncate text-slate-600">
                              {link.originalUrl}
                            </p>
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${getLinkStatusClass(
                                link.isActive,
                              )}`}
                            >
                              {link.isActive ? "Active" : "Inactive"}
                            </span>
                          </td>

                          <td className="px-5 py-4 font-semibold text-slate-900">
                            {formatNumber(link.clicks)}
                          </td>

                          <td className="px-5 py-4">
                            <div className="flex justify-end">
                              <Button variant="outline" size="sm" asChild>
                                <Link
                                  href={`/dashboard/analytics/links/${link.linkId}`}
                                >
                                  <ExternalLink className="mr-2 h-4 w-4" />
                                  View
                                </Link>
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </SectionCard>

            <SectionCard
              title="Top Campaigns"
              description="Campaigns generating the highest smart link clicks."
            >
              {topCampaigns.length === 0 ? (
                <EmptyState
                  title="No campaign activity yet"
                  description="Campaign performance will appear here when campaign links receive clicks."
                />
              ) : (
                <div className="divide-y divide-slate-100">
                  {topCampaigns.map((campaign) => (
                    <div
                      key={campaign.campaignId}
                      className="flex items-center justify-between gap-4 p-5 hover:bg-slate-50"
                    >
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="truncate font-semibold text-slate-900">
                            {campaign.name}
                          </h3>

                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize ring-1 ${getCampaignStatusClass(
                              campaign.status,
                            )}`}
                          >
                            {campaign.status}
                          </span>
                        </div>

                        <p className="mt-1 text-sm text-slate-500">
                          {formatNumber(campaign.clicks)} clicks
                        </p>
                      </div>

                      <Button variant="outline" size="sm" asChild>
                        <Link
                          href={`/dashboard/analytics/campaigns/${campaign.campaignId}`}
                        >
                          <ExternalLink className="mr-2 h-4 w-4" />
                          View
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </SectionCard>
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <SectionCard
              title="Top Bio Pages"
              description="Bio pages ranked by visits and internal link clicks."
            >
              {topPages.length === 0 ? (
                <EmptyState
                  title="No bio page activity yet"
                  description="Bio page visits and link clicks will appear here after visitors interact with your pages."
                />
              ) : (
                <div className="divide-y divide-slate-100">
                  {topPages.map((page) => (
                    <div
                      key={page.pageId}
                      className="flex items-center justify-between gap-4 p-5 hover:bg-slate-50"
                    >
                      <div className="min-w-0">
                        <h3 className="truncate font-semibold text-slate-900">
                          {page.title}
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                          /{page.slug}
                        </p>

                        <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500">
                          <span>{formatNumber(page.visits)} visits</span>
                          <span>
                            {formatNumber(page.linkClicks)} link clicks
                          </span>
                        </div>
                      </div>

                      <Button variant="outline" size="sm" asChild>
                        <Link
                          href={`/dashboard/analytics/pages/${page.pageId}`}
                        >
                          <ExternalLink className="mr-2 h-4 w-4" />
                          View
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </SectionCard>

            <SectionCard
              title="Device Breakdown"
              description="Understand whether your traffic comes from mobile, desktop, tablet, or unknown devices."
            >
              {devices.length === 0 ? (
                <EmptyState
                  title="No device data yet"
                  description="Device analytics will appear once clicks or visits are tracked."
                />
              ) : (
                <div className="space-y-5 p-5">
                  {devices.map((item) => (
                    <BreakdownItem
                      key={item.device ?? "Unknown"}
                      label={item.device ?? "Unknown"}
                      value={item.total ?? 0}
                      maxValue={maxDeviceValue}
                    />
                  ))}
                </div>
              )}
            </SectionCard>
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <SectionCard
              title="Browser Breakdown"
              description="See which browsers your visitors are using most."
            >
              {browsers.length === 0 ? (
                <EmptyState
                  title="No browser data yet"
                  description="Browser analytics will appear once users start visiting your links and pages."
                />
              ) : (
                <div className="space-y-5 p-5">
                  {browsers.map((item) => (
                    <BreakdownItem
                      key={item.browser ?? "Unknown"}
                      label={item.browser ?? "Unknown"}
                      value={item.total ?? 0}
                      maxValue={maxBrowserValue}
                    />
                  ))}
                </div>
              )}
            </SectionCard>

            <SectionCard
              title="Referrer Breakdown"
              description="Discover where your traffic is coming from."
            >
              {referrers.length === 0 ? (
                <EmptyState
                  title="No referrer data yet"
                  description="Referrer sources like Direct, Facebook, Google, and LinkedIn will appear here."
                />
              ) : (
                <div className="space-y-5 p-5">
                  {referrers.map((item) => (
                    <BreakdownItem
                      key={item.referrer ?? "Direct"}
                      label={item.referrer ?? "Direct"}
                      value={item.total ?? 0}
                      maxValue={maxReferrerValue}
                    />
                  ))}
                </div>
              )}
            </SectionCard>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Link
              href="/dashboard/analytics/links"
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                <Link2 className="h-5 w-5" />
              </div>

              <h3 className="mt-4 font-semibold text-slate-900">
                View Link Analytics
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Analyze individual smart link performance.
              </p>
            </Link>

            <Link
              href="/dashboard/campaigns"
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
                <Globe2 className="h-5 w-5" />
              </div>

              <h3 className="mt-4 font-semibold text-slate-900">
                View Campaign Analytics
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Track campaign groups and goal performance.
              </p>
            </Link>

            <Link
              href="/dashboard/pages"
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <Smartphone className="h-5 w-5" />
              </div>

              <h3 className="mt-4 font-semibold text-slate-900">
                View Bio Page Analytics
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Review visits, link clicks, and audience behavior.
              </p>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
