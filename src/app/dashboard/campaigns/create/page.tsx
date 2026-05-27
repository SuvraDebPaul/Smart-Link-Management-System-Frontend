"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { CampaignForm } from "@/components/campaigns/CampaignForm";
import { CampaignService } from "@/services/campaign.service";
import { routes } from "@/constants/route";
import type { TCreateCampaignPayload } from "@/types/campaign.type";

export default function CreateCampaignPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateCampaign = async (payload: TCreateCampaignPayload) => {
    try {
      setIsSubmitting(true);

      await CampaignService.createCampaign(payload);

      router.push(routes.campaigns);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert(
        error instanceof Error ? error.message : "Failed to create campaign",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center">
        <div>
          <div className="mb-3">
            <Button variant="outline" size="sm" asChild>
              <Link href={routes.campaigns}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Campaigns
              </Link>
            </Button>
          </div>

          <h1 className="text-2xl font-bold text-slate-900">Create Campaign</h1>

          <p className="mt-1 text-sm text-slate-500">
            Create a campaign to group your existing short links and track them
            together.
          </p>
        </div>
      </div>

      <CampaignForm
        mode="create"
        isSubmitting={isSubmitting}
        onSubmit={handleCreateCampaign}
      />
    </div>
  );
}
