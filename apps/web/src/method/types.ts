export type CalculationMethodId = 'civil' | 'estimate' | 'ummalqura';

export type CalculationMethod = {
  id: CalculationMethodId;
  labelKey: string;
  enabled: boolean;
};

export const METHODS: CalculationMethod[] = [
  { id: 'estimate', labelKey: 'app.method.estimate', enabled: true },
  { id: 'civil', labelKey: 'app.method.civil', enabled: true },
  { id: 'ummalqura', labelKey: 'app.method.ummalqura', enabled: false }
];
