"use client";

import { useRouter } from "next/navigation";
import {
  CalendarClock,
  Copy,
  Download,
  ExternalLink,
  Eye,
  EyeOff,
  Link2,
  Loader2,
  LockKeyhole,
  Power,
  QrCode,
  Save,
  Tags,
  Trash2,
} from "lucide-react";
import { useRef, useState } from "react";
import QRCode from "react-qr-code";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LinkService } from "@/services/link.service";
import { getLinkId, getShortUrl } from "@/lib/link-utils";
import type { TLink } from "@/types/link.type";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type TUpdateLinkFormProps = {
  link: TLink;
};

function formatDateTimeLocal(value?: string) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60 * 1000);

  return localDate.toISOString().slice(0, 16);
}

function isValidUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function UpdateLinkForm({ link }: TUpdateLinkFormProps) {
  const router = useRouter();
  const qrCodeRef = useRef<HTMLDivElement | null>(null);
  const linkId = getLinkId(link);
  const shortUrl = getShortUrl(link);

  const [originalUrl, setOriginalUrl] = useState(link.originalUrl || "");
  const [customAlias, setCustomAlias] = useState(link.customAlias || "");
  const [password, setPassword] = useState("");
  const [expiresAt, setExpiresAt] = useState(
    formatDateTimeLocal(link.expiresAt),
  );
  const [isActive, setIsActive] = useState(link.isActive !== false);
  const [showPassword, setShowPassword] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleCopy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success("Copied successfully");
    } catch {
      toast.error("Failed to copy");
    }
  };

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
      downloadLink.download = `smart-link-qr-${link.shortCode || Date.now()}.png`;

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

  const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!linkId) {
      toast.error("Link id not found");
      return;
    }

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
      setIsUpdating(true);

      const response = await LinkService.updateLink(linkId, {
        originalUrl,
        customAlias: customAlias || undefined,
        password: password || undefined,
        expiresAt: expiresAt || undefined,
        isActive,
      });

      if (!response.success) {
        toast.error(response.message || "Failed to update link");
        return;
      }

      toast.success("Link updated successfully");
      router.refresh();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to update link");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!linkId) {
      toast.error("Link id not found");
      return;
    }

    try {
      setIsDeleting(true);

      const response = await LinkService.deleteLink(linkId);

      if (!response.success) {
        toast.error(response.message || "Failed to delete link");
        return;
      }

      toast.success("Link deleted successfully");
      setDeleteDialogOpen(false);
      router.push("/dashboard/links");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete link");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_0.75fr]">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/70 sm:p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-black text-slate-950">
            Edit smart link
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            Update destination URL, alias, password protection, expiration, and
            active status.
          </p>
        </div>

        <form onSubmit={handleUpdate} className="space-y-5">
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
                placeholder={link.shortCode}
                className="h-12 border-0 shadow-none focus-visible:ring-0"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700">
              <LockKeyhole className="size-4 text-primary" />
              Change Password
            </label>

            <div className="flex rounded-2xl border border-slate-200 bg-white p-1">
              <Input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type={showPassword ? "text" : "password"}
                placeholder="Leave blank to keep current password"
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
            onClick={() => setIsActive((value) => !value)}
            className={
              isActive
                ? "flex w-full items-center gap-3 rounded-2xl border border-emerald-300 bg-emerald-50 px-4 py-4 text-left text-emerald-700"
                : "flex w-full items-center gap-3 rounded-2xl border border-red-300 bg-red-50 px-4 py-4 text-left text-red-700"
            }
          >
            <div className="flex size-11 items-center justify-center rounded-xl bg-white">
              <Power className="size-5" />
            </div>

            <div>
              <p className="font-black">
                {isActive ? "Link is Active" : "Link is Inactive"}
              </p>
              <p className="text-xs font-medium">
                Click to {isActive ? "disable" : "enable"} this link.
              </p>
            </div>
          </button>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              disabled={isUpdating}
              className="h-12 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 px-6 font-bold text-white shadow-xl shadow-cyan-500/25"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 size-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 size-5" />
                  Save Changes
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard/links")}
              className="h-12 rounded-2xl font-bold"
            >
              Back to Links
            </Button>

            <Button
              type="button"
              variant="outline"
              disabled={isDeleting}
              onClick={() => setDeleteDialogOpen(true)}
              className="h-12 rounded-2xl font-bold text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 size-5 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 size-5" />
                  Delete
                </>
              )}
            </Button>
          </div>
        </form>
      </section>

      <aside className="rounded-[2rem] border border-slate-200 bg-gradient-to-br from-cyan-50 via-white to-violet-50 p-5 shadow-xl shadow-slate-200/70 sm:p-6">
        <h3 className="text-xl font-black text-slate-950">Link Details</h3>

        <p className="mt-2 text-sm leading-6 text-slate-600">
          Preview your short link and QR code.
        </p>

        <div className="mt-6 space-y-5">
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
              Short URL
            </p>

            <p className="mt-2 break-all text-lg font-black text-primary">
              {shortUrl}
            </p>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <Button
                type="button"
                onClick={() => handleCopy(shortUrl)}
                className="rounded-2xl bg-slate-950 font-bold text-white hover:bg-slate-800"
              >
                <Copy className="mr-2 size-4" />
                Copy
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => window.open(shortUrl, "_blank")}
                className="rounded-2xl bg-white font-bold"
              >
                <ExternalLink className="mr-2 size-4" />
                Visit
              </Button>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 text-center shadow-sm">
            <p className="mb-4 text-sm font-black text-slate-700">QR Code</p>

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

          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-sm font-black text-slate-950">Original URL</p>
            <p className="mt-2 break-all text-sm leading-6 text-slate-600">
              {link.originalUrl}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <p className="text-xs font-bold text-slate-500">Short Code</p>
              <p className="mt-1 font-black text-slate-950">{link.shortCode}</p>
            </div>

            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <p className="text-xs font-bold text-slate-500">Clicks</p>
              <p className="mt-1 font-black text-slate-950">
                {link.totalClicks || link.clicks || 0}
              </p>
            </div>
          </div>
        </div>
      </aside>
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="rounded-[2rem] border-slate-200 bg-white">
          <AlertDialogHeader>
            <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
              <Trash2 className="size-7" />
            </div>

            <AlertDialogTitle className="text-2xl font-black text-slate-950">
              Delete this smart link?
            </AlertDialogTitle>

            <AlertDialogDescription className="text-sm leading-6 text-slate-600">
              This action will delete this short link from your dashboard.
              Visitors may no longer be able to access this short URL after
              deletion.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
              Short link
            </p>

            <p className="mt-1 break-all text-sm font-black text-primary">
              {shortUrl}
            </p>

            <p className="mt-2 line-clamp-2 break-all text-xs leading-5 text-slate-500">
              {link.originalUrl}
            </p>
          </div>

          <AlertDialogFooter className="gap-3 sm:gap-2">
            <AlertDialogCancel className="h-11 rounded-2xl font-bold">
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={handleDelete}
              className="h-11 rounded-2xl bg-red-600 font-bold text-white hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 size-4" />
                  Delete Link
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
