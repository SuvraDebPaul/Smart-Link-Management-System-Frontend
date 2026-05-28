"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import {
  ArrowLeft,
  BarChart3,
  CalendarDays,
  ExternalLink,
  Laptop,
  Loader2,
  MousePointerClick,
  RefreshCcw,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Button } from "@/components/ui/button";
import { AnalyticsService } from "@/services/analytics.service";
import type {
  TBrowserClick,
  TDailyClick,
  TDateFilterParams,
  TDeviceClick,
  TLinkAnalyticsSummary,
  TReferrerClick,
} from "@/types/analytics.type";

function formatDateForApi(date: string) {
  if (!date) return undefined;

  return new Date(date).toISOString();
}

function formatDate(date?: string | null) {
  if (!date) return "Not available";

  return new Date(date).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getLabel(value?: string | null) {
  return value || "Unknown";
}

export default function LinkAnalyticsPage() {
  const params = useParams();
  const linkId = params.id as string;

  const [summary, setSummary] = useState<TLinkAnalyticsSummary | null>(null);
  const [dailyClicks, setDailyClicks] = useState<TDailyClick[]>([]);
  const [devices, setDevices] = useState<TDeviceClick[]>([]);
  const [browsers, setBrowsers] = useState<TBrowserClick[]>([]);
  const [referrers, setReferrers] = useState<TReferrerClick[]>([]);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [isLoading, setIsLoading] = useState(true);

  const loadAnalytics = async (filterParams?: TDateFilterParams) => {
    try {
      setIsLoading(true);

      const [
        summaryRes,
        dailyClicksRes,
        devicesRes,
        browsersRes,
        referrersRes,
      ] = await Promise.all([
        AnalyticsService.getLinkAnalytics(linkId, filterParams),
        AnalyticsService.getLinkDailyClicks(linkId, filterParams),
        AnalyticsService.getLinkDevices(linkId, filterParams),
        AnalyticsService.getLinkBrowsers(linkId, filterParams),
        AnalyticsService.getLinkReferrers(linkId, filterParams),
      ]);

      if (!summaryRes.success || !summaryRes.data) {
        toast.error(summaryRes.message || "Failed to load link analytics");
        return;
      }

      setSummary(summaryRes.data);
      setDailyClicks(dailyClicksRes.data || []);
      setDevices(devicesRes.data || []);
      setBrowsers(browsersRes.data || []);
      setReferrers(referrersRes.data || []);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to load link analytics",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyFilter = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await loadAnalytics({
      startDate: formatDateForApi(startDate),
      endDate: formatDateForApi(endDate),
    });
  };

  const handleResetFilter = async () => {
    setStartDate("");
    setEndDate("");

    await loadAnalytics();
  };

  useEffect(() => {
    if (linkId) {
      loadAnalytics();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [linkId]);

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading link analytics...
        </div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900">
          Link analytics not found
        </h1>

        <Button asChild className="mt-5">
          <Link href="/dashboard/analytics">Back to Analytics</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/analytics">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Analytics
            </Link>
          </Button>
        </div>

        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
          <div className="min-w-0">
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-indigo-600">
              <BarChart3 className="h-4 w-4" />
              Link Analytics
            </div>

            <h1 className="text-2xl font-bold text-slate-900">
              {summary.link.shortCode}
            </h1>

            <p className="mt-2 max-w-3xl truncate text-sm text-slate-500">
              {summary.link.originalUrl}
            </p>
          </div>

          <Button variant="outline" asChild>
            <Link href={`/dashboard/links/${summary.link.id}`}>
              <ExternalLink className="mr-2 h-4 w-4" />
              View Link
            </Link>
          </Button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="flex items-center gap-2 text-sm text-slate-500">
              <MousePointerClick className="h-4 w-4" />
              Total Clicks
            </p>

            <h2 className="mt-2 text-2xl font-bold text-slate-900">
              {summary.totalClicks}
            </h2>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="flex items-center gap-2 text-sm text-slate-500">
              <Users className="h-4 w-4" />
              Unique Visitors
            </p>

            <h2 className="mt-2 text-2xl font-bold text-slate-900">
              {summary.uniqueVisitors}
            </h2>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Status</p>

            <h2 className="mt-2 text-sm font-semibold text-slate-900">
              {summary.link.isActive ? "Active" : "Inactive"}
            </h2>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Last Click</p>

            <h2 className="mt-2 text-sm font-semibold text-slate-900">
              {formatDate(summary.lastClick?.clickedAt)}
            </h2>
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
              Date Filter
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Filter this link&apos;s analytics by date range.
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

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Daily Clicks</h2>

          <p className="mt-1 text-sm text-slate-500">
            Click performance for this link over time.
          </p>
        </div>

        <div className="mt-6 h-72">
          {dailyClicks.length === 0 ? (
            <div className="flex h-full items-center justify-center rounded-xl bg-slate-50 text-sm text-slate-500">
              No daily click data found.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyClicks}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" tickLine={false} axisLine={false} />
                <YAxis
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip />
                <Bar dataKey="clicks" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <BreakdownCard
          title="Devices"
          icon={<Laptop className="h-4 w-4" />}
          emptyText="No device data found."
          rows={devices.map((item) => ({
            label: getLabel(item.device),
            value: item.clicks,
          }))}
        />

        <BreakdownCard
          title="Browsers"
          icon={<BarChart3 className="h-4 w-4" />}
          emptyText="No browser data found."
          rows={browsers.map((item) => ({
            label: getLabel(item.browser),
            value: item.clicks,
          }))}
        />

        <BreakdownCard
          title="Referrers"
          icon={<ExternalLink className="h-4 w-4" />}
          emptyText="No referrer data found."
          rows={referrers.map((item) => ({
            label: getLabel(item.referrer),
            value: item.clicks,
          }))}
        />
      </div>
    </div>
  );
}

function BreakdownCard({
  title,
  icon,
  rows,
  emptyText,
}: {
  title: string;
  icon: React.ReactNode;
  rows: { label: string; value: number }[];
  emptyText: string;
}) {
  const total = rows.reduce((sum, row) => sum + row.value, 0);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          {icon}
        </div>

        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      </div>

      {rows.length === 0 ? (
        <div className="mt-5 rounded-xl bg-slate-50 p-5 text-center text-sm text-slate-500">
          {emptyText}
        </div>
      ) : (
        <div className="mt-5 space-y-4">
          {rows.map((row) => {
            const percentage = total
              ? Math.round((row.value / total) * 100)
              : 0;

            return (
              <div key={row.label}>
                <div className="mb-1 flex items-center justify-between gap-3 text-sm">
                  <span className="truncate font-medium text-slate-700">
                    {row.label}
                  </span>

                  <span className="font-semibold text-slate-900">
                    {row.value}
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-indigo-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
