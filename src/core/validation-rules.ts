export const validationRules = {
  required: (value: string | number | object | null | undefined) => {
    if (typeof value === 'number') return true;
    if (typeof value === 'string') return !!value?.trim() || 'Required';
    return (value !== null && value !== undefined) || 'Required';
  },
  email: (value: string | null | undefined) => !value?.trim() || /.+@.+\..+/.test(value) || 'Invalid e-mail',
  positive: (value: number | null | undefined) => {
    if (value === null || value === undefined) return true;
    if (Number.isNaN(value)) return 'Must be a valid positive number';
    return value > 0 || 'Must be a positive number';
  },
  zeroOrGreater: (value: number | null | undefined) => {
    if (value === null || value === undefined) return true;
    if (Number.isNaN(value)) return 'Must be a valid number zero or greater';
    return value >= 0 || 'Must be zero or greater';
  },
  mustBeGreaterThan: (min: number | null | undefined, msg?: string) => (value: number | null | undefined) => {
    if (min === null || min === undefined || Number.isNaN(min)) return true;
    if (value === null || value === undefined) return true;
    if (Number.isNaN(value)) return msg || `Must be a valid number greater than ${min}`;
    return value > min || msg || `Must be greater than ${min}`;
  },
  mustBeLessThan: (max: number | null | undefined, msg?: string) => (value: number | null | undefined) => {
    if (max === null || max === undefined || Number.isNaN(max)) return true;
    if (value === null || value === undefined) return true;
    if (Number.isNaN(value)) return msg || `Must be a valid number less than ${max}`;
    return value < max || msg || `Must be less than ${max}`;
  },
};
