export type TDateFilterParams = {
  startDate?: string;
  endDate?: string;
};

export type TLinkAnalyticsSummary = {
  link: {
    id: string;
    originalUrl: string;
    shortCode: string;
    clicks: number;
    isActive: boolean;
    isPasswordProtected: boolean;
    expiresAt?: string | null;
    maxClicks?: number | null;
    createdAt: string;
  };
  totalClicks: number;
  uniqueVisitors: number;
  lastClick?: {
    clickedAt: string;
    browser?: string | null;
    os?: string | null;
    device?: string | null;
    referrer?: string | null;
  } | null;
};

export type TDailyClick = {
  date: string;
  clicks: number;
};

export type TDeviceClick = {
  device: string | null;
  clicks: number;
};

export type TBrowserClick = {
  browser: string | null;
  clicks: number;
};

export type TReferrerClick = {
  referrer: string | null;
  clicks: number;
};

export type TCampaignAnalytics = {
  campaign: {
    id: string;
    name: string;
    description?: string | null;
    status: "active" | "paused" | "completed";
    startDate?: string | null;
    endDate?: string | null;
    goalClicks?: number | null;
  };
  totalLinks: number;
  totalClicks: number;
  uniqueVisitors: number;
  goalProgress: number | null;
  topLinks: TTopLinkAnalytics[];
};

export type TPageAnalytics = {
  page: {
    id: string;
    slug: string;
    title: string;
    visits: number;
    isPublished: boolean;
    theme: "light" | "dark" | "gradient";
    createdAt: string;
  };
  totalVisits: number;
  uniqueVisitors: number;
  lastVisit?: {
    visitedAt: string;
    browser?: string | null;
    os?: string | null;
    device?: string | null;
    referrer?: string | null;
  } | null;
};

export type TDailyVisit = {
  date: string;
  visits: number;
};

export type TDeviceVisit = {
  device: string | null;
  visits: number;
};

export type TBrowserVisit = {
  browser: string | null;
  visits: number;
};

export type TReferrerVisit = {
  referrer: string | null;
  visits: number;
};

export type TPageLinkClick = {
  linkIndex: number;
  linkTitle: string;
  linkUrl: string;
  clicks: number;
};

export type TPageLinkDailyClick = {
  date: string;
  linkIndex: number;
  linkTitle: string;
  clicks: number;
};

export type TTopLinkAnalytics = {
  linkId: string;
  originalUrl: string;
  shortCode: string;
  isActive: boolean;
  clicks: number;
};

export type TTopCampaignAnalytics = {
  campaignId: string;
  name: string;
  status: "active" | "paused" | "completed";
  clicks: number;
};

export type TTopPageAnalytics = {
  pageId: string;
  title: string;
  slug: string;
  visits: number;
  linkClicks: number;
};

export type TOverviewDailyActivity = {
  date: string;
  clicks: number;
  visits: number;
};

export type TOverviewDevice = {
  device: string;
  total: number;
};

export type TOverviewBrowser = {
  browser: string;
  total: number;
};

export type TOverviewReferrer = {
  referrer: string;
  total: number;
};

export type TAnalyticsOverview = {
  totalLinks: number;
  totalClicks: number;
  activeLinks: number;
  inactiveLinks: number;

  totalCampaigns: number;
  totalPages: number;
  totalPageVisits: number;
  totalPageLinkClicks: number;
  uniqueVisitors: number;

  bioPageCtr: number;
  conversionRate: number;

  dailyActivity: TOverviewDailyActivity[];

  topLinks: TTopLinkAnalytics[];
  topCampaigns: TTopCampaignAnalytics[];
  topPages: TTopPageAnalytics[];

  devices: TOverviewDevice[];
  browsers: TOverviewBrowser[];
  referrers: TOverviewReferrer[];
};
