"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { CampaignForm } from "@/components/campaigns/CampaignForm";
import { CampaignService } from "@/services/campaign.service";
import { routes } from "@/constants/route";
import type { TCampaign, TCreateCampaignPayload } from "@/types/campaign.type";

export default function EditCampaignPage() {
  const params = useParams();
  const router = useRouter();

  const campaignId = params.id as string;

  const [campaign, setCampaign] = useState<TCampaign | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadCampaign = async () => {
    try {
      setIsLoading(true);

      const res = await CampaignService.getSingleCampaign(campaignId);

      setCampaign(res.data);
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Failed to load campaign");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateCampaign = async (payload: TCreateCampaignPayload) => {
    try {
      setIsSubmitting(true);

      await CampaignService.updateCampaign(campaignId, payload);

      router.push(`/dashboard/campaigns/${campaignId}`);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert(
        error instanceof Error ? error.message : "Failed to update campaign",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (campaignId) {
      loadCampaign();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaignId]);

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading campaign...
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
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center">
        <div>
          <div className="mb-3">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/dashboard/campaigns/${campaignId}`}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Campaign Details
              </Link>
            </Button>
          </div>

          <h1 className="text-2xl font-bold text-slate-900">Edit Campaign</h1>

          <p className="mt-1 text-sm text-slate-500">
            Update campaign information, timeline, status, and goal clicks.
          </p>
        </div>
      </div>

      <CampaignForm
        mode="edit"
        defaultValues={campaign}
        isSubmitting={isSubmitting}
        onSubmit={handleUpdateCampaign}
      />
    </div>
  );
}
