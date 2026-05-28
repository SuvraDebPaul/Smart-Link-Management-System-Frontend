"use client";

import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ExternalLink, Loader2 } from "lucide-react";

import { PageService } from "@/services/page.service";
import type { TPublicPage } from "@/types/page.type";

function getPageThemeClass(theme: TPublicPage["theme"]) {
  if (theme === "dark") {
    return "min-h-screen bg-slate-950 text-white";
  }

  if (theme === "gradient") {
    return "min-h-screen bg-gradient-to-br from-indigo-100 via-white to-cyan-100 text-slate-900";
  }

  return "min-h-screen bg-slate-50 text-slate-900";
}

function getProfileCardClass(theme: TPublicPage["theme"]) {
  if (theme === "dark") {
    return "border border-white/10 bg-white/10 shadow-2xl shadow-black/20 backdrop-blur-xl";
  }

  if (theme === "gradient") {
    return "border border-white/70 bg-white/75 shadow-2xl shadow-indigo-100/80 backdrop-blur-xl";
  }

  return "border border-slate-200 bg-white shadow-xl shadow-slate-200/70";
}

function getLinkButtonClass(theme: TPublicPage["theme"]) {
  if (theme === "dark") {
    return "border-white/10 bg-white/10 text-white hover:bg-white/15 hover:border-white/20";
  }

  if (theme === "gradient") {
    return "border-white/70 bg-white/80 text-slate-900 hover:bg-white hover:border-indigo-200";
  }

  return "border-slate-200 bg-white text-slate-900 hover:bg-slate-50 hover:border-indigo-200";
}

function getMutedTextClass(theme: TPublicPage["theme"]) {
  if (theme === "dark") {
    return "text-slate-300";
  }

  return "text-slate-600";
}

function BackgroundDecorations({ theme }: { theme: TPublicPage["theme"] }) {
  if (theme === "dark") {
    return (
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-120px] h-72 w-72 -translate-x-1/2 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute bottom-[-120px] right-[-80px] h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>
    );
  }

  if (theme === "gradient") {
    return (
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[-100px] top-[-80px] h-72 w-72 rounded-full bg-indigo-300/40 blur-3xl" />
        <div className="absolute bottom-[-100px] right-[-80px] h-72 w-72 rounded-full bg-cyan-300/40 blur-3xl" />
      </div>
    );
  }

  return null;
}

export default function PublicBioPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [page, setPage] = useState<TPublicPage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const sortedLinks = useMemo(() => {
    return [...(page?.links || [])].sort((a, b) => a.order - b.order);
  }, [page]);

  const loadPublicPage = async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const response = await PageService.getPublicPage(slug);

      if (!response.success || !response.data) {
        setErrorMessage(response.message || "Bio page not found");
        return;
      }

      setPage(response.data);
    } catch (error: any) {
      setErrorMessage(
        error?.response?.data?.message || "This bio page is not available",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (slug) {
      loadPublicPage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-500 shadow-sm">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading bio page...
        </div>
      </main>
    );
  }

  if (!page || errorMessage) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-bold text-slate-900">
            Bio page not found
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            {errorMessage || "This page may be unpublished or removed."}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className={getPageThemeClass(page.theme)}>
      <BackgroundDecorations theme={page.theme} />

      <div className="relative mx-auto flex min-h-screen w-full max-w-xl flex-col px-5 py-10">
        <div className="flex flex-1 flex-col justify-center">
          <div
            className={`rounded-[2rem] p-6 ${getProfileCardClass(page.theme)}`}
          >
            <div className="text-center">
              {page.avatarUrl ? (
                <img
                  src={page.avatarUrl}
                  alt={page.title}
                  className="mx-auto h-24 w-24 rounded-full border-4 border-white object-cover shadow-md"
                />
              ) : (
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-indigo-600 text-3xl font-bold text-white shadow-md">
                  {page.title.charAt(0).toUpperCase()}
                </div>
              )}

              <h1 className="mt-5 text-2xl font-bold">{page.title}</h1>

              <p className={`mt-1 text-sm ${getMutedTextClass(page.theme)}`}>
                @{page.slug}
              </p>

              {page.bio && (
                <p
                  className={`mx-auto mt-3 max-w-md text-sm leading-6 ${getMutedTextClass(
                    page.theme,
                  )}`}
                >
                  {page.bio}
                </p>
              )}
            </div>

            <div className="mt-8 space-y-3">
              {sortedLinks.length === 0 ? (
                <div
                  className={`rounded-2xl border px-5 py-4 text-center text-sm ${
                    page.theme === "dark"
                      ? "border-white/10 bg-white/10 text-slate-300"
                      : "border-slate-200 bg-white text-slate-500"
                  }`}
                >
                  No links available.
                </div>
              ) : (
                sortedLinks.map((link, index) => (
                  <a
                    key={`${link.title}-${index}`}
                    href={link.clickUrl || link.url || link.originalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={`flex items-center justify-between gap-3 rounded-2xl border px-5 py-4 text-sm font-semibold shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${getLinkButtonClass(
                      page.theme,
                    )}`}
                  >
                    <span>{link.title}</span>
                    <ExternalLink className="h-4 w-4 shrink-0 opacity-70" />
                  </a>
                ))
              )}
            </div>
          </div>
        </div>

        <div
          className={`pt-8 text-center text-xs ${
            page.theme === "dark" ? "text-slate-400" : "text-slate-500"
          }`}
        >
          Powered by Smart Link
        </div>
      </div>
    </main>
  );
}
