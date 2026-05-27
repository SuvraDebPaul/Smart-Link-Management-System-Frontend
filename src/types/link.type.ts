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
  user?: string;
  originalUrl: string;
  shortCode: string;
  shortUrl?: string;
  customAlias?: string;
  password?: string;
  expiresAt?: string;
  title?: string | null;
  campaignId?: string | null;
  domainId?: string;
  totalClicks?: number;
  clicks?: number;
  isActive?: boolean;
  isDeleted?: boolean;
  createdAt: string;
  updatedAt?: string;
};
