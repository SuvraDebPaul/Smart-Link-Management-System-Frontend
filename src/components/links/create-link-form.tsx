"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  CalendarClock,
  Copy,
  Download,
  Eye,
  EyeOff,
  Link2,
  Loader2,
  LockKeyhole,
  QrCode,
  Tags,
  WandSparkles,
} from "lucide-react";
import { useRef, useState } from "react";
import QRCode from "react-qr-code";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LinkService } from "@/services/link.service";
import { getShortUrl } from "@/lib/link-utils";
import type { TLink } from "@/types/link.type";

function isValidUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function CreateLinkForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const qrCodeRef = useRef<HTMLDivElement | null>(null);
  const [originalUrl, setOriginalUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [password, setPassword] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [generateQr, setGenerateQr] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [createdLink, setCreatedLink] = useState<TLink | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const campaignId = searchParams.get("campaignId");
  const shortUrl = createdLink ? getShortUrl(createdLink) : "";

  const handleDownloadQrCode = () => {
    if (!qrCodeRef.current || !shortUrl) {
      toast.error("QR code is not ready yet");
      return;
    }

    const svgElement = qrCodeRef.current.querySelector("svg");

    if (!svgElement) {
      toast.error("QR code not found");
      return;
    }

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgElement);

    const svgBlob = new Blob([svgString], {
      type: "image/svg+xml;charset=utf-8",
    });

    const svgUrl = URL.createObjectURL(svgBlob);
    const image = new Image();

    image.onload = () => {
      const canvas = document.createElement("canvas");
      const size = 800;
      const padding = 80;

      canvas.width = size;
      canvas.height = size;

      const ctx = canvas.getContext("2d");

      if (!ctx) {
        toast.error("Unable to create QR image");
        URL.revokeObjectURL(svgUrl);
        return;
      }

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, size, size);
      ctx.drawImage(
        image,
        padding,
        padding,
        size - padding * 2,
        size - padding * 2,
      );

      const pngUrl = canvas.toDataURL("image/png");

      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `smart-link-qr-${createdLink?.shortCode || Date.now()}.png`;

      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      URL.revokeObjectURL(svgUrl);
      toast.success("QR code downloaded");
    };

    image.onerror = () => {
      URL.revokeObjectURL(svgUrl);
      toast.error("Failed to download QR code");
    };

    image.src = svgUrl;
  };

  const handleCopy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success("Copied successfully");
    } catch {
      toast.error("Failed to copy");
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isValidUrl(originalUrl)) {
      toast.error("Please enter a valid URL");
      return;
    }

    if (customAlias && !/^[a-zA-Z0-9-]+$/.test(customAlias)) {
      toast.error(
        "Custom alias can only contain letters, numbers, and hyphens",
      );
      return;
    }

    if (password && password.length < 4) {
      toast.error("Password must be at least 4 characters");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await LinkService.createLink({
        originalUrl,
        customAlias: customAlias || undefined,
        password: password || undefined,
        expiresAt: expiresAt || undefined,
        campaignId: campaignId || null,
      });

      if (!response.success || !response.data) {
        toast.error(response.message || "Failed to create link");
        return;
      }

      setCreatedLink(response.data);
      toast.success("Smart link created successfully");

      if (campaignId) {
        router.push(`/dashboard/campaigns/${campaignId}`);
        router.refresh();
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to create link");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_0.75fr]">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/70 sm:p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-black text-slate-950">
            Create a new smart link
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Add destination URL, custom alias, password protection, expiry date,
            and QR support.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700">
              <Link2 className="size-4 text-primary" />
              Destination URL
            </label>

            <Input
              value={originalUrl}
              onChange={(event) => setOriginalUrl(event.target.value)}
              placeholder="https://example.com/very-long-url"
              className="h-12 rounded-2xl"
            />
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700">
              <Tags className="size-4 text-primary" />
              Custom Alias
            </label>

            <div className="flex overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <div className="hidden items-center border-r border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-500 sm:flex">
                your-domain/
              </div>

              <Input
                value={customAlias}
                onChange={(event) => setCustomAlias(event.target.value)}
                placeholder="my-custom-link"
                className="h-12 border-0 shadow-none focus-visible:ring-0"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700">
              <LockKeyhole className="size-4 text-primary" />
              Password Protection
            </label>

            <div className="flex rounded-2xl border border-slate-200 bg-white p-1">
              <Input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type={showPassword ? "text" : "password"}
                placeholder="Optional password"
                className="h-11 border-0 shadow-none focus-visible:ring-0"
              />

              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setShowPassword((value) => !value)}
                className="h-11 w-11 rounded-xl"
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </Button>
            </div>
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700">
              <CalendarClock className="size-4 text-primary" />
              Expiration Date & Time
            </label>

            <Input
              value={expiresAt}
              onChange={(event) => setExpiresAt(event.target.value)}
              type="datetime-local"
              className="h-12 rounded-2xl"
            />
          </div>

          <button
            type="button"
            onClick={() => setGenerateQr((value) => !value)}
            className={
              generateQr
                ? "flex w-full items-center gap-3 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-4 text-left text-amber-700"
                : "flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-left text-slate-600"
            }
          >
            <div className="flex size-11 items-center justify-center rounded-xl bg-white">
              <QrCode className="size-5" />
            </div>

            <div>
              <p className="font-black">Generate QR Code</p>
              <p className="text-xs font-medium">
                QR will be created from your short link.
              </p>
            </div>
          </button>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              disabled={isSubmitting}
              className="h-12 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 px-6 font-bold text-white shadow-xl shadow-cyan-500/25"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 size-5 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <WandSparkles className="mr-2 size-5" />
                  {campaignId ? "Add Link to Campaign" : "Create Smart Link"}
                </>
              )}
            </Button>
            {campaignId ? (
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  router.push(`/dashboard/campaigns/${campaignId}`)
                }
                className="h-12 rounded-2xl font-bold"
              >
                Back to Champaign
              </Button>
            ) : (
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard/links")}
                className="h-12 rounded-2xl font-bold"
              >
                Back to Links
              </Button>
            )}
          </div>
        </form>
      </section>

      <aside className="rounded-[2rem] border border-slate-200 bg-gradient-to-br from-cyan-50 via-white to-violet-50 p-5 shadow-xl shadow-slate-200/70 sm:p-6">
        <h3 className="text-xl font-black text-slate-950">Link Preview</h3>

        <p className="mt-2 text-sm leading-6 text-slate-600">
          After creating your link, the short URL and QR code will appear here.
        </p>

        {createdLink ? (
          <div className="mt-6 space-y-5">
            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Short URL
              </p>

              <p className="mt-2 break-all text-lg font-black text-primary">
                {shortUrl}
              </p>

              <Button
                type="button"
                onClick={() => handleCopy(shortUrl)}
                className="mt-4 w-full rounded-2xl bg-slate-950 font-bold text-white hover:bg-slate-800"
              >
                Copy Short Link
              </Button>
            </div>

            {generateQr && (
              <div className="rounded-2xl bg-white p-5 text-center shadow-sm">
                <p className="mb-4 text-sm font-black text-slate-700">
                  QR Code
                </p>

                <div
                  ref={qrCodeRef}
                  className="mx-auto flex size-44 items-center justify-center rounded-2xl bg-white p-3"
                >
                  <QRCode value={shortUrl} size={145} />
                </div>

                <Button
                  type="button"
                  onClick={handleDownloadQrCode}
                  className="mt-5 w-full rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 font-bold text-white"
                >
                  <Download className="mr-2 size-4" />
                  Download QR Code
                </Button>
              </div>
            )}

            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard/links")}
              className="h-12 w-full rounded-2xl bg-white font-bold"
            >
              View All Links
            </Button>
          </div>
        ) : (
          <div className="mt-6 rounded-[1.5rem] border border-dashed border-slate-300 bg-white/70 p-8 text-center">
            <QrCode className="mx-auto size-12 text-slate-400" />
            <p className="mt-4 text-sm font-bold text-slate-500">
              No link created yet
            </p>
          </div>
        )}
      </aside>
    </div>
  );
}
