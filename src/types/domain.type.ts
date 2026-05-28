export type TDomainStatus = "pending" | "verified" | "failed";

export type TDomainDnsInstruction = {
  type: "TXT";
  name: string;
  value: string;
};

export type TDomain = {
  id: string;
  domain: string;
  status: TDomainStatus;
  verificationToken: string;
  dnsInstruction: TDomainDnsInstruction;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type TCreateDomainPayload = {
  domain: string;
};

export type TUpdateDomainPayload = {
  isActive?: boolean;
};
