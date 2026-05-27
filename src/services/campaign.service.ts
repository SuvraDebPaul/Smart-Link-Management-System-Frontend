import { axiosInstance } from "@/lib/axios";

import type {
  TCampaign,
  TCampaignDailyClicksResponse,
  TCampaignDevicesResponse,
  TCreateCampaignPayload,
  TUpdateCampaignPayload,
} from "@/types/campaign.type";
import type { TLink } from "@/types/link.type";
import type { TApiResponse } from "@/types/response.type";

export const CampaignService = {
  createCampaign: async (payload: TCreateCampaignPayload) => {
    const { data } = await axiosInstance.post<TApiResponse<TCampaign>>(
      "/campaigns",
      payload,
    );

    return data;
  },

  getAllCampaigns: async () => {
    const { data } =
      await axiosInstance.get<TApiResponse<TCampaign[]>>("/campaigns");

    return data;
  },

  getSingleCampaign: async (id: string) => {
    const { data } = await axiosInstance.get<TApiResponse<TCampaign>>(
      `/campaigns/${id}`,
    );

    return data;
  },

  updateCampaign: async (id: string, payload: TUpdateCampaignPayload) => {
    const { data } = await axiosInstance.patch<TApiResponse<TCampaign>>(
      `/campaigns/${id}`,
      payload,
    );

    return data;
  },

  deleteCampaign: async (id: string) => {
    const { data } = await axiosInstance.delete<TApiResponse<null>>(
      `/campaigns/${id}`,
    );

    return data;
  },

  getCampaignLinks: async (campaignId: string) => {
    const { data } = await axiosInstance.get<TApiResponse<TLink[]>>(
      `/campaigns/${campaignId}/links`,
    );

    return data;
  },

  getAvailableCampaignLinks: async (campaignId: string) => {
    const { data } = await axiosInstance.get<TApiResponse<TLink[]>>(
      `/campaigns/${campaignId}/available-links`,
    );

    return data;
  },

  addLinkToCampaign: async (campaignId: string, linkId: string) => {
    console.log(campaignId, linkId);
    const { data } = await axiosInstance.patch<TApiResponse<TLink>>(
      `/campaigns/${campaignId}/links/${linkId}/add`,
    );
    console.log(data);
    return data;
  },

  removeLinkFromCampaign: async (campaignId: string, linkId: string) => {
    const { data } = await axiosInstance.patch<TApiResponse<TLink>>(
      `/campaigns/${campaignId}/links/${linkId}/remove`,
    );

    return data;
  },
  getCampaignDailyClicks: async (campaignId: string) => {
    const { data } = await axiosInstance.get<TCampaignDailyClicksResponse>(
      `/campaigns/${campaignId}/daily-clicks`,
    );

    return data;
  },

  getCampaignDevices: async (campaignId: string) => {
    const { data } = await axiosInstance.get<TCampaignDevicesResponse>(
      `/campaigns/${campaignId}/devices`,
    );

    return data;
  },
};
