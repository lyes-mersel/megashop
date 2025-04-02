export type SocialNetworks = {
  id: number;
  name: string;
  icon: React.ReactNode;
  url: string;
};

export type FLink = {
  id: number;
  label: string;
  url: string;
};

export type FooterLinks = {
  id: number;
  title: string;
  children: FLink[];
};
