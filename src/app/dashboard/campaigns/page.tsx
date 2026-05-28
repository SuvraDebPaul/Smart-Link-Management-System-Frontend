"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  CalendarDays,
  Eye,
  Megaphone,
  Pencil,
  Plus,
  Target,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { routes } from "@/constants/route";
import { CampaignService } from "@/services/campaign.service";
import type { TCampaign } from "@/types/campaign.type";
import { toast } from "sonner";

function formatDate(date?: string | null) {
  if (!date) return "Not set";

  return new Date(date).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getStatusClass(status: TCampaign["status"]) {
  if (status === "active") {
    return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  }

  if (status === "paused") {
    return "bg-amber-50 text-amber-700 ring-amber-200";
  }

  return "bg-slate-100 text-slate-700 ring-slate-200";
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<TCampaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [deleteTargetCampaignId, setDeleteTargetCampaignId] = useState<
    string | null
  >(null);
  const [isDeletingCampaign, setIsDeletingCampaign] = useState(false);

  const loadCampaigns = async () => {
    try {
      setIsLoading(true);

      const res = await CampaignService.getAllCampaigns();

      setCampaigns(res.data);
    } catch (error) {
      console.error(error);
      alert(
        error instanceof Error ? error.message : "Failed to load campaigns",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCampaign = async () => {
    if (!deleteTargetCampaignId) return;

    try {
      setIsDeletingCampaign(true);

      await CampaignService.deleteCampaign(deleteTargetCampaignId);

      setCampaigns((prev) =>
        prev.filter((campaign) => campaign.id !== deleteTargetCampaignId),
      );

      toast.success("Campaign deleted successfully");

      setDeleteTargetCampaignId(null);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to delete campaign",
      );
    } finally {
      setIsDeletingCampaign(false);
    }
  };

  useEffect(() => {
    loadCampaigns();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-indigo-600">
            <Megaphone className="h-4 w-4" />
            Campaign Management
          </div>

          <h1 className="text-2xl font-bold text-slate-900">Campaigns</h1>

          <p className="mt-1 max-w-2xl text-sm text-slate-500">
            Group your shortened URLs into campaigns and track marketing
            performance in one place.
          </p>
        </div>

        <Button asChild>
          <Link href={routes.createCampaign}>
            <Plus className="mr-2 h-4 w-4" />
            Create Campaign
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Loading campaigns...</p>
        </div>
      ) : campaigns.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
            <Megaphone className="h-6 w-6" />
          </div>

          <h2 className="mt-4 text-lg font-semibold text-slate-900">
            No campaigns created yet
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
            Create your first campaign to organize your existing shortened URLs.
          </p>

          <Button asChild className="mt-5">
            <Link href={routes.createCampaign}>
              <Plus className="mr-2 h-4 w-4" />
              Create Campaign
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {campaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize ring-1 ${getStatusClass(
                      campaign.status,
                    )}`}
                  >
                    {campaign.status}
                  </span>

                  <h2 className="mt-3 truncate text-lg font-semibold text-slate-900">
                    {campaign.name}
                  </h2>

                  <p className="mt-1 line-clamp-2 min-h-[40px] text-sm text-slate-500">
                    {campaign.description || "No description added."}
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-3 rounded-xl bg-slate-50 p-4 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2 text-slate-500">
                    <CalendarDays className="h-4 w-4" />
                    Start
                  </span>

                  <span className="font-medium text-slate-800">
                    {formatDate(campaign.startDate)}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2 text-slate-500">
                    <CalendarDays className="h-4 w-4" />
                    End
                  </span>

                  <span className="font-medium text-slate-800">
                    {formatDate(campaign.endDate)}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2 text-slate-500">
                    <Target className="h-4 w-4" />
                    Goal Clicks
                  </span>

                  <span className="font-medium text-slate-800">
                    {campaign.goalClicks ?? "Not set"}
                  </span>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between gap-2 border-t border-slate-100 pt-4">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/dashboard/campaigns/${campaign.id}`}>
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </Link>
                </Button>

                <div className="flex gap-2">
                  <Button variant="outline" size="icon" asChild>
                    <Link href={`/dashboard/campaigns/${campaign.id}/edit`}>
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </Button>

                  <Button
                    variant="outline"
                    size="icon"
                    disabled={isDeletingCampaign}
                    onClick={() => setDeleteTargetCampaignId(campaign.id)}
                    className="text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {deleteTargetCampaignId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-slate-900">
              Delete this campaign?
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              This campaign will be deleted, but your smart links will not be
              deleted. They will only be removed from this campaign.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDeleteTargetCampaignId(null)}
                disabled={isDeletingCampaign}
              >
                Cancel
              </Button>

              <Button
                type="button"
                onClick={handleDeleteCampaign}
                disabled={isDeletingCampaign}
                className="bg-rose-600 text-white hover:bg-rose-700"
              >
                {isDeletingCampaign ? "Deleting..." : "Delete Campaign"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
