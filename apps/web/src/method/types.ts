export type CalculationMethodId = 'civil' | 'estimate' | 'yallop' | 'odeh';

export type CalculationMethod = {
  id: CalculationMethodId;
  labelKey: string;
  enabled: boolean;
};

export const METHODS: CalculationMethod[] = [
  { id: 'estimate', labelKey: 'app.method.estimate', enabled: true },
  { id: 'yallop', labelKey: 'app.method.yallop', enabled: true },
  { id: 'odeh', labelKey: 'app.method.odeh', enabled: true },
  { id: 'civil', labelKey: 'app.method.civil', enabled: true }
];
