import { SiteContent } from './types';
import { DEFAULT_SITE_CONTENT } from './content.default';

export const DEFAULT_LOCALE = 'az';

function isSiteContent(value: unknown): value is SiteContent {
  return Boolean(value && typeof value === 'object' && (value as SiteContent).home && (value as SiteContent).services);
}

export async function loadSiteContent(): Promise<SiteContent> {
  try {
    const response = await fetch('/api/content', { cache: 'no-store' });
    if (!response.ok) {
      return DEFAULT_SITE_CONTENT;
    }

    const payload = await response.json();
    if (isSiteContent(payload)) {
      return payload;
    }

    return DEFAULT_SITE_CONTENT;
  } catch {
    return DEFAULT_SITE_CONTENT;
  }
}

export function t(locale: string | undefined, value: { az: string; en: string; ru: string; tr: string }): string {
  const normalized = (locale || DEFAULT_LOCALE).toLowerCase();
  if (normalized === 'en') return value.en;
  if (normalized === 'ru') return value.ru;
  if (normalized === 'tr') return value.tr;
  return value.az;
}

export function ta(locale: string | undefined, value: { az: string[]; en: string[]; ru: string[]; tr: string[] }): string[] {
  const normalized = (locale || DEFAULT_LOCALE).toLowerCase();
  if (normalized === 'en') return value.en;
  if (normalized === 'ru') return value.ru;
  if (normalized === 'tr') return value.tr;
  return value.az;
}
