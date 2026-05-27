"use client";

import { Copy, ExternalLink, QrCode, Share2, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const recentLinks = [
  {
    id: "1",
    shortUrl: "https://shortenlink.com/suvra",
    originalUrl: "https://www.linkedin.com/in/suvra-deb-paul",
    label: "Profile Link",
    clicks: 128,
  },
  {
    id: "2",
    icon: TrendingUp,
    shortUrl: "https://shortenlink.com/launch",
    originalUrl: "https://example.com/product-launch-campaign-summer-offer",
    label: "Campaign Link",
    clicks: 342,
  },
];

export function RecentLinksPreview() {
  const handleCopy = async (url: string) => {
    await navigator.clipboard.writeText(url);
    toast.success("Link copied");
  };

  const handleShare = async (url: string) => {
    if (!navigator.share) {
      await handleCopy(url);
      return;
    }

    await navigator.share({
      title: "Smart Link",
      url,
    });
  };

  return (
    <div className="mt-12 rounded-4xl border border-slate-200 bg-slate-950 p-5 shadow-2xl shadow-slate-200/70">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-cyan-300">
            Recent Smart Links
          </p>
          <h2 className="mt-1 text-2xl font-bold text-white">
            Share, copy, visit, and generate QR from one place
          </h2>
        </div>

        <Badge className="w-fit bg-white/10 text-white hover:bg-white/10">
          Live Preview
        </Badge>
      </div>

      <div className="space-y-4">
        {recentLinks.map((link) => (
          <div
            key={link.id}
            className="rounded-3xl border border-white/10 bg-white p-4 shadow-sm"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex min-w-0 items-start gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-50 text-primary">
                  {/* <link.icon className="size-6" /> */}
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="break-all text-lg font-bold text-primary">
                      {link.shortUrl}
                    </p>

                    <Badge variant="secondary" className="rounded-full">
                      {link.label}
                    </Badge>
                  </div>

                  <p className="mt-1 truncate text-sm text-slate-500">
                    {link.originalUrl}
                  </p>

                  <p className="mt-2 text-xs font-semibold text-emerald-600">
                    {link.clicks} clicks tracked
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.open(link.shortUrl, "_blank")}
                >
                  <ExternalLink className="mr-2 size-4" />
                  Visit
                </Button>

                <Button size="sm" variant="outline">
                  <QrCode className="mr-2 size-4" />
                  QR
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleShare(link.shortUrl)}
                >
                  <Share2 className="mr-2 size-4" />
                  Share
                </Button>

                <Button size="sm" onClick={() => handleCopy(link.shortUrl)}>
                  <Copy className="mr-2 size-4" />
                  Copy
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
