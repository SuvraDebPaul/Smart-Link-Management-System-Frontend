export type TLinkStatus = "active" | "inactive" | "expired";

export type TCreateLinkPayload = {
  originalUrl: string;
  customAlias?: string;
  password?: string;
  expiresAt?: string;
  campaignId?: string | null;
  domainId?: string | null;
};

export type TUpdateLinkPayload = Partial<TCreateLinkPayload> & {
  isActive?: boolean;
};

export type TLink = {
  _id?: string;
  id?: string;

  originalUrl: string;
  shortCode: string;

  shortUrl?: string;
  defaultShortUrl?: string;
  customShortUrl?: string | null;

  campaignId?: string | null;
  domainId?: string | null;

  domain?: {
    id: string;
    domain: string;
    status?: string;
    isActive?: boolean;
  } | null;

  clicks?: number;
  totalClicks?: number;
  isActive?: boolean;
  isPasswordProtected?: boolean;
  expiresAt?: string | null;
  maxClicks?: number | null;

  createdAt: string;
  updatedAt: string;
};
