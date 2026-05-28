"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { routes } from "@/constants/route";
import { PageForm } from "@/components/pages/PageForm";
import { PageService } from "@/services/page.service";
import type { TCreatePagePayload, TPage } from "@/types/page.type";

export default function EditPagePage() {
  const params = useParams();
  const router = useRouter();

  const pageId = params.id as string;

  const [page, setPage] = useState<TPage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadPage = async () => {
    try {
      setIsLoading(true);

      const response = await PageService.getSinglePage(pageId);

      if (!response.success || !response.data) {
        toast.error(response.message || "Failed to load bio page");
        return;
      }

      setPage(response.data);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to load bio page");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePage = async (payload: TCreatePagePayload) => {
    try {
      setIsSubmitting(true);

      const response = await PageService.updatePage(pageId, payload);

      if (!response.success || !response.data) {
        toast.error(response.message || "Failed to update bio page");
        return;
      }

      toast.success("Bio page updated successfully");

      router.push(`/dashboard/pages/${pageId}`);
      router.refresh();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to update bio page",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (pageId) {
      loadPage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageId]);

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading bio page...
        </div>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900">
          Bio page not found
        </h1>

        <Button asChild className="mt-5">
          <Link href={routes.pages}>Back to Bio Pages</Link>
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
              <Link href={`/dashboard/pages/${pageId}`}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Bio Page Details
              </Link>
            </Button>
          </div>

          <h1 className="text-2xl font-bold text-slate-900">Edit Bio Page</h1>

          <p className="mt-1 text-sm text-slate-500">
            Update your public page profile, theme, publish status, and links.
          </p>
        </div>
      </div>

      <PageForm
        mode="edit"
        defaultValues={page}
        isSubmitting={isSubmitting}
        onSubmit={handleUpdatePage}
      />
    </div>
  );
}
