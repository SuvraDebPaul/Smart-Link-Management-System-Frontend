import { axiosInstance } from "@/lib/axios";
import {
  TCreatePagePayload,
  TPage,
  TPublicPage,
  TUpdatePagePayload,
} from "@/types/page.type";
import { TApiResponse } from "@/types/response.type";

export const PageService = {
  createPage: async (payload: TCreatePagePayload) => {
    const { data } = await axiosInstance.post<TApiResponse<TPage>>(
      "/pages",
      payload,
    );
    return data;
  },

  getMyPage: async () => {
    const { data } = await axiosInstance.get<TApiResponse<TPage[]>>("/pages");
    return data;
  },

  getSinglePage: async (id: string) => {
    const { data } = await axiosInstance.get<TApiResponse<TPage>>(
      `/pages/${id}`,
    );
    return data;
  },

  updatePage: async (id: string, payload: TUpdatePagePayload) => {
    const { data } = await axiosInstance.patch<TApiResponse<TPage>>(
      `/pages/${id}`,
      payload,
    );
    return data;
  },

  deletePage: async (id: string) => {
    const { data } = await axiosInstance.delete<TApiResponse<null>>(
      `/pages/${id}`,
    );
    return data;
  },

  getPublicPage: async (slug: string) => {
    const { data } = await axiosInstance.get<TApiResponse<TPublicPage>>(
      `/pages/public/${slug}`,
    );

    return data;
  },
};
