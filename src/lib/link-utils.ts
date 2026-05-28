import type { TLink } from "@/types/link.type";

export function getLinkId(link: TLink) {
  return link._id || link.id || "";
}

export function getShortUrl(link: TLink) {
  if (link.customShortUrl) return link.customShortUrl;

  if (link.shortUrl) return link.shortUrl;

  if (link.domain?.domain) {
    return `https://${link.domain.domain}/${link.shortCode}`;
  }

  const appUrl =
    process.env.NEXT_PUBLIC_SHORT_URL_BASE ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:3000";

  return `${appUrl.replace(/\/$/, "")}/${link.shortCode}`;
}

export function getClickCount(link: TLink) {
  return link.totalClicks || link.clicks || 0;
}

export function getLinkStatus(link: TLink) {
  if (link.expiresAt && new Date(link.expiresAt) < new Date()) {
    return "Expired";
  }

  if (link.isActive === false) {
    return "Inactive";
  }

  return "Active";
}
