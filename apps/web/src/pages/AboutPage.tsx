import { useTranslation } from 'react-i18next';

type SignalLevel = 'noChance' | 'veryLow' | 'low' | 'medium' | 'high';

function likelihoodStyle(level: SignalLevel): { badgeClass: string; dotClass: string } {
  if (level === 'noChance') {
    return { badgeClass: 'bg-slate-100 text-slate-800 ring-1 ring-slate-200', dotClass: 'bg-slate-500' };
  }
  if (level === 'veryLow') {
    return { badgeClass: 'bg-rose-50 text-rose-700 ring-1 ring-rose-100', dotClass: 'bg-rose-400' };
  }
  if (level === 'low') {
    return { badgeClass: 'bg-rose-50 text-rose-800 ring-1 ring-rose-200', dotClass: 'bg-rose-500' };
  }
  if (level === 'medium') {
    return { badgeClass: 'bg-amber-50 text-amber-800 ring-1 ring-amber-200', dotClass: 'bg-amber-500' };
  }
  return { badgeClass: 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200', dotClass: 'bg-emerald-500' };
}

export default function AboutPage() {
  const { t } = useTranslation();

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="text-2xl font-semibold tracking-tight">{t('methods.title')}</div>
        </div>
      </div>

      <div className="space-y-4">
        <section className="card">
          <div className="p-4 text-sm leading-relaxed text-slate-700">
            {t('methods.about')}
          </div>
        </section>

        <section className="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-900">
          <div className="flex gap-2">
            <svg className="mt-0.5 h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></svg>
            <span>{t('about.disclaimerBody')}</span>
          </div>
        </section>

        <h2 className="text-lg font-semibold tracking-tight text-slate-900">{t('methods.methodsHeading')}</h2>
        <section className="card">
          <div className="card-header">
            <div className="card-title">{t('methods.civil.title')}</div>
          </div>
          <div className="space-y-3 p-4 text-sm text-slate-700">
            <div>{t('methods.civil.summary')}</div>

            <div>
              <div className="text-xs font-semibold text-slate-900">{t('methods.characteristics')}</div>
              <ul className="mt-2 list-disc space-y-1 ps-5">
                <li>{t('methods.civil.ch1')}</li>
                <li>{t('methods.civil.ch2')}</li>
                <li>{t('methods.civil.ch3')}</li>
              </ul>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
                <div className="text-xs font-semibold text-slate-900">{t('methods.pros')}</div>
                <ul className="mt-2 list-disc space-y-1 ps-5 text-sm text-slate-700">
                  <li>{t('methods.civil.pro1')}</li>
                  <li>{t('methods.civil.pro2')}</li>
                </ul>
              </div>
              <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
                <div className="text-xs font-semibold text-slate-900">{t('methods.cons')}</div>
                <ul className="mt-2 list-disc space-y-1 ps-5 text-sm text-slate-700">
                  <li>{t('methods.civil.con1')}</li>
                  <li>{t('methods.civil.con2')}</li>
                </ul>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-3 text-xs text-slate-500">
              <span>{t('methods.references')}:</span>
              <a href="https://en.wikipedia.org/wiki/Tabular_Islamic_calendar" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Wikipedia: Tabular Islamic calendar</a>
              <span>•</span>
              <span>Reingold &amp; Dershowitz, <em>Calendrical Calculations</em></span>
              <span>•</span>
              <span>{t('methods.civil.impl')}</span>
            </div>
          </div>
        </section>

        <section className="card">
          <div className="card-header">
            <div className="card-title">{t('methods.ummalqura.title')}</div>
          </div>
          <div className="space-y-3 p-4 text-sm text-slate-700">
            <div>{t('methods.ummalqura.summary')}</div>

            <div>
              <div className="text-xs font-semibold text-slate-900">{t('methods.pros')}</div>
              <ul className="mt-2 list-disc space-y-1 ps-5">
                <li>{t('methods.ummalqura.pro1')}</li>
              </ul>
            </div>

            <div>
              <div className="text-xs font-semibold text-slate-900">{t('methods.cons')}</div>
              <ul className="mt-2 list-disc space-y-1 ps-5">
                <li>{t('methods.ummalqura.con1')}</li>
              </ul>
            </div>

            <div className="text-xs text-slate-500">{t('methods.ummalqura.comingSoon')}</div>

            <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-3 text-xs text-slate-500">
              <span>{t('methods.references')}:</span>
              <a href="https://en.wikipedia.org/wiki/Umm_al-Qura_calendar" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Wikipedia: Umm al-Qura calendar</a>
            </div>
          </div>
        </section>

        <section className="card">
          <div className="card-header">
            <div className="card-title">{t('methods.estimate.title')}</div>
          </div>
          <div className="space-y-3 p-4 text-sm text-slate-700">
            <div>{t('methods.estimate.summary')}</div>

            <div>
              <div className="text-xs font-semibold text-slate-900">{t('methods.characteristics')}</div>
              <ul className="mt-2 list-disc space-y-1 ps-5">
                <li>{t('methods.estimate.ch1')}</li>
                <li>{t('methods.estimate.ch2')}</li>
                <li>{t('methods.estimate.ch3')}</li>
              </ul>
            </div>

            <div>
              <div className="text-xs font-semibold text-slate-900">{t('methods.estimate.thresholdsTitle')}</div>
              <div className="mt-2 space-y-2">
                {(
                  [
                    { level: 'noChance', textKey: 'methods.estimate.threshold1' },
                    { level: 'veryLow', textKey: 'methods.estimate.threshold2' },
                    { level: 'low', textKey: 'methods.estimate.threshold3' },
                    { level: 'medium', textKey: 'methods.estimate.threshold4' },
                    { level: 'high', textKey: 'methods.estimate.threshold5' }
                  ] as const
                ).map((item) => {
                  const style = likelihoodStyle(item.level);
                  return (
                    <div key={item.level} className="flex flex-wrap items-start gap-2 text-sm">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium ${style.badgeClass}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${style.dotClass}`} />
                        {t(`probability.${item.level}`)}
                      </span>
                      <span>{t(item.textKey)}</span>
                    </div>
                  );
                })}

                <div className="text-sm text-slate-700">• {t('methods.estimate.threshold6')}</div>
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold text-slate-900">{t('methods.estimate.formulaTitle')}</div>
              <ul className="mt-2 list-disc space-y-1 ps-5">
                <li>{t('methods.estimate.formula1')}</li>
                <li>{t('methods.estimate.formula2')}</li>
                <li>{t('methods.estimate.formula3')}</li>
                <li>{t('methods.estimate.formula4')}</li>
              </ul>
            </div>

            <div className="rounded-md border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
              {t('methods.estimate.note')}
            </div>

            <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-3 text-xs text-slate-500">
              <span>{t('methods.references')}:</span>
              <a href="https://en.wikipedia.org/wiki/New_moon" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Wikipedia: New moon</a>
              <span>•</span>
              <a href="https://www.researchgate.net/publication/225099773_New_Criterion_for_Lunar_Crescent_Visibility" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Odeh (2004)</a>
              <span>•</span>
              <a href="https://astronomycenter.net/pdf/yallop_1997.pdf" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Yallop (1997)</a>
              <span>•</span>
              <a href="https://astronomycenter.net/pdf/schaefer_1996.pdf" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Schaefer (1996)</a>
              <span>•</span>
              <a href="https://adsabs.harvard.edu/full/1988QJRAS..29..511S" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Schaefer (1988)</a>
              <span>•</span>
              <a href="https://github.com/cosinekitty/astronomy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">astronomy-engine</a>
            </div>
          </div>
        </section>

        <h2 className="text-lg font-semibold tracking-tight text-slate-900">{t('about.privacyTitle')}</h2>
        <section className="card">
          <div className="space-y-3 p-4 text-sm leading-relaxed text-slate-700">
            <p>{t('about.privacyBody')}</p>
            <ul className="list-disc space-y-1 ps-5">
              <li>{t('about.privacyNoServer')}</li>
              <li>{t('about.privacyNoTracking')}</li>
              <li>{t('about.privacyNoCookies')}</li>
              <li>{t('about.privacyLocation')}</li>
            </ul>
          </div>
        </section>

        <h2 className="text-lg font-semibold tracking-tight text-slate-900">{t('about.openSourceTitle')}</h2>
        <section className="card">
          <div className="space-y-2 p-4 text-sm leading-relaxed text-slate-700">
            <p>{t('about.openSourceBody')}</p>
            <a
              href="https://github.com/sameraamar/hijri"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:underline"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.694.825.576C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z"/></svg>
              github.com/sameraamar/hijri
            </a>
          </div>
        </section>

        <h2 className="text-lg font-semibold tracking-tight text-slate-900">{t('about.furtherReadingTitle')}</h2>
        <section className="card">
          <div className="p-4">
            <ul className="space-y-3 text-sm">
              <li className="text-xs font-semibold uppercase tracking-wide text-slate-400">Wikipedia</li>
              <li>
                <a href="https://en.wikipedia.org/wiki/Islamic_calendar" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Islamic calendar</a>
              </li>
              <li>
                <a href="https://en.wikipedia.org/wiki/Tabular_Islamic_calendar" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Tabular Islamic calendar</a>
              </li>
              <li>
                <a href="https://en.wikipedia.org/wiki/Umm_al-Qura_calendar" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Umm al-Qura calendar</a>
              </li>
              <li>
                <a href="https://en.wikipedia.org/wiki/New_moon" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">New moon</a>
              </li>
              <li>
                <a href="https://en.wikipedia.org/wiki/Lunar_phase" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Lunar phase</a>
              </li>

              <li className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-400">{t('about.ourResearch')}</li>
              <li>
                <a href="https://github.com/sameraamar/hijri/blob/main/docs/calculation-methods.md" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{t('about.ourResearchLink')}</a>
                <span className="text-slate-500"> — {t('about.ourResearchDesc')}</span>
              </li>

              <li className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-400">Academic &amp; Scientific</li>
              <li>
                <a href="https://www.researchgate.net/publication/354067468_Predicting_the_First_Visibility_of_the_Lunar_Crescent" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Segura, W. (2021). <em>Predicting the First Visibility of the Lunar Crescent.</em></a>
              </li>
              <li>
                <a href="https://www.researchgate.net/publication/323945073_Calendrical_Calculations_The_Ultimate_Edition" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Reingold, E. M. &amp; Dershowitz, N. (2018). <em>Calendrical Calculations: The Ultimate Edition.</em></a>
                <span className="text-slate-500"> — Cambridge University Press</span>
              </li>
              <li>
                <a href="https://www.researchgate.net/publication/225099773_New_Criterion_for_Lunar_Crescent_Visibility" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Odeh, M. (2004). <em>New Criterion for Lunar Crescent Visibility.</em></a>
                <span className="text-slate-500"> — Experimental Astronomy, Vol. 18, pp. 39–64</span>
              </li>
              <li>
                <a href="https://astronomycenter.net/pdf/yallop_1997.pdf" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Yallop, B. D. (1997). <em>A Method for Predicting the First Sighting of the New Crescent Moon.</em></a>
                <span className="text-slate-500"> — NAO Technical Note No. 69, HM Nautical Almanac Office</span>
              </li>
              <li>
                <a href="https://astronomycenter.net/pdf/schaefer_1996.pdf" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Schaefer, B. E. (1996). <em>Lunar Crescent Visibility.</em></a>
                <span className="text-slate-500"> — Quarterly Journal of the Royal Astronomical Society, Vol. 37, pp. 759–768</span>
              </li>
              <li>
                <a href="https://www.cs.tau.ac.il/~nachumd/papers/CalendricalCalculationsII.pdf" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Reingold, E. M., Dershowitz, N. &amp; Clamen, S. M. (1993). <em>Calendrical Calculations, II: Three Historical Calendars.</em></a>
                <span className="text-slate-500"> — Software—Practice and Experience, Vol. 23(4), pp. 383–404</span>
              </li>
              <li>
                <a href="https://adsabs.harvard.edu/full/1988QJRAS..29..511S" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Schaefer, B. E. (1988). <em>Visibility of the Lunar Crescent.</em></a>
                <span className="text-slate-500"> — Quarterly Journal of the Royal Astronomical Society, Vol. 29, pp. 511–523</span>
              </li>

              <li className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-400">Software</li>
              <li>
                <a href="https://github.com/cosinekitty/astronomy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">astronomy-engine</a>
                <span className="text-slate-500"> — npm package for sun/moon ephemeris calculations</span>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
