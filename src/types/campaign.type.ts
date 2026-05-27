import type { TLink } from "./link.type";

export type TCampaignStatus = "active" | "paused" | "completed";

export type TCampaign = {
  id: string;
  name: string;
  description: string | null;
  status: TCampaignStatus;
  startDate: string | null;
  endDate: string | null;
  goalClicks: number | null;
  totalLinks?: number;
  totalClicks?: number;
  createdAt: string;
  updatedAt: string;
};

export type TCreateCampaignPayload = {
  name: string;
  description?: string | null;
  status?: TCampaignStatus;
  startDate?: string | null;
  endDate?: string | null;
  goalClicks?: number | null;
};

export type TUpdateCampaignPayload = Partial<TCreateCampaignPayload>;

export type TCampaignResponse = {
  success: boolean;
  message: string;
  data: TCampaign;
};

export type TCampaignListResponse = {
  success: boolean;
  message: string;
  data: TCampaign[];
};

export type TCampaignLinksResponse = {
  success: boolean;
  message: string;
  data: TLink[];
};

export type TCampaignLinkActionResponse = {
  success: boolean;
  message: string;
  data: TLink;
};

export type TCampaignDailyClick = {
  date: string;
  clicks: number;
};

export type TCampaignDeviceStat = {
  device: string;
  clicks: number;
};

export type TCampaignDailyClicksResponse = {
  success: boolean;
  message: string;
  data: TCampaignDailyClick[];
};

export type TCampaignDevicesResponse = {
  success: boolean;
  message: string;
  data: TCampaignDeviceStat[];
};
