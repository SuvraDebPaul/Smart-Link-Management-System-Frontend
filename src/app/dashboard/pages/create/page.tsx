"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { routes } from "@/constants/route";
import { PageForm } from "@/components/pages/PageForm";
import { PageService } from "@/services/page.service";
import type { TCreatePagePayload } from "@/types/page.type";

export default function CreatePagePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreatePage = async (payload: TCreatePagePayload) => {
    try {
      setIsSubmitting(true);

      const response = await PageService.createPage(payload);

      if (!response.success || !response.data) {
        toast.error(response.message || "Failed to create bio page");
        return;
      }

      toast.success("Bio page created successfully");

      router.push(routes.pages);
      router.refresh();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to create bio page",
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
              <Link href={routes.pages}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Bio Pages
              </Link>
            </Button>
          </div>

          <h1 className="text-2xl font-bold text-slate-900">Create Bio Page</h1>

          <p className="mt-1 text-sm text-slate-500">
            Build a public link-in-bio page with multiple links and simple
            tracking.
          </p>
        </div>
      </div>

      <PageForm
        mode="create"
        isSubmitting={isSubmitting}
        onSubmit={handleCreatePage}
      />
    </div>
  );
}
