import { Link, Navigate, Route, Routes } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import i18n, { isRtlLanguage, type SupportedLanguage } from './i18n/i18n';
import CalendarPage from './pages/CalendarPage';
import ConvertPage from './pages/ConvertPage';
import HolidaysPage from './pages/HolidaysPage';
import MethodsPage from './pages/MethodsPage';
import { useMethod } from './method/MethodContext';
import { METHODS } from './method/types';
import type { CalculationMethodId } from './method/types';

function isCalculationMethodId(value: string): value is CalculationMethodId {
  return value === 'civil' || value === 'estimate' || value === 'ummalqura';
}

function setDocumentLanguage(lang: SupportedLanguage) {
  document.documentElement.lang = lang;
  document.documentElement.dir = isRtlLanguage(lang) ? 'rtl' : 'ltr';
}

export default function App() {
  const { t } = useTranslation();
  const { methodId, setMethodId } = useMethod();

  const lang = (i18n.language || 'en') as SupportedLanguage;
  setDocumentLanguage(lang);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <Link to="/calendar" className="text-lg font-semibold tracking-tight hover:opacity-90">
              {t('app.title')}
            </Link>
            <nav className="hidden gap-3 text-sm md:flex">
              <Link className="rounded-md px-2 py-1 text-slate-700 hover:bg-slate-50 hover:text-slate-900" to="/calendar">
                {t('app.nav.calendar')}
              </Link>
              <Link className="rounded-md px-2 py-1 text-slate-700 hover:bg-slate-50 hover:text-slate-900" to="/convert">
                {t('app.nav.convert')}
              </Link>
              <Link className="rounded-md px-2 py-1 text-slate-700 hover:bg-slate-50 hover:text-slate-900" to="/holidays">
                {t('app.nav.holidays')}
              </Link>
              <Link className="rounded-md px-2 py-1 text-slate-700 hover:bg-slate-50 hover:text-slate-900" to="/methods">
                {t('app.nav.methods')}
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <select
              className="control-sm w-56"
              value={methodId}
              onChange={(e) => {
                const v = e.target.value;
                if (isCalculationMethodId(v)) setMethodId(v);
              }}
              aria-label={t('app.method.label')}
            >
              {METHODS.map((m) => (
                <option key={m.id} value={m.id} disabled={!m.enabled}>
                  {t(m.labelKey)}{!m.enabled ? ` (${t('app.method.comingSoon')})` : ''}
                </option>
              ))}
            </select>
            <select
              className="control-sm"
              value={lang}
              onChange={(e) => i18n.changeLanguage(e.target.value)}
              aria-label="Language"
            >
              <option value="en">{t('app.language.en')}</option>
              <option value="ar">{t('app.language.ar')}</option>
            </select>
          </div>
        </div>

        <nav className="mx-auto flex max-w-6xl gap-2 px-4 pb-3 text-sm md:hidden">
          <Link className="rounded-md px-2 py-1 text-slate-700 hover:bg-slate-50 hover:text-slate-900" to="/calendar">
            {t('app.nav.calendar')}
          </Link>
          <Link className="rounded-md px-2 py-1 text-slate-700 hover:bg-slate-50 hover:text-slate-900" to="/convert">
            {t('app.nav.convert')}
          </Link>
          <Link className="rounded-md px-2 py-1 text-slate-700 hover:bg-slate-50 hover:text-slate-900" to="/holidays">
            {t('app.nav.holidays')}
          </Link>
          <Link className="rounded-md px-2 py-1 text-slate-700 hover:bg-slate-50 hover:text-slate-900" to="/methods">
            {t('app.nav.methods')}
          </Link>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <Routes>
          <Route path="/" element={<Navigate to="/calendar" replace />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/convert" element={<ConvertPage />} />
          <Route path="/holidays" element={<HolidaysPage />} />
          <Route path="/methods" element={<MethodsPage />} />
        </Routes>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-4 text-xs text-slate-600">
          <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
            <div>
              {t('app.method.label')}: {t(METHODS.find((m) => m.id === methodId)?.labelKey ?? 'app.method.civil')}
            </div>
            <div className="text-slate-500">
              {t('app.footer.openSource')}{' '}
              <a
                href="https://github.com/sameraamar/hijri-calendar-web"
                target="_blank"
                rel="noreferrer"
                className="underline decoration-slate-300 underline-offset-2 hover:text-slate-700"
              >
                {t('app.footer.repoLabel')}
              </a>
            </div>
          </div>
          <div className="mt-1 text-slate-500">{t('app.footer.disclaimer')}</div>
          <div className="mt-1 text-slate-500">
            {t('app.footer.contact')}{' '}
            <a
              href="mailto:samer.aamar@gmail.com"
              className="underline decoration-slate-300 underline-offset-2 hover:text-slate-700"
            >
              samer.aamar@gmail.com
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
