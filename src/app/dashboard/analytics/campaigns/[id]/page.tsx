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
  Target,
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
  TCampaignAnalytics,
  TDailyClick,
  TDateFilterParams,
  TDeviceClick,
  TReferrerClick,
} from "@/types/analytics.type";

function formatDateForApi(date: string) {
  if (!date) return undefined;
  return new Date(date).toISOString();
}

function getLabel(value?: string | null) {
  return value || "Unknown";
}

export default function CampaignAnalyticsPage() {
  const params = useParams();
  const campaignId = params.id as string;

  const [summary, setSummary] = useState<TCampaignAnalytics | null>(null);
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
        AnalyticsService.getCampaignAnalytics(campaignId, filterParams),
        AnalyticsService.getCampaignDailyClicks(campaignId, filterParams),
        AnalyticsService.getCampaignDevices(campaignId, filterParams),
        AnalyticsService.getCampaignBrowsers(campaignId, filterParams),
        AnalyticsService.getCampaignReferrers(campaignId, filterParams),
      ]);

      if (!summaryRes.success || !summaryRes.data) {
        toast.error(summaryRes.message || "Failed to load campaign analytics");
        return;
      }

      setSummary(summaryRes.data);
      setDailyClicks(dailyClicksRes.data || []);
      setDevices(devicesRes.data || []);
      setBrowsers(browsersRes.data || []);
      setReferrers(referrersRes.data || []);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to load campaign analytics",
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
    if (campaignId) {
      loadAnalytics();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaignId]);

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading campaign analytics...
        </div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900">
          Campaign analytics not found
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
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-indigo-600">
              <BarChart3 className="h-4 w-4" />
              Campaign Analytics
            </div>

            <h1 className="text-2xl font-bold text-slate-900">
              {summary.campaign.name}
            </h1>

            <p className="mt-2 max-w-3xl text-sm text-slate-500">
              {summary.campaign.description || "No campaign description."}
            </p>
          </div>

          <Button variant="outline" asChild>
            <Link href={`/dashboard/campaigns/${summary.campaign.id}`}>
              <ExternalLink className="mr-2 h-4 w-4" />
              View Campaign
            </Link>
          </Button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-4">
          <SummaryCard
            label="Total Links"
            value={summary.totalLinks}
            icon={<BarChart3 className="h-4 w-4" />}
          />

          <SummaryCard
            label="Total Clicks"
            value={summary.totalClicks}
            icon={<MousePointerClick className="h-4 w-4" />}
          />

          <SummaryCard
            label="Unique Visitors"
            value={summary.uniqueVisitors}
            icon={<Users className="h-4 w-4" />}
          />

          <SummaryCard
            label="Goal Progress"
            value={
              summary.goalProgress === null
                ? "Not set"
                : `${summary.goalProgress}%`
            }
            icon={<Target className="h-4 w-4" />}
          />
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
              Filter campaign analytics by date range.
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
        <h2 className="text-lg font-semibold text-slate-900">Daily Clicks</h2>

        <p className="mt-1 text-sm text-slate-500">
          Click performance from all links under this campaign.
        </p>

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

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-6">
          <h2 className="text-lg font-semibold text-slate-900">Top Links</h2>

          <p className="mt-1 text-sm text-slate-500">
            Top links inside this campaign based on clicks.
          </p>
        </div>

        {summary.topLinks.length === 0 ? (
          <div className="p-10 text-center text-sm text-slate-500">
            No top link data found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-6 py-4">Short Code</th>
                  <th className="px-6 py-4">Original URL</th>
                  <th className="px-6 py-4">Clicks</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>

              <tbody>
                {summary.topLinks.map((link) => (
                  <tr
                    key={link.linkId}
                    className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50"
                  >
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {link.shortCode}
                    </td>

                    <td className="max-w-md px-6 py-4">
                      <p className="truncate text-slate-600">
                        {link.originalUrl}
                      </p>
                    </td>

                    <td className="px-6 py-4 font-semibold text-slate-900">
                      {link.clicks}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end">
                        <Button variant="outline" size="sm" asChild>
                          <Link
                            href={`/dashboard/analytics/links/${link.linkId}`}
                          >
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Link Analytics
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
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number | string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="flex items-center gap-2 text-sm text-slate-500">
        {icon}
        {label}
      </p>
      <h2 className="mt-2 text-2xl font-bold text-slate-900">{value}</h2>
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
