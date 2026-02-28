import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Sets `document.title` and the `<meta name="description">` tag
 * for the current page.  Call once at the top of every page component.
 *
 * @param titleKey   i18n key for the page title  (e.g. `"seo.calendar.title"`)
 * @param descKey    i18n key for the meta description (e.g. `"seo.calendar.description"`)
 * @param suffix     Optional dynamic suffix appended to the title (e.g. `"2026"`)
 */
export function usePageMeta(titleKey: string, descKey: string, suffix?: string | number): void {
  const { t } = useTranslation();

  useEffect(() => {
    const title = t(titleKey);
    const desc = t(descKey);

    // Append optional suffix (e.g. year) and site name for brand consistency
    const parts = suffix != null ? [title, String(suffix)] : [title];
    document.title = `${parts.join(' ')} | ${t('app.title')}`;

    // Update (or create) the meta description
    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'description';
      document.head.appendChild(meta);
    }
    meta.content = suffix != null ? `${desc} (${suffix})` : desc;
  }, [t, titleKey, descKey, suffix]);
}
