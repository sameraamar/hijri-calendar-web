import { NavLink, Navigate, Route, Routes } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { useTranslation } from 'react-i18next';

import i18n, { isRtlLanguage, type SupportedLanguage } from './i18n/i18n';
import { useMethod } from './method/MethodContext';
import { METHODS } from './method/types';
import type { CalculationMethodId } from './method/types';

const CalendarPage = lazy(() => import('./pages/CalendarPage'));
const ConvertPage = lazy(() => import('./pages/ConvertPage'));
const DetailsPage = lazy(() => import('./pages/DetailsPage'));
const HolidaysPage = lazy(() => import('./pages/HolidaysPage'));
const MethodsPage = lazy(() => import('./pages/MethodsPage'));
const HistoryPage = lazy(() => import('./pages/HistoryPage'));
const ScholarsPage = lazy(() => import('./pages/ScholarsPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));

function isCalculationMethodId(value: string): value is CalculationMethodId {
  return value === 'civil' || value === 'estimate' || value === 'yallop' || value === 'odeh';
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
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
          <div className="flex items-center gap-4">
            <NavLink to="/calendar" className="text-lg font-bold tracking-tight text-slate-900 hover:opacity-80 transition-opacity">
              {t('app.title')}
            </NavLink>
            <nav className="hidden items-center gap-1 md:flex">
              {[
                { to: '/holidays', label: t('app.nav.holidays') },
                { to: '/calendar', label: t('app.nav.calendar') },
                { to: '/convert', label: t('app.nav.convert') },
                { to: '/details', label: t('app.nav.details') },
                { to: '/history', label: t('app.nav.history') },
                { to: '/methods', label: t('app.nav.methods') },
                { to: '/scholars', label: t('app.nav.scholars') },
                { to: '/about', label: t('app.nav.about') },
              ].map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }: { isActive: boolean }) =>
                    `rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <select
              className="control-sm flex-1 sm:w-56 sm:flex-none"
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
              className="control-sm w-auto cursor-pointer text-sm"
              value={lang}
              onChange={(e) => i18n.changeLanguage(e.target.value)}
              aria-label="Language"
            >
              <option value="en">English</option>
              <option value="ar">عربي</option>
            </select>
          </div>
        </div>

        <nav className="mx-auto flex max-w-6xl items-center gap-1 overflow-x-auto px-4 pb-2 md:hidden">
          {[
            { to: '/holidays', label: t('app.nav.holidays') },
            { to: '/calendar', label: t('app.nav.calendar') },
            { to: '/convert', label: t('app.nav.convert') },
            { to: '/details', label: t('app.nav.details') },
            { to: '/history', label: t('app.nav.history') },
            { to: '/methods', label: t('app.nav.methods') },
            { to: '/scholars', label: t('app.nav.scholars') },
            { to: '/about', label: t('app.nav.about') },
          ].map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }: { isActive: boolean }) =>
                `flex-shrink-0 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 active:bg-slate-200'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-3 py-4 sm:px-4 sm:py-8">
        <Suspense fallback={<div className="py-12 text-center text-sm text-slate-400">Loading…</div>}>
          <Routes>
            <Route path="/" element={<Navigate to="/holidays" replace />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/convert" element={<ConvertPage />} />
            <Route path="/details" element={<DetailsPage />} />
            <Route path="/holidays" element={<HolidaysPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/methods" element={<MethodsPage />} />
            <Route path="/scholars" element={<ScholarsPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </Suspense>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-6 text-center text-xs text-slate-500 space-y-3">
          <p className="max-w-2xl mx-auto leading-relaxed">{t('app.footer.disclaimer')}</p>

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-slate-500">
            <a
              href="https://github.com/sameraamar/hijri"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 hover:text-slate-700"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
              GitHub
            </a>
            <span className="text-slate-300">·</span>
            <a
              href="mailto:samer.aamar@gmail.com"
              className="hover:text-slate-700"
            >
              samer.aamar@gmail.com
            </a>
            <span className="text-slate-300">·</span>
            <a
              href="https://github.com/sameraamar/hijri/blob/main/LICENSE"
              target="_blank"
              rel="noreferrer"
              className="hover:text-slate-700"
            >
              {t('app.footer.license')}
            </a>
          </div>

          <p className="text-[11px] text-slate-400">
            {t('app.footer.copyright', { year: new Date().getFullYear() })}
          </p>
        </div>
      </footer>
    </div>
  );
}
