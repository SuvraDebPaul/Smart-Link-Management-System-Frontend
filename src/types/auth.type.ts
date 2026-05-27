export type TUserRole = "user" | "admin";

export type TUser = {
  id: string;
  name: string;
  email: string;
  role: TUserRole;
  createdAt?: string;
  updatedAt?: string;
};

export type TLoginPayload = {
  email: string;
  password: string;
};

export type TRegisterPayload = {
  name: string;
  email: string;
  password: string;
};

export type TAuthResponse = {
  user: TUser;
  accessToken: string;
};
