"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  ExternalLink,
  Link2,
  Loader2,
  MousePointerClick,
  Pencil,
  Plus,
  Target,
  Trash2,
  X,
  BarChart3,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { routes } from "@/constants/route";
import { CampaignService } from "@/services/campaign.service";
import type { TCampaign } from "@/types/campaign.type";
import type { TLink } from "@/types/link.type";
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

function getLinkLabel(link: TLink) {
  return link.title || link.shortCode || link.originalUrl;
}

export default function CampaignDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const campaignId = params.id as string;

  const [campaign, setCampaign] = useState<TCampaign | null>(null);
  const [campaignLinks, setCampaignLinks] = useState<TLink[]>([]);
  const [availableLinks, setAvailableLinks] = useState<TLink[]>([]);
  const [selectedLinkId, setSelectedLinkId] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [isDeletingCampaign, setIsDeletingCampaign] = useState(false);
  const [showDeleteCampaignModal, setShowDeleteCampaignModal] = useState(false);

  const [removeTargetLinkId, setRemoveTargetLinkId] = useState<string | null>(
    null,
  );

  const totalClicks = useMemo(() => {
    return campaignLinks.reduce((sum, link) => {
      return sum + (link.totalClicks || link.clicks || 0);
    }, 0);
  }, [campaignLinks]);

  const loadCampaignDetails = async () => {
    try {
      setIsLoading(true);

      const [campaignRes, campaignLinksRes, availableLinksRes] =
        await Promise.all([
          CampaignService.getSingleCampaign(campaignId),
          CampaignService.getCampaignLinks(campaignId),
          CampaignService.getAvailableCampaignLinks(campaignId),
        ]);

      setCampaign(campaignRes.data);
      setCampaignLinks(campaignLinksRes.data);
      setAvailableLinks(availableLinksRes.data);
    } catch (error) {
      console.error(error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to load campaign details",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddLink = async () => {
    if (!selectedLinkId) {
      alert("Please select a link first");
      return;
    }

    try {
      setIsAdding(true);

      await CampaignService.addLinkToCampaign(campaignId, selectedLinkId);

      setSelectedLinkId("");
      await loadCampaignDetails();
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Failed to add link");
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveLink = async () => {
    if (!removeTargetLinkId) return;

    try {
      setRemovingId(removeTargetLinkId);

      await CampaignService.removeLinkFromCampaign(
        campaignId,
        removeTargetLinkId,
      );

      toast.success("URL removed from campaign successfully");

      setRemoveTargetLinkId(null);
      await loadCampaignDetails();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to remove URL from campaign",
      );
    } finally {
      setRemovingId(null);
    }
  };

  const handleDeleteCampaign = async () => {
    try {
      setIsDeletingCampaign(true);

      await CampaignService.deleteCampaign(campaignId);

      toast.success("Campaign deleted successfully");

      setShowDeleteCampaignModal(false);

      router.push(routes.campaigns);
      router.refresh();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to delete campaign",
      );
    } finally {
      setIsDeletingCampaign(false);
    }
  };

  useEffect(() => {
    if (campaignId) {
      loadCampaignDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaignId]);

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading campaign details...
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900">
          Campaign not found
        </h1>

        <Button asChild className="mt-5">
          <Link href={routes.campaigns}>Back to Campaigns</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5">
          <Button variant="outline" size="sm" asChild>
            <Link href={routes.campaigns}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Campaigns
            </Link>
          </Button>
        </div>

        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
          <div className="min-w-0">
            <span
              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize ring-1 ${getStatusClass(
                campaign.status,
              )}`}
            >
              {campaign.status}
            </span>

            <h1 className="mt-3 text-2xl font-bold text-slate-900">
              {campaign.name}
            </h1>

            <p className="mt-2 max-w-3xl text-sm text-slate-500">
              {campaign.description || "No campaign description added."}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button asChild>
              <Link href={`/dashboard/links/create?campaignId=${campaign.id}`}>
                <Plus className="mr-2 h-4 w-4" />
                Add Links
              </Link>
            </Button>

            <Button variant="outline" asChild>
              <Link href={`/dashboard/campaigns/${campaign.id}/edit`}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </Button>

            <Button variant="outline" asChild>
              <Link href={`/dashboard/analytics/campaigns/${campaign.id}`}>
                <BarChart3 className="mr-2 h-4 w-4" />
                Analytics
              </Link>
            </Button>

            <Button
              variant="outline"
              disabled={isDeletingCampaign}
              onClick={() => setShowDeleteCampaignModal(true)}
              className="text-rose-600 hover:bg-rose-50 hover:text-rose-700"
            >
              {isDeletingCampaign ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              Delete
            </Button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="flex items-center gap-2 text-sm text-slate-500">
              <Link2 className="h-4 w-4" />
              Total Links
            </p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">
              {campaignLinks.length}
            </h2>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="flex items-center gap-2 text-sm text-slate-500">
              <MousePointerClick className="h-4 w-4" />
              Total Clicks
            </p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">
              {totalClicks}
            </h2>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="flex items-center gap-2 text-sm text-slate-500">
              <Target className="h-4 w-4" />
              Goal Clicks
            </p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">
              {campaign.goalClicks ?? "Not set"}
            </h2>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="flex items-center gap-2 text-sm text-slate-500">
              <CalendarDays className="h-4 w-4" />
              Timeline
            </p>
            <h2 className="mt-2 text-sm font-semibold text-slate-900">
              {formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}
            </h2>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Add Existing URL
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Select one of your existing shortened URLs and add it to this
              campaign.
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 md:flex-row">
          <select
            value={selectedLinkId}
            onChange={(event) => setSelectedLinkId(event.target.value)}
            className="min-h-11 flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
          >
            <option value="">Select available URL</option>

            {availableLinks.map((link) => {
              const linkId = link.id || link._id;
              return (
                <option key={linkId} value={linkId}>
                  {getLinkLabel(link)} — {link.originalUrl}
                </option>
              );
            })}
          </select>

          <Button
            type="button"
            onClick={handleAddLink}
            disabled={isAdding || !selectedLinkId}
          >
            {isAdding ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Plus className="mr-2 h-4 w-4" />
            )}
            Add URL
          </Button>
        </div>

        {availableLinks.length === 0 && (
          <p className="mt-3 text-sm text-slate-500">
            No available URLs found. Create a new short URL without campaign or
            remove a URL from another campaign first.
          </p>
        )}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-6">
          <h2 className="text-lg font-semibold text-slate-900">
            URLs in this Campaign
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            These shortened URLs are currently grouped under this campaign.
          </p>
        </div>

        {campaignLinks.length === 0 ? (
          <div className="p-10 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <Link2 className="h-6 w-6" />
            </div>

            <h3 className="mt-4 text-lg font-semibold text-slate-900">
              No URLs added yet
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              Use the dropdown above to add your existing shortened URLs to this
              campaign.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-6 py-4">Short URL</th>
                  <th className="px-6 py-4">Original URL</th>
                  <th className="px-6 py-4">Clicks</th>
                  <th className="px-6 py-4">Created</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>

              <tbody>
                {campaignLinks.map((link) => {
                  const linkId = link.id || link._id;
                  const clicks = link.totalClicks || link.clicks || 0;
                  return (
                    <tr
                      key={linkId}
                      className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50"
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900">
                          {link.shortCode}
                        </div>

                        {link.shortUrl && (
                          <a
                            href={link.shortUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-1 inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700"
                          >
                            Open short link
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </td>

                      <td className="max-w-sm px-6 py-4">
                        <p className="truncate text-slate-600">
                          {link.originalUrl}
                        </p>
                      </td>

                      <td className="px-6 py-4 font-medium text-slate-800">
                        {clicks}
                      </td>

                      <td className="px-6 py-4 text-slate-500">
                        {formatDate(link.createdAt)}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/dashboard/links/${linkId}`}>
                              View
                            </Link>
                          </Button>

                          <Button
                            variant="outline"
                            size="sm"
                            disabled={removingId === linkId}
                            onClick={() =>
                              setRemoveTargetLinkId(linkId as string)
                            }
                            className="text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                          >
                            {removingId === linkId ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                              <X className="mr-2 h-4 w-4" />
                            )}
                            Remove
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {removeTargetLinkId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-slate-900">
              Remove URL from campaign?
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              This URL will only be removed from the campaign. The smart link
              itself will not be deleted.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setRemoveTargetLinkId(null)}
                disabled={Boolean(removingId)}
              >
                Cancel
              </Button>

              <Button
                type="button"
                onClick={handleRemoveLink}
                disabled={Boolean(removingId)}
                className="bg-rose-600 text-white hover:bg-rose-700"
              >
                {removingId ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Removing...
                  </>
                ) : (
                  <>
                    <X className="mr-2 h-4 w-4" />
                    Remove URL
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
      {showDeleteCampaignModal && (
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
                onClick={() => setShowDeleteCampaignModal(false)}
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
                {isDeletingCampaign ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Campaign
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
