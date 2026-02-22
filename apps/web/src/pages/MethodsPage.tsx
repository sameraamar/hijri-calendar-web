import { useTranslation } from 'react-i18next';

import { useMethod } from '../method/MethodContext';
import { METHODS } from '../method/types';

export default function MethodsPage() {
  const { t } = useTranslation();
  const { methodId } = useMethod();

  const selectedLabelKey = METHODS.find((m) => m.id === methodId)?.labelKey ?? 'app.method.civil';

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="muted">{t('app.method.label')}: {t(selectedLabelKey)}</div>
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
              <ul className="mt-2 list-disc space-y-1 ps-5">
                <li>{t('methods.estimate.threshold1')}</li>
                <li>{t('methods.estimate.threshold2')}</li>
                <li>{t('methods.estimate.threshold3')}</li>
                <li>{t('methods.estimate.threshold4')}</li>
                <li>{t('methods.estimate.threshold5')}</li>
                <li>{t('methods.estimate.threshold6')}</li>
              </ul>
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
