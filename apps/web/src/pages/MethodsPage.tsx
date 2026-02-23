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

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="text-2xl font-semibold tracking-tight">{t('methods.title')}</div>
        </div>
      </div>

      <div className="space-y-4">
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
          </div>
        </section>
      </div>
    </div>
  );
}
