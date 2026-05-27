import { axiosInstance } from "@/lib/axios";
import type {
  TCreateLinkPayload,
  TLink,
  TUpdateLinkPayload,
} from "@/types/link.type";
import type { TApiResponse } from "@/types/response.type";

export const LinkService = {
  createLink: async (payload: TCreateLinkPayload) => {
    const { data } = await axiosInstance.post<TApiResponse<TLink>>(
      "/links",
      payload,
    );

    return data;
  },

  getAllLinks: async () => {
    const { data } = await axiosInstance.get<TApiResponse<TLink[]>>("/links");

    return data;
  },

  getSingleLink: async (id: string) => {
    const { data } = await axiosInstance.get<TApiResponse<TLink>>(
      `/links/${id}`,
    );

    return data;
  },

  updateLink: async (id: string, payload: TUpdateLinkPayload) => {
    const { data } = await axiosInstance.patch<TApiResponse<TLink>>(
      `/links/${id}`,
      payload,
    );

    return data;
  },

  deleteLink: async (id: string) => {
    const { data } = await axiosInstance.delete<TApiResponse<null>>(
      `/links/${id}`,
    );

    return data;
  },
};
