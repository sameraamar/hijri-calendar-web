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

export default function MethodsPage() {
  const { t } = useTranslation();

  const tocImplemented = [
    { id: 'civil', label: t('methods.civil.title') },
    { id: 'estimate', label: t('methods.estimate.title') },
    { id: 'yallop', label: t('methods.yallop.title') },
    { id: 'odeh', label: t('methods.odeh.title') },
  ];

  const tocOther = [
    { id: 'ummalqura', label: t('methods.ummalqura.title') },
    { id: 'schaefer', label: t('methods.schaefer.title') },
    { id: 'sultan', label: t('methods.sultan.title') },
    { id: 'danjon', label: t('methods.danjon.title') },
    { id: 'babylonian', label: t('methods.babylonian.title') },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="text-2xl font-semibold tracking-tight">{t('methods.methodsHeading')}</div>
        </div>
      </div>

      <div className="space-y-4">
        {/* ── Table of Contents ── */}
        <nav className="card p-4 text-sm">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">{t('methods.toc')}</div>
          <div className="space-y-1">
            <div className="font-medium text-slate-700">{t('methods.implementedSection')}</div>
            <ul className="list-disc ps-5 space-y-0.5">
              {tocImplemented.map((item) => (
                <li key={item.id}><a href={`#${item.id}`} className="text-blue-600 hover:underline">{item.label}</a></li>
              ))}
            </ul>
            <div className="font-medium text-slate-700 mt-2">{t('methods.otherSection')}</div>
            <ul className="list-disc ps-5 space-y-0.5">
              {tocOther.map((item) => (
                <li key={item.id}><a href={`#${item.id}`} className="text-blue-600 hover:underline">{item.label}</a></li>
              ))}
            </ul>
            <div className="mt-2">
              <a href="#references" className="font-medium text-blue-600 hover:underline">{t('about.furtherReadingTitle')}</a>
            </div>
          </div>
        </nav>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <h2 className="text-lg font-semibold tracking-tight text-slate-900">{t('methods.implementedSection')}</h2>

        {/* ── Tabular / Civil ── */}
        <section id="civil" className="card scroll-mt-24">
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



        {/* ── Geometric / Estimate ── */}
        <section id="estimate" className="card scroll-mt-24">
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

        {/* ── Yallop ── */}
        <section id="yallop" className="card scroll-mt-24">
          <div className="card-header">
            <div className="card-title">{t('methods.yallop.title')}</div>
          </div>
          <div className="space-y-3 p-4 text-sm text-slate-700">
            <div>{t('methods.yallop.summary')}</div>

            <div>
              <div className="text-xs font-semibold text-slate-900">{t('methods.characteristics')}</div>
              <ul className="mt-2 list-disc space-y-1 ps-5">
                <li>{t('methods.yallop.ch1')}</li>
                <li>{t('methods.yallop.ch2')}</li>
                <li>{t('methods.yallop.ch3')}</li>
              </ul>
            </div>

            <div>
              <div className="text-xs font-semibold text-slate-900">{t('methods.yallop.zonesTitle')}</div>
              <div className="mt-2 space-y-2">
                {(
                  [
                    { level: 'high', textKey: 'methods.yallop.zoneA' },
                    { level: 'high', textKey: 'methods.yallop.zoneB' },
                    { level: 'medium', textKey: 'methods.yallop.zoneC' },
                    { level: 'medium', textKey: 'methods.yallop.zoneD' },
                    { level: 'veryLow', textKey: 'methods.yallop.zoneE' },
                    { level: 'noChance', textKey: 'methods.yallop.zoneF' }
                  ] as { level: SignalLevel; textKey: string }[]
                ).map((item, idx) => {
                  const style = likelihoodStyle(item.level);
                  return (
                    <div key={idx} className="flex flex-wrap items-start gap-2 text-sm">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium ${style.badgeClass}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${style.dotClass}`} />
                        {t(`probability.${item.level}`)}
                      </span>
                      <span>{t(item.textKey)}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-md border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
              {t('methods.yallop.note')}
            </div>

            <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-3 text-xs text-slate-500">
              <span>{t('methods.references')}:</span>
              <a href="https://astronomycenter.net/pdf/yallop_1997.pdf" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Yallop (1997)</a>
              <span>•</span>
              <a href="https://en.wikipedia.org/wiki/New_moon" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Wikipedia: New moon</a>
              <span>•</span>
              <a href="https://github.com/cosinekitty/astronomy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">astronomy-engine</a>
            </div>
          </div>
        </section>

        {/* ── Odeh ── */}
        <section id="odeh" className="card scroll-mt-24">
          <div className="card-header">
            <div className="card-title">{t('methods.odeh.title')}</div>
          </div>
          <div className="space-y-3 p-4 text-sm text-slate-700">
            <div>{t('methods.odeh.summary')}</div>

            <div>
              <div className="text-xs font-semibold text-slate-900">{t('methods.characteristics')}</div>
              <ul className="mt-2 list-disc space-y-1 ps-5">
                <li>{t('methods.odeh.ch1')}</li>
                <li>{t('methods.odeh.ch2')}</li>
                <li>{t('methods.odeh.ch3')}</li>
              </ul>
            </div>

            <div>
              <div className="text-xs font-semibold text-slate-900">{t('methods.odeh.zonesTitle')}</div>
              <div className="mt-2 space-y-2">
                {(
                  [
                    { level: 'high', textKey: 'methods.odeh.zoneA' },
                    { level: 'high', textKey: 'methods.odeh.zoneB' },
                    { level: 'medium', textKey: 'methods.odeh.zoneC' },
                    { level: 'noChance', textKey: 'methods.odeh.zoneD' }
                  ] as { level: SignalLevel; textKey: string }[]
                ).map((item, idx) => {
                  const style = likelihoodStyle(item.level);
                  return (
                    <div key={idx} className="flex flex-wrap items-start gap-2 text-sm">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium ${style.badgeClass}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${style.dotClass}`} />
                        {t(`probability.${item.level}`)}
                      </span>
                      <span>{t(item.textKey)}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-md border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
              {t('methods.odeh.note')}
            </div>

            <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-3 text-xs text-slate-500">
              <span>{t('methods.references')}:</span>
              <a href="https://www.icoproject.org/pdf/2004Odeh.pdf" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Odeh (2004)</a>
              <span>•</span>
              <a href="https://github.com/cosinekitty/astronomy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">astronomy-engine</a>
            </div>
          </div>
        </section>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <h2 className="text-lg font-semibold tracking-tight text-slate-900">{t('methods.otherSection')}</h2>

        {/* ── Umm al-Qura ── */}
        <section id="ummalqura" className="card scroll-mt-24 opacity-80">
          <div className="card-header">
            <div className="card-title flex items-center gap-2">
              {t('methods.ummalqura.title')}
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500 ring-1 ring-slate-200">{t('methods.notImplemented')}</span>
            </div>
          </div>
          <div className="space-y-3 p-4 text-sm text-slate-700">
            <div>{t('methods.ummalqura.summary')}</div>
            <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-3 text-xs text-slate-500">
              <span>{t('methods.references')}:</span>
              <a href="https://en.wikipedia.org/wiki/Umm_al-Qura_calendar" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Wikipedia: Umm al-Qura calendar</a>
            </div>
          </div>
        </section>

        {/* ── Schaefer ── */}
        <section id="schaefer" className="card scroll-mt-24 opacity-80">
          <div className="card-header">
            <div className="card-title flex items-center gap-2">
              {t('methods.schaefer.title')}
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500 ring-1 ring-slate-200">{t('methods.notImplemented')}</span>
            </div>
          </div>
          <div className="space-y-3 p-4 text-sm text-slate-700">
            <div>{t('methods.schaefer.summary')}</div>
            <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-3 text-xs text-slate-500">
              <span>{t('methods.references')}:</span>
              <a href="https://astronomycenter.net/pdf/schaefer_1996.pdf" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Schaefer (1996)</a>
              <span>•</span>
              <a href="https://adsabs.harvard.edu/full/1988QJRAS..29..511S" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Schaefer (1988)</a>
            </div>
          </div>
        </section>

        {/* ── Sultan / SAAO ── */}
        <section id="sultan" className="card scroll-mt-24 opacity-80">
          <div className="card-header">
            <div className="card-title flex items-center gap-2">
              {t('methods.sultan.title')}
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500 ring-1 ring-slate-200">{t('methods.notImplemented')}</span>
            </div>
          </div>
          <div className="space-y-3 p-4 text-sm text-slate-700">
            <div>{t('methods.sultan.summary')}</div>
          </div>
        </section>

        {/* ── Danjon Limit ── */}
        <section id="danjon" className="card scroll-mt-24 opacity-80">
          <div className="card-header">
            <div className="card-title flex items-center gap-2">
              {t('methods.danjon.title')}
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500 ring-1 ring-slate-200">{t('methods.notImplemented')}</span>
            </div>
          </div>
          <div className="space-y-3 p-4 text-sm text-slate-700">
            <div>{t('methods.danjon.summary')}</div>
          </div>
        </section>

        {/* ── Babylonian / Lag ── */}
        <section id="babylonian" className="card scroll-mt-24 opacity-80">
          <div className="card-header">
            <div className="card-title flex items-center gap-2">
              {t('methods.babylonian.title')}
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500 ring-1 ring-slate-200">{t('methods.notImplemented')}</span>
            </div>
          </div>
          <div className="space-y-3 p-4 text-sm text-slate-700">
            <div>{t('methods.babylonian.summary')}</div>
          </div>
        </section>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <h2 id="references" className="text-lg font-semibold tracking-tight text-slate-900 scroll-mt-24">{t('about.furtherReadingTitle')}</h2>
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
