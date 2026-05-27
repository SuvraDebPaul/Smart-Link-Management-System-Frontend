"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarClock,
  Link2,
  Loader2,
  MousePointerClick,
  Power,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { UpdateLinkForm } from "@/components/links/update-link-form";
import { LinkService } from "@/services/link.service";
import type { TLink } from "@/types/link.type";
import { getClickCount, getLinkStatus } from "@/lib/link-utils";

type TLinkDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default function LinkDetailsPage({ params }: TLinkDetailsPageProps) {
  const [link, setLink] = useState<TLink | null>(null);
  const [linkId, setLinkId] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadParams = async () => {
      const resolvedParams = await params;
      setLinkId(resolvedParams.id);
    };

    loadParams();
  }, [params]);

  useEffect(() => {
    if (!linkId) return;

    const fetchLink = async () => {
      try {
        setIsLoading(true);

        const response = await LinkService.getSingleLink(linkId);

        if (!response.success || !response.data) {
          toast.error(response.message || "Failed to load link");
          return;
        }

        setLink(response.data);
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Failed to load link");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLink();
  }, [linkId]);

  if (isLoading) {
    return (
      <div className="flex min-h-96 items-center justify-center rounded-[2rem] bg-white shadow-xl shadow-slate-200/70">
        <div className="text-center">
          <Loader2 className="mx-auto size-8 animate-spin text-primary" />
          <p className="mt-3 text-sm font-bold text-slate-500">
            Loading link details...
          </p>
        </div>
      </div>
    );
  }

  if (!link) {
    return (
      <div className="flex min-h-96 items-center justify-center rounded-[2rem] bg-white p-8 text-center shadow-xl shadow-slate-200/70">
        <div>
          <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-3xl bg-red-50 text-red-600">
            <Link2 className="size-8" />
          </div>

          <h1 className="text-2xl font-black text-slate-950">Link not found</h1>

          <p className="mt-2 text-sm text-slate-600">
            The link may have been deleted or you may not have permission to
            access it.
          </p>

          <Button asChild className="mt-6 rounded-2xl font-bold">
            <Link href="/dashboard/links">Back to Links</Link>
          </Button>
        </div>
      </div>
    );
  }

  const status = getLinkStatus(link);

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[2rem] bg-slate-950 p-6 text-white shadow-2xl">
        <div className="relative">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.24),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(139,92,246,0.26),transparent_34%),radial-gradient(circle_at_50%_90%,rgba(16,185,129,0.16),transparent_35%)]" />

          <Button
            asChild
            variant="outline"
            className="mb-5 rounded-2xl border-white/20 bg-white/10 font-bold text-white hover:bg-white/20 hover:text-white"
          >
            <Link href="/dashboard/links">
              <ArrowLeft className="mr-2 size-4" />
              Back to Links
            </Link>
          </Button>

          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-cyan-300">
                Link Details
              </p>

              <h1 className="mt-2 break-all text-3xl font-black tracking-tight md:text-4xl">
                {link.shortCode}
              </h1>

              <p className="mt-3 max-w-3xl break-all text-sm leading-6 text-slate-300">
                {link.originalUrl}
              </p>
            </div>

            <div
              className={
                status === "Active"
                  ? "rounded-full bg-emerald-400/15 px-4 py-2 text-sm font-black text-emerald-300"
                  : status === "Expired"
                    ? "rounded-full bg-amber-400/15 px-4 py-2 text-sm font-black text-amber-300"
                    : "rounded-full bg-red-400/15 px-4 py-2 text-sm font-black text-red-300"
              }
            >
              {status}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-5 sm:grid-cols-3">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/70">
          <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white">
            <MousePointerClick className="size-6" />
          </div>

          <p className="text-3xl font-black text-slate-950">
            {getClickCount(link)}
          </p>

          <p className="text-sm font-bold text-slate-500">Total Clicks</p>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/70">
          <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-600 text-white">
            <Power className="size-6" />
          </div>

          <p className="text-3xl font-black text-slate-950">
            {link.isActive === false ? "Off" : "On"}
          </p>

          <p className="text-sm font-bold text-slate-500">Active Status</p>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/70">
          <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 text-white">
            <CalendarClock className="size-6" />
          </div>

          <p className="text-lg font-black text-slate-950">
            {link.expiresAt
              ? new Date(link.expiresAt).toLocaleDateString()
              : "No Expiry"}
          </p>

          <p className="text-sm font-bold text-slate-500">Expiration</p>
        </div>
      </section>

      <UpdateLinkForm link={link} />
    </div>
  );
}
