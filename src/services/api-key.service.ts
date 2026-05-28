import { axiosInstance } from "@/lib/axios";
import {
  TApiKey,
  TCreateApiKeyPayload,
  TCreatedApiKey,
} from "@/types/api-key.type";
import { TApiResponse } from "@/types/response.type";

export const ApiKeyService = {
  createApiKey: async (payload: TCreateApiKeyPayload) => {
    const { data } = await axiosInstance.post<TApiResponse<TCreatedApiKey>>(
      "/api-keys",
      payload,
    );
    return data;
  },

  getMyApiKeys: async () => {
    const { data } =
      await axiosInstance.get<TApiResponse<TApiKey[]>>("/api-keys");

    return data;
  },

  revokeApiKey: async (id: string) => {
    const { data } = await axiosInstance.delete<TApiResponse<TApiKey>>(
      `/api-keys/${id}`,
    );

    return data;
  },
};
