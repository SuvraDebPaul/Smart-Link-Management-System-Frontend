import { axiosInstance } from "@/lib/axios";
import {
  TCreateDomainPayload,
  TDomain,
  TUpdateDomainPayload,
} from "@/types/domain.type";
import { TApiResponse } from "@/types/response.type";

export const DomainService = {
  createDomain: async (payload: TCreateDomainPayload) => {
    const { data } = await axiosInstance.post<TApiResponse<TDomain>>(
      "/domains",
      payload,
    );

    return data;
  },

  getMyDomain: async () => {
    const { data } = await axiosInstance.get<TApiResponse<TDomain>>("/domains");

    return data;
  },

  getSingleDomain: async (id: string) => {
    const { data } = await axiosInstance.get<TApiResponse<TDomain>>(
      `/domains/${id}`,
    );

    return data;
  },

  updateDomain: async (id: string, payload: TUpdateDomainPayload) => {
    const { data } = await axiosInstance.patch<TApiResponse<TDomain>>(
      `/domains/${id}`,
      payload,
    );

    return data;
  },

  deleteDomain: async (id: string) => {
    const { data } = await axiosInstance.delete<TApiResponse<TDomain>>(
      `/domains/${id}`,
    );

    return data;
  },

  verifyDomainManually: async (id: string) => {
    const { data } = await axiosInstance.post<TApiResponse<TDomain>>(
      `/domains/${id}/verify`,
    );

    return data;
  },

  verifyDomainDns: async (id: string) => {
    const { data } = await axiosInstance.post<TApiResponse<TDomain>>(
      `/domains/${id}/verify-dns`,
    );

    return data;
  },
};
