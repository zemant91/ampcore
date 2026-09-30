import type { FieldDef } from '@calc/engine';
import { formatFieldForHistory } from '../buildCalculationSnapshot';

const dict: Record<string, string> = {
  'field.system': 'System',
  'system.dc': 'DC',
  'field.voltage': 'Voltage',
};
const resolveLabel = (key: string) => dict[key] ?? key;

describe('formatFieldForHistory: option fields resolve labelKey, not the raw stored value', () => {
  const systemField: FieldDef = {
    id: 'system',
    labelKey: 'field.system',
    quantity: 'dimensionless',
    role: 'input',
    options: [
      { value: 'dc', labelKey: 'system.dc' },
      { value: '1ph', labelKey: 'system.1ph' },
      { value: '3ph', labelKey: 'system.3ph' },
    ],
  };

  test('system="dc" -> value "DC" (resolved), not the raw "dc", and no redundant unit', () => {
    const result = formatFieldForHistory(systemField, { system: 'dc' }, resolveLabel);
    expect(result.value).toBe('DC');
    expect(result.unit).toBe('');
  });

  const voltageField: FieldDef = {
    id: 'voltage',
    labelKey: 'field.voltage',
    quantity: 'voltage',
    role: 'input',
    defaultUnit: 'V',
  };

  test('non-option numeric field -> raw value stringified, unit kept', () => {
    const result = formatFieldForHistory(voltageField, { voltage: 11 }, resolveLabel);
    expect(result.value).toBe('11');
    expect(result.unit).toBe('V');
  });
});
