export type UserRole = 'admin' | 'sales' | 'viewer';

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  technicalSpecs: Record<string, string>;
  images: string[];
  tags: string[];
  relatedProducts: string[];
}

export type LeadStatus = 'new' | 'contacted' | 'quoted' | 'won' | 'lost';

export interface CartItem {
  productId: string;
  quantity: number;
  technicalAnswers?: Record<string, string>;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  eventDate: string;
  location: string;
  note: string;
  status: LeadStatus;
  items: CartItem[];
  createdAt: string;
  userId?: string;
}

export interface SharedFile {
  id: string;
  name: string;
  link: string;
  views: number;
  expiryDate: string;
  clientName: string;
  uploadedBy: string;
}

export interface TeambuildingConcept {
  id: string;
  name: string;
  description: string;
  participantCount: string;
  isIndoor: boolean;
  purpose: string;
  tags: string[];
}

export type Locale = 'az' | 'en' | 'ru' | 'tr';

export interface LocalizedText {
  az: string;
  en: string;
  ru: string;
  tr: string;
}

export interface LocalizedTextArray {
  az: string[];
  en: string[];
  ru: string[];
  tr: string[];
}

export interface HomeHeroSection {
  titleLine1: LocalizedText;
  titleLine2: LocalizedText;
  titleLine3: LocalizedText;
  subtitle: LocalizedText;
  primaryCta: LocalizedText;
  secondaryCta: LocalizedText;
}

export interface HomeCapabilityItem {
  key: string;
  title: LocalizedText;
  description: LocalizedText;
  image: string;
}

export interface HomeCapabilitiesSection {
  badge: LocalizedText;
  title: LocalizedText;
  titleAccent: LocalizedText;
  description: LocalizedText;
  cta: LocalizedText;
  items: HomeCapabilityItem[];
}

export interface HomeEventTypeItem {
  id: string;
  title: LocalizedText;
  subtitle: LocalizedText;
  description: LocalizedText;
  image: string;
}

export interface HomeEventTypesSection {
  badge: LocalizedText;
  title: LocalizedText;
  titleAccent: LocalizedText;
  description: LocalizedText;
  cta: LocalizedText;
  items: HomeEventTypeItem[];
}

export interface HomeFeaturedProject {
  title: LocalizedText;
  location: LocalizedText;
  category: LocalizedText;
  image: string;
  year: string;
}

export interface HomeFeaturedSetupsSection {
  badge: LocalizedText;
  title: LocalizedText;
  titleAccent: LocalizedText;
  viewAll: LocalizedText;
  projects: HomeFeaturedProject[];
}

export interface HomeProcessStep {
  title: LocalizedText;
  description: LocalizedText;
  bg: string;
}

export interface HomeProcessSection {
  badge: LocalizedText;
  title: LocalizedText;
  titleAccent: LocalizedText;
  description: LocalizedText;
  phase: LocalizedText;
  footer: LocalizedText;
  steps: HomeProcessStep[];
}

export interface HomeMetricItem {
  label: LocalizedText;
  value: string;
}

export interface HomeMetricsSection {
  items: HomeMetricItem[];
}

export interface HomeCatalogGatewayStat {
  value: string;
  label: LocalizedText;
}

export interface HomeCatalogGatewaySection {
  badge: LocalizedText;
  title: LocalizedText;
  titleAccent: LocalizedText;
  description: LocalizedText;
  cta: LocalizedText;
  stats: HomeCatalogGatewayStat[];
  image: string;
}

export interface HomeFinalCtaSection {
  title: LocalizedText;
  titleAccent: LocalizedText;
  description: LocalizedText;
  primaryCta: LocalizedText;
  secondaryCta: LocalizedText;
  email: string;
  phone: string;
  address: LocalizedText;
}

export interface ServiceSubItem {
  id: string;
  name: LocalizedText;
  desc: LocalizedText;
  questions: LocalizedTextArray;
}

export interface ServiceCategoryContent {
  id: string;
  path: string;
  title: LocalizedText;
  description: LocalizedText;
  image: string;
  subItems: ServiceSubItem[];
}

export interface HomeTeamMember {
  name: LocalizedText;
  role: LocalizedText;
  description: LocalizedText;
  image: string;
}

export interface HomeTeamSection {
  badge: LocalizedText;
  title: LocalizedText;
  titleAccent: LocalizedText;
  members: HomeTeamMember[];
}

export interface HomeClientItem {
  name: string;
  logo: string | null;
  url: string;
}

export interface HomeClientsSection {
  badge: LocalizedText;
  title: LocalizedText;
  subtitle: LocalizedText;
  clients: HomeClientItem[];
}

export interface SiteContent {
  home: {
    hero: HomeHeroSection;
    capabilities: HomeCapabilitiesSection;
    eventTypes: HomeEventTypesSection;
    featuredSetups: HomeFeaturedSetupsSection;
    process: HomeProcessSection;
    metrics: HomeMetricsSection;
    catalogGateway: HomeCatalogGatewaySection;
    finalCta: HomeFinalCtaSection;
    team: HomeTeamSection;
    clients: HomeClientsSection;
  };
  services: {
    categories: ServiceCategoryContent[];
  };
}
