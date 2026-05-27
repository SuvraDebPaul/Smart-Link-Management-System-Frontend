export type TMeta = {
  page?: number;
  limit?: number;
  total?: number;
  totalPage?: number;
};

export type TErrorSource = {
  path: string;
  message: string;
};

export type TApiResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
  meta?: TMeta;
  errorSource?: TErrorSource[];
};
