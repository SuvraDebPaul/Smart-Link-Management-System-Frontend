export type TPageTheme = "light" | "dark" | "gradient";

export type TPageLink = {
  title: string;
  url?: string;
  originalUrl?: string;
  clickUrl?: string;
  order: number;
  isActive: boolean;
};

export type TPage = {
  id: string;
  slug: string;
  pageUrl: string;
  title: string;
  bio: string | null;
  avatarUrl: string | null;
  theme: TPageTheme;
  links: TPageLink[];
  visits: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
};

export type TPublicPage = {
  slug: string;
  title: string;
  bio: string | null;
  avatarUrl: string | null;
  theme: TPageTheme;
  links: TPageLink[];
  visits: number;
};

export type TCreatePagePayload = {
  slug: string;
  title: string;
  bio?: string | null;
  avatarUrl?: string | null;
  theme?: TPageTheme;
  links?: TPageLink[];
  isPublished?: boolean;
};

export type TUpdatePagePayload = Partial<TCreatePagePayload>;
