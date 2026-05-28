"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ExternalLink,
  Eye,
  Globe2,
  Link2,
  Loader2,
  Pencil,
  Trash2,
  Copy,
  BarChart3,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { routes } from "@/constants/route";
import { PageService } from "@/services/page.service";
import type { TPage } from "@/types/page.type";

function formatDate(date?: string | null) {
  if (!date) return "Not set";

  return new Date(date).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getThemeClass(theme: TPage["theme"]) {
  if (theme === "dark") {
    return "bg-slate-900 text-white ring-slate-700";
  }

  if (theme === "gradient") {
    return "bg-indigo-50 text-indigo-700 ring-indigo-200";
  }

  return "bg-slate-100 text-slate-700 ring-slate-200";
}

const getPublicPageUrl = (slug: string) => {
  if (typeof window === "undefined") return `/u/${slug}`;

  return `${window.location.origin}/u/${slug}`;
};

export default function PageDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const pageId = params.id as string;

  const [page, setPage] = useState<TPage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeletePageModal, setShowDeletePageModal] = useState(false);
  const [isDeletingPage, setIsDeletingPage] = useState(false);

  const activeLinks = useMemo(() => {
    return page?.links.filter((link) => link.isActive) || [];
  }, [page]);

  const loadPageDetails = async () => {
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

  const handleCopyPublicLink = async () => {
    if (!page) return;

    try {
      await navigator.clipboard.writeText(getPublicPageUrl(page.slug));
      toast.success("Public bio page link copied");
    } catch {
      toast.error("Failed to copy public link");
    }
  };

  const handleDeletePage = async () => {
    try {
      setIsDeletingPage(true);

      const response = await PageService.deletePage(pageId);

      if (!response.success) {
        toast.error(response.message || "Failed to delete bio page");
        return;
      }

      toast.success("Bio page deleted successfully");

      setShowDeletePageModal(false);

      router.push(routes.pages);
      router.refresh();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to delete bio page",
      );
    } finally {
      setIsDeletingPage(false);
    }
  };

  useEffect(() => {
    if (pageId) {
      loadPageDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageId]);

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading bio page details...
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
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5">
          <Button variant="outline" size="sm" asChild>
            <Link href={routes.pages}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Bio Pages
            </Link>
          </Button>
        </div>

        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
          <div className="flex gap-4">
            {page.avatarUrl ? (
              <img
                src={page.avatarUrl}
                alt={page.title}
                className="h-16 w-16 rounded-2xl border border-slate-200 object-cover"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-xl font-bold text-indigo-600">
                {page.title.charAt(0).toUpperCase()}
              </div>
            )}

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize ring-1 ${getThemeClass(
                    page.theme,
                  )}`}
                >
                  {page.theme}
                </span>

                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${
                    page.isPublished
                      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                      : "bg-amber-50 text-amber-700 ring-amber-200"
                  }`}
                >
                  {page.isPublished ? "Published" : "Draft"}
                </span>
              </div>

              <h1 className="mt-3 text-2xl font-bold text-slate-900">
                {page.title}
              </h1>

              <p className="mt-1 text-sm text-slate-500">/{page.slug}</p>

              <p className="mt-2 max-w-3xl text-sm text-slate-500">
                {page.bio || "No bio added."}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {page.isPublished && (
              <Button asChild>
                <a href={`/u/${page.slug}`} target="_blank" rel="noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Preview
                </a>
              </Button>
            )}
            <Button variant="outline" asChild>
              <Link href={`/dashboard/analytics/pages/${page.id}`}>
                <BarChart3 className="mr-2 h-4 w-4" />
                Analytics
              </Link>
            </Button>
            <Button variant="outline" onClick={handleCopyPublicLink}>
              <Copy className="mr-2 h-4 w-4" />
              Copy Link
            </Button>
            <Button variant="outline" asChild>
              <Link href={`/dashboard/pages/${page.id}/edit`}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </Button>

            <Button
              variant="outline"
              disabled={isDeletingPage}
              onClick={() => setShowDeletePageModal(true)}
              className="text-rose-600 hover:bg-rose-50 hover:text-rose-700"
            >
              {isDeletingPage ? (
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
              {page.links.length}
            </h2>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="flex items-center gap-2 text-sm text-slate-500">
              <Globe2 className="h-4 w-4" />
              Active Links
            </p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">
              {activeLinks.length}
            </h2>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="flex items-center gap-2 text-sm text-slate-500">
              <Eye className="h-4 w-4" />
              Visits
            </p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">
              {page.visits}
            </h2>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Created</p>
            <h2 className="mt-2 text-sm font-semibold text-slate-900">
              {formatDate(page.createdAt)}
            </h2>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-6">
          <h2 className="text-lg font-semibold text-slate-900">
            Links on this Bio Page
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            These buttons will appear on the public bio page.
          </p>
        </div>

        {page.links.length === 0 ? (
          <div className="p-10 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <Link2 className="h-6 w-6" />
            </div>

            <h3 className="mt-4 text-lg font-semibold text-slate-900">
              No links added yet
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              Edit this bio page to add buttons and destination links.
            </p>

            <Button asChild className="mt-5">
              <Link href={`/dashboard/pages/${page.id}/edit`}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit Bio Page
              </Link>
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-6 py-4">Order</th>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">URL</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>

              <tbody>
                {page.links
                  .slice()
                  .sort((a, b) => a.order - b.order)
                  .map((link, index) => (
                    <tr
                      key={`${link.title}-${index}`}
                      className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50"
                    >
                      <td className="px-6 py-4 text-slate-500">
                        #{link.order + 1}
                      </td>

                      <td className="px-6 py-4 font-medium text-slate-900">
                        {link.title}
                      </td>

                      <td className="max-w-sm px-6 py-4">
                        <p className="truncate text-slate-600">{link.url}</p>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${
                            link.isActive
                              ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                              : "bg-slate-100 text-slate-600 ring-slate-200"
                          }`}
                        >
                          {link.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-end">
                          <Button variant="outline" size="sm" asChild>
                            <a href={link.url} target="_blank" rel="noreferrer">
                              <ExternalLink className="mr-2 h-4 w-4" />
                              Open
                            </a>
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

      {showDeletePageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-slate-900">
              Delete this bio page?
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              This action will permanently delete this bio page and all links
              configured inside it.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowDeletePageModal(false)}
                disabled={isDeletingPage}
              >
                Cancel
              </Button>

              <Button
                type="button"
                onClick={handleDeletePage}
                disabled={isDeletingPage}
                className="bg-rose-600 text-white hover:bg-rose-700"
              >
                {isDeletingPage ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Bio Page
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
