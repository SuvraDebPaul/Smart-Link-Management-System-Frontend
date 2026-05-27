"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  BarChart3,
  CalendarClock,
  ChevronLeft,
  ChevronRight,
  Copy,
  Download,
  ExternalLink,
  Filter,
  Link2,
  Loader2,
  Plus,
  QrCode,
  Search,
  SlidersHorizontal,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import QRCode from "react-qr-code";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LinkService } from "@/services/link.service";
import type { TLink } from "@/types/link.type";
import {
  getClickCount,
  getLinkId,
  getLinkStatus,
  getShortUrl,
} from "@/lib/link-utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type TStatusFilter = "all" | "active" | "inactive" | "expired";
type TSortOption = "newest" | "oldest" | "most-clicked";

export default function LinksPage() {
  const [links, setLinks] = useState<TLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedQrUrl, setSelectedQrUrl] = useState("");
  const [selectedQrCode, setSelectedQrCode] = useState("");
  const qrCodeRef = useRef<HTMLDivElement | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<TLink | null>(null);

  const [statusFilter, setStatusFilter] = useState<TStatusFilter>("all");
  const [sortOption, setSortOption] = useState<TSortOption>("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const filteredLinks = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();

    return links
      .filter((link) => {
        const shortUrl = getShortUrl(link).toLowerCase();
        const originalUrl = link.originalUrl.toLowerCase();
        const shortCode = link.shortCode.toLowerCase();

        const matchesSearch =
          !search ||
          originalUrl.includes(search) ||
          shortCode.includes(search) ||
          shortUrl.includes(search);

        const status = getLinkStatus(link).toLowerCase();

        const matchesStatus = statusFilter === "all" || status === statusFilter;

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        if (sortOption === "oldest") {
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        }

        if (sortOption === "most-clicked") {
          return getClickCount(b) - getClickCount(a);
        }

        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });
  }, [links, searchTerm, statusFilter, sortOption]);

  const totalPages = Math.max(1, Math.ceil(filteredLinks.length / limit));

  const paginatedLinks = useMemo(() => {
    const startIndex = (currentPage - 1) * limit;
    const endIndex = startIndex + limit;

    return filteredLinks.slice(startIndex, endIndex);
  }, [filteredLinks, currentPage, limit]);

  const startItem =
    filteredLinks.length === 0 ? 0 : (currentPage - 1) * limit + 1;

  const endItem = Math.min(currentPage * limit, filteredLinks.length);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, sortOption, limit]);

  const fetchLinks = async () => {
    try {
      setIsLoading(true);

      const response = await LinkService.getAllLinks();

      if (!response.success || !response.data) {
        toast.error(response.message || "Failed to load links");
        return;
      }

      setLinks(response.data);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to load links");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const handleCopy = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Short link copied");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    const id = getLinkId(deleteTarget);

    if (!id) {
      toast.error("Link id not found");
      return;
    }

    try {
      setDeletingId(id);

      const response = await LinkService.deleteLink(id);

      if (!response.success) {
        toast.error(response.message || "Failed to delete link");
        return;
      }

      setLinks((current) => current.filter((item) => getLinkId(item) !== id));
      setDeleteTarget(null);
      toast.success("Link deleted successfully");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete link");
    } finally {
      setDeletingId(null);
    }
  };

  const handleOpenQr = (link: TLink) => {
    setSelectedQrUrl(getShortUrl(link));
    setSelectedQrCode(link.shortCode);
  };

  const handleCloseQr = () => {
    setSelectedQrUrl("");
    setSelectedQrCode("");
  };

  const handleDownloadQrCode = () => {
    if (!qrCodeRef.current || !selectedQrUrl) {
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
      downloadLink.download = `smart-link-qr-${selectedQrCode || Date.now()}.png`;

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

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[2rem] bg-slate-950 p-6 text-white shadow-2xl">
        <div className="relative">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.24),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(139,92,246,0.26),transparent_34%),radial-gradient(circle_at_50%_90%,rgba(16,185,129,0.16),transparent_35%)]" />

          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-cyan-300">
                Link Management
              </p>

              <h1 className="mt-2 text-3xl font-black tracking-tight md:text-4xl">
                Manage all your smart links
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                View, copy, track, and delete your shortened links from one
                dashboard.
              </p>
            </div>

            <Button
              asChild
              className="h-12 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 px-6 font-bold text-white shadow-xl shadow-cyan-500/25"
            >
              <Link href="/dashboard/links/create">
                <Plus className="mr-2 size-5" />
                Create Link
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="grid gap-5 sm:grid-cols-3">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/70">
          <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white">
            <Link2 className="size-6" />
          </div>
          <p className="text-3xl font-black text-slate-950">{links.length}</p>
          <p className="text-sm font-bold text-slate-500">Total Links</p>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/70">
          <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-600 text-white">
            <BarChart3 className="size-6" />
          </div>
          <p className="text-3xl font-black text-slate-950">
            {links.reduce((total, link) => total + getClickCount(link), 0)}
          </p>
          <p className="text-sm font-bold text-slate-500">Total Clicks</p>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/70">
          <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 text-white">
            <CalendarClock className="size-6" />
          </div>
          <p className="text-3xl font-black text-slate-950">
            {links.filter((link) => getLinkStatus(link) === "Active").length}
          </p>
          <p className="text-sm font-bold text-slate-500">Active Links</p>
        </div>
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/70">
        <div className="mb-5 space-y-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-black text-slate-950">Your Links</h2>
              <p className="mt-1 text-sm text-slate-500">
                Search, filter, sort, and manage your shortened links.
              </p>
            </div>

            <div className="rounded-full bg-cyan-50 px-4 py-2 text-sm font-black text-primary">
              {filteredLinks.length} result
              {filteredLinks.length === 1 ? "" : "s"}
            </div>
          </div>

          <div className="grid gap-3 lg:grid-cols-[1.4fr_0.8fr_0.8fr_0.6fr]">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by URL, short code, or short link..."
                className="h-12 rounded-2xl bg-slate-50 pl-11"
              />
            </div>

            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value as TStatusFilter)}
            >
              <SelectTrigger className="h-12 rounded-2xl bg-slate-50">
                <div className="flex items-center gap-2">
                  <Filter className="size-4 text-slate-400" />
                  <SelectValue placeholder="Status" />
                </div>
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={sortOption}
              onValueChange={(value) => setSortOption(value as TSortOption)}
            >
              <SelectTrigger className="h-12 rounded-2xl bg-slate-50">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="size-4 text-slate-400" />
                  <SelectValue placeholder="Sort" />
                </div>
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="most-clicked">Most Clicked</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={String(limit)}
              onValueChange={(value) => setLimit(Number(value))}
            >
              <SelectTrigger className="h-12 rounded-2xl bg-slate-50">
                <SelectValue placeholder="Limit" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="10">10 / page</SelectItem>
                <SelectItem value="20">20 / page</SelectItem>
                <SelectItem value="50">50 / page</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex min-h-72 items-center justify-center rounded-[1.5rem] bg-slate-50">
            <div className="text-center">
              <Loader2 className="mx-auto size-8 animate-spin text-primary" />
              <p className="mt-3 text-sm font-bold text-slate-500">
                Loading links...
              </p>
            </div>
          </div>
        ) : filteredLinks.length === 0 ? (
          <div className="flex min-h-72 items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-cyan-50 via-white to-violet-50 p-8 text-center">
            <div>
              <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-3xl bg-white text-primary shadow-lg">
                <Link2 className="size-8" />
              </div>

              <h3 className="text-xl font-black text-slate-950">
                No links found
              </h3>

              <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">
                Create your first smart short link with custom alias, password,
                expiry, and QR code support.
              </p>

              <Button
                asChild
                className="mt-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 font-bold text-white"
              >
                <Link href="/dashboard/links/create">Create First Link</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {paginatedLinks.map((link) => {
              const id = getLinkId(link);
              const shortUrl = getShortUrl(link);
              const status = getLinkStatus(link);

              return (
                <div
                  key={id}
                  className="group rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 transition hover:-translate-y-1 hover:bg-white hover:shadow-xl"
                >
                  <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <p className="break-all text-lg font-black text-primary">
                          {shortUrl}
                        </p>

                        <span
                          className={
                            status === "Active"
                              ? "rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-600"
                              : status === "Expired"
                                ? "rounded-full bg-amber-50 px-3 py-1 text-xs font-black text-amber-600"
                                : "rounded-full bg-red-50 px-3 py-1 text-xs font-black text-red-600"
                          }
                        >
                          {status}
                        </span>
                      </div>

                      <p className="mt-1 truncate text-sm text-slate-500">
                        {link.originalUrl}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-3 text-xs font-bold text-slate-500">
                        <span>{getClickCount(link)} clicks</span>
                        <span>Code: {link.shortCode}</span>
                        <span>
                          Created:{" "}
                          {new Date(link.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-xl"
                        onClick={() => window.open(shortUrl, "_blank")}
                      >
                        <ExternalLink className="mr-2 size-4" />
                        Visit
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-xl"
                        onClick={() => handleCopy(shortUrl)}
                      >
                        <Copy className="mr-2 size-4" />
                        Copy
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-xl"
                        onClick={() => handleOpenQr(link)}
                      >
                        <QrCode className="mr-2 size-4" />
                        QR
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-xl"
                        asChild
                      >
                        <Link href={`/dashboard/links/${id}`}>Details</Link>
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        disabled={deletingId === id}
                        onClick={() => setDeleteTarget(link)}
                        className="rounded-xl text-red-600 hover:bg-red-50 hover:text-red-700"
                      >
                        {deletingId === id ? (
                          <Loader2 className="mr-2 size-4 animate-spin" />
                        ) : (
                          <Trash2 className="mr-2 size-4" />
                        )}
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {filteredLinks.length > 0 && (
          <div className="mt-6 flex flex-col gap-4 border-t border-slate-200 pt-5 md:flex-row md:items-center md:justify-between">
            <p className="text-sm font-medium text-slate-500">
              Showing{" "}
              <span className="font-black text-slate-950">{startItem}</span> to{" "}
              <span className="font-black text-slate-950">{endItem}</span> of{" "}
              <span className="font-black text-slate-950">
                {filteredLinks.length}
              </span>{" "}
              links
            </p>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                className="h-10 rounded-2xl font-bold"
              >
                <ChevronLeft className="mr-2 size-4" />
                Previous
              </Button>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-black text-slate-700">
                Page {currentPage} of {totalPages}
              </div>

              <Button
                type="button"
                variant="outline"
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((page) => Math.min(totalPages, page + 1))
                }
                className="h-10 rounded-2xl font-bold"
              >
                Next
                <ChevronRight className="ml-2 size-4" />
              </Button>
            </div>
          </div>
        )}
      </section>
      <Dialog open={Boolean(selectedQrUrl)} onOpenChange={handleCloseQr}>
        <DialogContent className="rounded-[2rem] border-slate-200 bg-white p-0 sm:max-w-md">
          <div className="overflow-hidden rounded-[2rem]">
            <div className="bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 px-6 py-5 text-white">
              <DialogHeader>
                <DialogTitle className="text-xl font-black">
                  QR Code Preview
                </DialogTitle>
              </DialogHeader>

              <p className="mt-2 break-all text-sm font-medium text-cyan-50">
                {selectedQrUrl}
              </p>
            </div>

            <div className="p-6">
              <div className="rounded-[1.5rem] bg-gradient-to-br from-cyan-50 via-white to-violet-50 p-6 text-center">
                <div
                  ref={qrCodeRef}
                  className="mx-auto flex size-56 items-center justify-center rounded-3xl bg-white p-4 shadow-xl shadow-slate-200/70"
                >
                  {selectedQrUrl && <QRCode value={selectedQrUrl} size={180} />}
                </div>

                <p className="mt-5 text-sm font-bold text-slate-600">
                  Scan this QR code to open your short link.
                </p>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleCopy(selectedQrUrl)}
                  className="h-12 rounded-2xl font-bold"
                >
                  <Copy className="mr-2 size-4" />
                  Copy Link
                </Button>

                <Button
                  type="button"
                  onClick={handleDownloadQrCode}
                  className="h-12 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 font-bold text-white"
                >
                  <Download className="mr-2 size-4" />
                  Download
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <AlertDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent className="rounded-[2rem] border-slate-200 bg-white">
          <AlertDialogHeader>
            <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
              <Trash2 className="size-7" />
            </div>

            <AlertDialogTitle className="text-2xl font-black text-slate-950">
              Delete this link?
            </AlertDialogTitle>

            <AlertDialogDescription className="text-sm leading-6 text-slate-600">
              This action will remove the selected short link from your
              dashboard. Visitors may no longer be able to access this short URL
              after deletion.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {deleteTarget && (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Short link
              </p>

              <p className="mt-1 break-all text-sm font-black text-primary">
                {getShortUrl(deleteTarget)}
              </p>

              <p className="mt-2 line-clamp-2 break-all text-xs leading-5 text-slate-500">
                {deleteTarget.originalUrl}
              </p>
            </div>
          )}

          <AlertDialogFooter className="gap-3 sm:gap-2">
            <AlertDialogCancel className="h-11 rounded-2xl font-bold">
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={handleDelete}
              className="h-11 rounded-2xl bg-red-600 font-bold text-white hover:bg-red-700"
            >
              {deleteTarget && deletingId === getLinkId(deleteTarget) ? (
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
