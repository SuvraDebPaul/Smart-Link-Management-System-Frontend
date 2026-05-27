import { axiosInstance } from "@/lib/axios";
import {
  TAuthResponse,
  TLoginPayload,
  TRegisterPayload,
} from "@/types/auth.type";
import { TApiResponse } from "@/types/response.type";

export const AuthService = {
  register: async (payload: TRegisterPayload) => {
    const { data } = await axiosInstance.post<TApiResponse<TAuthResponse>>(
      "/auth/register",
      payload,
    );

    return data;
  },
  login: async (payload: TLoginPayload) => {
    const { data } = await axiosInstance.post<TApiResponse<TAuthResponse>>(
      "/auth/login",
      payload,
    );

    return data;
  },
};
