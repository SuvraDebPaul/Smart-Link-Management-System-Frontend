"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Eye,
  ExternalLink,
  Globe2,
  Loader2,
  PanelsTopLeft,
  Pencil,
  Plus,
  Trash2,
  Copy,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { routes } from "@/constants/route";
import { PageService } from "@/services/page.service";
import type { TPage } from "@/types/page.type";

function getThemeClass(theme: TPage["theme"]) {
  if (theme === "dark") {
    return "bg-slate-900 text-white ring-slate-700";
  }

  if (theme === "gradient") {
    return "bg-indigo-50 text-indigo-700 ring-indigo-200";
  }

  return "bg-slate-100 text-slate-700 ring-slate-200";
}

function formatDate(date?: string | null) {
  if (!date) return "Not set";

  return new Date(date).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
const getPublicPageUrl = (slug: string) => {
  if (typeof window === "undefined") return `/u/${slug}`;

  return `${window.location.origin}/u/${slug}`;
};

export default function PagesPage() {
  const [pages, setPages] = useState<TPage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteTargetPageId, setDeleteTargetPageId] = useState<string | null>(
    null,
  );
  const [isDeletingPage, setIsDeletingPage] = useState(false);

  const loadPages = async () => {
    try {
      setIsLoading(true);

      const response = await PageService.getMyPage();

      if (!response.success || !response.data) {
        toast.error(response.message || "Failed to load bio pages");
        return;
      }

      setPages(response.data);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to load bio pages");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyPublicLink = async (slug: string) => {
    try {
      await navigator.clipboard.writeText(getPublicPageUrl(slug));
      toast.success("Public bio page link copied");
    } catch {
      toast.error("Failed to copy public link");
    }
  };

  const handleDeletePage = async () => {
    if (!deleteTargetPageId) return;

    try {
      setIsDeletingPage(true);

      const response = await PageService.deletePage(deleteTargetPageId);

      if (!response.success) {
        toast.error(response.message || "Failed to delete bio page");
        return;
      }

      setPages((prev) => prev.filter((page) => page.id !== deleteTargetPageId));

      toast.success("Bio page deleted successfully");
      setDeleteTargetPageId(null);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to delete bio page",
      );
    } finally {
      setIsDeletingPage(false);
    }
  };

  useEffect(() => {
    loadPages();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-indigo-600">
            <PanelsTopLeft className="h-4 w-4" />
            Bio Page Management
          </div>

          <h1 className="text-2xl font-bold text-slate-900">Bio Pages</h1>

          <p className="mt-1 max-w-2xl text-sm text-slate-500">
            Create public link-in-bio pages and organize multiple destination
            links in one shareable profile.
          </p>
        </div>

        <Button asChild>
          <Link href={routes.createPage}>
            <Plus className="mr-2 h-4 w-4" />
            Create Bio Page
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading bio pages...
          </div>
        </div>
      ) : pages.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
            <PanelsTopLeft className="h-6 w-6" />
          </div>

          <h2 className="mt-4 text-lg font-semibold text-slate-900">
            No bio pages created yet
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
            Create your first bio page and share multiple links from one public
            profile.
          </p>

          <Button asChild className="mt-5">
            <Link href={routes.createPage}>
              <Plus className="mr-2 h-4 w-4" />
              Create Bio Page
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {pages.map((page) => (
            <div
              key={page.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
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

                  <h2 className="mt-3 truncate text-lg font-semibold text-slate-900">
                    {page.title}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">/{page.slug}</p>

                  <p className="mt-2 line-clamp-2 min-h-[40px] text-sm text-slate-500">
                    {page.bio || "No bio added."}
                  </p>
                </div>

                {page.avatarUrl ? (
                  <img
                    src={page.avatarUrl}
                    alt={page.title}
                    className="h-12 w-12 rounded-2xl border border-slate-200 object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-sm font-bold text-indigo-600">
                    {page.title.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              <div className="mt-5 grid gap-3 rounded-xl bg-slate-50 p-4 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2 text-slate-500">
                    <Globe2 className="h-4 w-4" />
                    Links
                  </span>

                  <span className="font-medium text-slate-800">
                    {page.links.length}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2 text-slate-500">
                    <Eye className="h-4 w-4" />
                    Visits
                  </span>

                  <span className="font-medium text-slate-800">
                    {page.visits}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-slate-500">Created</span>

                  <span className="font-medium text-slate-800">
                    {formatDate(page.createdAt)}
                  </span>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between gap-2 border-t border-slate-100 pt-4">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/dashboard/pages/${page.id}`}>
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </Link>
                </Button>

                <div className="flex gap-2">
                  <Button variant="outline" size="icon" asChild>
                    <Link href={`/dashboard/pages/${page.id}/edit`}>
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </Button>

                  {page.isPublished && (
                    <Button variant="outline" size="icon" asChild>
                      <a
                        href={`/u/${page.slug}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleCopyPublicLink(page.slug)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="outline"
                    size="icon"
                    disabled={isDeletingPage}
                    onClick={() => setDeleteTargetPageId(page.id)}
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

      {deleteTargetPageId && (
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
                onClick={() => setDeleteTargetPageId(null)}
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
