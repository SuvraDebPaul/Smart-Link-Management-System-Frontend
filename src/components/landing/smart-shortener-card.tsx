"use client";

import { FormEvent, useMemo, useRef, useState } from "react";
import QRCode from "react-qr-code";
import {
  CalendarClock,
  CheckCircle2,
  Copy,
  Download,
  ExternalLink,
  Eye,
  EyeOff,
  Link2,
  Loader2,
  LockKeyhole,
  QrCode,
  Sparkles,
  WandSparkles,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type TShortenerOption = "custom" | "password" | "expiry" | "qr";

type TGeneratedLink = {
  originalUrl: string;
  shortUrl: string;
  customAlias?: string;
  password?: string;
  expiresAt?: string;
  qrEnabled: boolean;
};

const optionCards: {
  key: TShortenerOption;
  title: string;
  description: string;
  icon: typeof Link2;
  className: string;
  activeClassName: string;
}[] = [
  {
    key: "custom",
    title: "Custom Link",
    description: "Choose your own alias",
    icon: Link2,
    className: "border-blue-200 bg-blue-50/50 text-blue-700",
    activeClassName: "border-blue-500 bg-blue-100 shadow-blue-100",
  },
  {
    key: "password",
    title: "Password",
    description: "Protect private links",
    icon: LockKeyhole,
    className: "border-emerald-200 bg-emerald-50/50 text-emerald-700",
    activeClassName: "border-emerald-500 bg-emerald-100 shadow-emerald-100",
  },
  {
    key: "expiry",
    title: "Expiry Date",
    description: "Auto-disable later",
    icon: CalendarClock,
    className: "border-violet-200 bg-violet-50/50 text-violet-700",
    activeClassName: "border-violet-500 bg-violet-100 shadow-violet-100",
  },
  {
    key: "qr",
    title: "QR Code",
    description: "Generate shareable QR",
    icon: QrCode,
    className: "border-amber-200 bg-amber-50/50 text-amber-700",
    activeClassName: "border-amber-500 bg-amber-100 shadow-amber-100",
  },
];

function isValidUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function createDemoShortCode() {
  return Math.random().toString(36).slice(2, 8);
}

export function SmartShortenerCard() {
  const qrCodeRef = useRef<HTMLDivElement | null>(null);

  const [longUrl, setLongUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [password, setPassword] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [activeOptions, setActiveOptions] = useState<TShortenerOption[]>([
    "custom",
    "qr",
  ]);
  const [showPassword, setShowPassword] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<TGeneratedLink | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);

  const validUrl = useMemo(() => {
    if (!longUrl.trim()) return false;
    return isValidUrl(longUrl.trim());
  }, [longUrl]);

  const hasOption = (option: TShortenerOption) =>
    activeOptions.includes(option);

  const toggleOption = (option: TShortenerOption) => {
    setActiveOptions((current) =>
      current.includes(option)
        ? current.filter((item) => item !== option)
        : [...current, option],
    );
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setLongUrl(text);
      toast.success("URL pasted successfully");
    } catch {
      toast.error("Unable to read clipboard");
    }
  };

  const handleClearUrl = () => {
    setLongUrl("");
    setGeneratedLink(null);
  };

  const handleCopy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success("Short link copied");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const handleDownloadQrCode = async () => {
    if (!qrCodeRef.current || !generatedLink) {
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
      downloadLink.download = `smart-link-qr-${Date.now()}.png`;

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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validUrl) {
      toast.error("Please enter a valid URL");
      return;
    }

    if (
      hasOption("custom") &&
      customAlias &&
      !/^[a-zA-Z0-9-]+$/.test(customAlias)
    ) {
      toast.error(
        "Custom alias can only contain letters, numbers, and hyphens",
      );
      return;
    }

    if (hasOption("password") && password && password.length < 4) {
      toast.error("Password should be at least 4 characters");
      return;
    }

    setIsLoading(true);

    /**
     * Later we will replace this demo generation with your backend API:
     *
     * POST /api/links
     *
     * Payload example:
     * {
     *   originalUrl: longUrl,
     *   customAlias,
     *   password,
     *   expiresAt
     * }
     */

    await new Promise((resolve) => setTimeout(resolve, 700));

    const shortCode =
      hasOption("custom") && customAlias
        ? customAlias.toLowerCase()
        : createDemoShortCode();

    const result: TGeneratedLink = {
      originalUrl: longUrl,
      customAlias: hasOption("custom") ? customAlias : undefined,
      password: hasOption("password") ? password : undefined,
      expiresAt: hasOption("expiry") ? expiresAt : undefined,
      qrEnabled: hasOption("qr"),
      shortUrl: `https://shortenlink.com/${shortCode}`,
    };

    setGeneratedLink(result);
    setIsLoading(false);
    toast.success("Link shortened successfully");
  };

  return (
    <Card className="relative overflow-hidden rounded-2xl border-slate-200 bg-white/95">
      <div className="absolute inset-x-0 top-0 h-1.5 bg-linear-to-r from-cyan-500 via-indigo-500 to-violet-500" />

      <CardContent className="p-4 sm:p-6">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <Badge className="mb-3 rounded-full bg-cyan-50 text-primary hover:bg-cyan-50">
              <Sparkles className="mr-1.5 size-3.5" />
              Live Shortener
            </Badge>

            <h2 className="text-2xl font-bold tracking-tight text-slate-950">
              Create a smart link
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Add branding, protection, expiration, and QR support.
            </p>
          </div>

          <div className="hidden rounded-2xl bg-slate-950 px-3 py-2 text-xs font-semibold text-white sm:block">
            API Ready
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Link2 className="size-4 text-primary" />
              Destination URL
            </label>

            <div
              className={cn(
                "flex rounded-2xl border bg-white p-1.5 shadow-sm transition",
                longUrl && validUrl && "border-emerald-300 bg-emerald-50/40",
                longUrl && !validUrl && "border-red-300 bg-red-50/40",
                !longUrl && "border-slate-200",
              )}
            >
              <Input
                value={longUrl}
                onChange={(event) => setLongUrl(event.target.value)}
                placeholder="https://example.com/very-long-url"
                className="h-12 flex-1 border-0 bg-transparent text-base shadow-none focus-visible:ring-0"
              />

              {longUrl && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handleClearUrl}
                  className="h-12 w-12 rounded-xl text-slate-400 hover:text-red-500"
                >
                  <X className="size-4" />
                </Button>
              )}

              <Button
                type="button"
                variant="ghost"
                onClick={handlePaste}
                className="h-12 rounded-xl text-primary"
              >
                Paste
              </Button>
            </div>

            {longUrl && (
              <div
                className={cn(
                  "mt-2 flex items-center gap-2 text-sm font-medium",
                  validUrl ? "text-emerald-600" : "text-red-500",
                )}
              >
                {validUrl ? (
                  <>
                    <CheckCircle2 className="size-4" />
                    Valid URL
                  </>
                ) : (
                  <>
                    <X className="size-4" />
                    Invalid URL
                  </>
                )}
              </div>
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {optionCards.map((option) => {
              const active = hasOption(option.key);

              return (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => toggleOption(option.key)}
                  className={cn(
                    "rounded-2xl border p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md",
                    option.className,
                    active && option.activeClassName,
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-11 items-center justify-center rounded-xl bg-white/80">
                      <option.icon className="size-5" />
                    </div>

                    <div>
                      <p className="font-bold">{option.title}</p>
                      <p className="text-xs opacity-80">{option.description}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-4">
            {hasOption("custom") && (
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Custom Link
                </label>

                <div className="flex overflow-hidden rounded-2xl border border-slate-200 bg-white">
                  <div className="flex items-center border-r border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-500">
                    shortenlink.com/
                  </div>

                  <Input
                    value={customAlias}
                    onChange={(event) => setCustomAlias(event.target.value)}
                    placeholder="my-custom-link"
                    className="h-12 border-0 shadow-none focus-visible:ring-0"
                  />
                </div>
              </div>
            )}

            {hasOption("password") && (
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Password Protection
                </label>

                <div className="flex rounded-2xl border border-slate-200 bg-white p-1.5">
                  <Input
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password to protect this link"
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
            )}

            {hasOption("expiry") && (
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Expiration Date & Time
                </label>

                <Input
                  value={expiresAt}
                  onChange={(event) => setExpiresAt(event.target.value)}
                  type="datetime-local"
                  className="h-12 rounded-2xl bg-white"
                />
              </div>
            )}

            {hasOption("qr") && (
              <div className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700">
                <QrCode className="size-5" />
                QR code will be generated after the short link is created.
              </div>
            )}
          </div>

          <Button
            disabled={isLoading}
            className="h-14 w-full rounded-2xl bg-linear-to-r from-cyan-600 to-indigo-600 text-base font-bold text-white shadow-sm shadow-cyan-600/20 hover:from-cyan-700 hover:to-indigo-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 size-5 animate-spin" />
                Creating smart link...
              </>
            ) : (
              <>
                <WandSparkles className="mr-2 size-5" />
                Shorten Now
              </>
            )}
          </Button>
        </form>

        {generatedLink && (
          <>
            <Separator className="my-6" />

            <div className="rounded-3xl border border-emerald-200 bg-emerald-50/60 p-4">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-emerald-500 text-white">
                  <CheckCircle2 className="size-6" />
                </div>

                <div>
                  <h3 className="font-bold text-slate-950">
                    Link shortened successfully!
                  </h3>
                  <p className="text-sm text-slate-600">
                    Your smart link is ready to share.
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-emerald-200 bg-white p-4 shadow-sm">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Shortened link
                </p>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="break-all text-lg font-bold text-primary">
                    {generatedLink.shortUrl}
                  </p>

                  <div className="flex gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        window.open(generatedLink.shortUrl, "_blank")
                      }
                    >
                      <ExternalLink className="mr-2 size-4" />
                      Visit
                    </Button>

                    <Button
                      type="button"
                      size="sm"
                      onClick={() => handleCopy(generatedLink.shortUrl)}
                    >
                      <Copy className="mr-2 size-4" />
                      Copy
                    </Button>
                  </div>
                </div>
              </div>

              {generatedLink.qrEnabled && (
                <div className="mt-4 rounded-2xl border border-violet-200 bg-white p-5 text-center shadow-sm">
                  <p className="mb-4 text-sm font-semibold text-slate-600">
                    QR Code
                  </p>

                  <div
                    ref={qrCodeRef}
                    className="mx-auto flex size-44 items-center justify-center rounded-2xl bg-white p-3"
                  >
                    <QRCode value={generatedLink.shortUrl} size={145} />
                  </div>

                  <Button
                    type="button"
                    onClick={handleDownloadQrCode}
                    className="mt-5 rounded-xl bg-linear-to-r from-cyan-600 to-indigo-600 text-white hover:from-cyan-700 hover:to-indigo-700"
                  >
                    <Download className="mr-2 size-4" />
                    Download QR Code
                  </Button>
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
