import { axiosInstance } from "@/lib/axios";

import type {
  TAnalyticsOverview,
  TBrowserClick,
  TBrowserVisit,
  TCampaignAnalytics,
  TDailyClick,
  TDailyVisit,
  TDateFilterParams,
  TDeviceClick,
  TDeviceVisit,
  TLinkAnalyticsSummary,
  TPageAnalytics,
  TPageLinkClick,
  TPageLinkDailyClick,
  TReferrerClick,
  TReferrerVisit,
} from "@/types/analytics.type";
import type { TApiResponse } from "@/types/response.type";

function buildQuery(params?: TDateFilterParams) {
  const searchParams = new URLSearchParams();

  if (params?.startDate) {
    searchParams.set("startDate", params.startDate);
  }

  if (params?.endDate) {
    searchParams.set("endDate", params.endDate);
  }

  const query = searchParams.toString();

  return query ? `?${query}` : "";
}

export const AnalyticsService = {
  getOverview: async (params?: TDateFilterParams) => {
    const { data } = await axiosInstance.get<TApiResponse<TAnalyticsOverview>>(
      `/analytics/overview${buildQuery(params)}`,
    );

    return data;
  },

  getLinkAnalytics: async (linkId: string, params?: TDateFilterParams) => {
    const { data } = await axiosInstance.get<
      TApiResponse<TLinkAnalyticsSummary>
    >(`/analytics/links/${linkId}${buildQuery(params)}`);

    return data;
  },

  getLinkDailyClicks: async (linkId: string, params?: TDateFilterParams) => {
    const { data } = await axiosInstance.get<TApiResponse<TDailyClick[]>>(
      `/analytics/links/${linkId}/daily-clicks${buildQuery(params)}`,
    );

    return data;
  },

  getLinkDevices: async (linkId: string, params?: TDateFilterParams) => {
    const { data } = await axiosInstance.get<TApiResponse<TDeviceClick[]>>(
      `/analytics/links/${linkId}/devices${buildQuery(params)}`,
    );

    return data;
  },

  getLinkBrowsers: async (linkId: string, params?: TDateFilterParams) => {
    const { data } = await axiosInstance.get<TApiResponse<TBrowserClick[]>>(
      `/analytics/links/${linkId}/browsers${buildQuery(params)}`,
    );

    return data;
  },

  getLinkReferrers: async (linkId: string, params?: TDateFilterParams) => {
    const { data } = await axiosInstance.get<TApiResponse<TReferrerClick[]>>(
      `/analytics/links/${linkId}/referrers${buildQuery(params)}`,
    );

    return data;
  },

  getCampaignAnalytics: async (
    campaignId: string,
    params?: TDateFilterParams,
  ) => {
    const { data } = await axiosInstance.get<TApiResponse<TCampaignAnalytics>>(
      `/analytics/campaigns/${campaignId}${buildQuery(params)}`,
    );

    return data;
  },

  getCampaignDailyClicks: async (
    campaignId: string,
    params?: TDateFilterParams,
  ) => {
    const { data } = await axiosInstance.get<TApiResponse<TDailyClick[]>>(
      `/analytics/campaigns/${campaignId}/daily-clicks${buildQuery(params)}`,
    );

    return data;
  },

  getCampaignDevices: async (
    campaignId: string,
    params?: TDateFilterParams,
  ) => {
    const { data } = await axiosInstance.get<TApiResponse<TDeviceClick[]>>(
      `/analytics/campaigns/${campaignId}/devices${buildQuery(params)}`,
    );

    return data;
  },

  getPageAnalytics: async (pageId: string, params?: TDateFilterParams) => {
    const { data } = await axiosInstance.get<TApiResponse<TPageAnalytics>>(
      `/analytics/pages/${pageId}${buildQuery(params)}`,
    );

    return data;
  },

  getPageDailyVisits: async (pageId: string, params?: TDateFilterParams) => {
    const { data } = await axiosInstance.get<TApiResponse<TDailyVisit[]>>(
      `/analytics/pages/${pageId}/daily-visits${buildQuery(params)}`,
    );

    return data;
  },

  getPageDevices: async (pageId: string, params?: TDateFilterParams) => {
    const { data } = await axiosInstance.get<TApiResponse<TDeviceVisit[]>>(
      `/analytics/pages/${pageId}/devices${buildQuery(params)}`,
    );

    return data;
  },

  getPageBrowsers: async (pageId: string, params?: TDateFilterParams) => {
    const { data } = await axiosInstance.get<TApiResponse<TBrowserVisit[]>>(
      `/analytics/pages/${pageId}/browsers${buildQuery(params)}`,
    );

    return data;
  },

  getPageReferrers: async (pageId: string, params?: TDateFilterParams) => {
    const { data } = await axiosInstance.get<TApiResponse<TReferrerVisit[]>>(
      `/analytics/pages/${pageId}/referrers${buildQuery(params)}`,
    );

    return data;
  },

  getPageLinkClicks: async (pageId: string, params?: TDateFilterParams) => {
    const { data } = await axiosInstance.get<TApiResponse<TPageLinkClick[]>>(
      `/analytics/pages/${pageId}/link-clicks${buildQuery(params)}`,
    );

    return data;
  },

  getPageLinkDailyClicks: async (
    pageId: string,
    params?: TDateFilterParams,
  ) => {
    const { data } = await axiosInstance.get<
      TApiResponse<TPageLinkDailyClick[]>
    >(`/analytics/pages/${pageId}/link-clicks/daily${buildQuery(params)}`);

    return data;
  },

  getCampaignBrowsers: async (
    campaignId: string,
    params?: TDateFilterParams,
  ) => {
    const { data } = await axiosInstance.get<TApiResponse<TBrowserClick[]>>(
      `/analytics/campaigns/${campaignId}/browsers${buildQuery(params)}`,
    );

    return data;
  },

  getCampaignReferrers: async (
    campaignId: string,
    params?: TDateFilterParams,
  ) => {
    const { data } = await axiosInstance.get<TApiResponse<TReferrerClick[]>>(
      `/analytics/campaigns/${campaignId}/referrers${buildQuery(params)}`,
    );

    return data;
  },
};
