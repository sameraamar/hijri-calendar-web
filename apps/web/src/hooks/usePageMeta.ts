import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Sets `document.title` and the `<meta name="description">` tag
 * for the current page.  Call once at the top of every page component.
 *
 * @param titleKey   i18n key for the page title  (e.g. `"seo.calendar.title"`)
 * @param descKey    i18n key for the meta description (e.g. `"seo.calendar.description"`)
 */
export function usePageMeta(titleKey: string, descKey: string): void {
  const { t } = useTranslation();

  useEffect(() => {
    const title = t(titleKey);
    const desc = t(descKey);

    // Append site name to the page title for brand consistency
    document.title = `${title} | ${t('app.title')}`;

    // Update (or create) the meta description
    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'description';
      document.head.appendChild(meta);
    }
    meta.content = desc;
  }, [t, titleKey, descKey]);
}
