export type TApiKey = {
  _id?: string;
  id?: string;
  name: string;
  keyPrefix: string;
  lastUsedAt?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
};

export type TCreatedApiKey = {
  id: string;
  name: string;
  key: string;
  keyPrefix: string;
  isActive: boolean;
  createdAt: string;
};

export type TCreateApiKeyPayload = {
  name: string;
};
