import { describe, expect, it } from 'vitest';
import { validationRules } from '../validation-rules';

describe('Validation Rules', () => {
  describe('required', () => {
    it('returns true if there is a value', () => {
      expect(validationRules.required('hello')).toBe(true);
      expect(validationRules.required(42.73)).toBe(true);
      expect(validationRules.required(-42.73)).toBe(true);
      expect(validationRules.required(0)).toBe(true);
      expect(validationRules.required({})).toBe(true);
      expect(validationRules.required({ message: 'hello' })).toBe(true);
    });

    it('returns "Required." if there is no value', () => {
      expect(validationRules.required(undefined)).toBe('Required');
      expect(validationRules.required(null)).toBe('Required');
      expect(validationRules.required('')).toBe('Required');
      expect(validationRules.required('   ')).toBe('Required');
    });
  });

  describe('email', () => {
    it('returns true if no value is specified', () => {
      expect(validationRules.email(undefined)).toBe(true);
      expect(validationRules.email(null)).toBe(true);
      expect(validationRules.email('')).toBe(true);
      expect(validationRules.email('   ')).toBe(true);
    });

    it('return true for valid e-mail addresses', () => {
      expect(validationRules.email('test@test-data.com')).toBe(true);
      expect(validationRules.email('test@test.com')).toBe(true);
      expect(validationRules.email('foo+bar@test.com')).toBe(true);
      expect(validationRules.email('"foo bar"@test.com')).toBe(true);
      expect(validationRules.email('test@sub.test.co.uk')).toBe(true);
      expect(validationRules.email('test@test.info')).toBe(true);
    });

    it('returns "Invalid e-mail." for invalid addresses', () => {
      expect(validationRules.email('test')).toBe('Invalid e-mail');
      expect(validationRules.email('test.test.com')).toBe('Invalid e-mail');
    });
  });

  describe('positive', () => {
    it('returns true if null or undefined', () => {
      expect(validationRules.positive(undefined)).toBe(true);
      expect(validationRules.positive(null)).toBe(true);
    });

    it('returns true for positive numbers', () => {
      expect(validationRules.positive(42)).toBe(true);
      expect(validationRules.positive(73)).toBe(true);
      expect(validationRules.positive(42.73)).toBe(true);
    });

    it('returns "Must be a positive number" for zero or negative numbers', () => {
      expect(validationRules.positive(0)).toBe('Must be a positive number');
      expect(validationRules.positive(-42)).toBe('Must be a positive number');
      expect(validationRules.positive(-73)).toBe('Must be a positive number');
      expect(validationRules.positive(-42.73)).toBe('Must be a positive number');
      expect(validationRules.positive(-Infinity)).toBe('Must be a positive number');
    });

    it('returns "Must be a valid positive number" for NaN', () => {
      expect(validationRules.positive(NaN)).toBe('Must be a valid positive number');
    });

    it('returns true for Infinity', () => {
      expect(validationRules.positive(Infinity)).toBe(true);
    });

    it('returns true for very small positive numbers', () => {
      expect(validationRules.positive(0.0001)).toBe(true);
      expect(validationRules.positive(0.000001)).toBe(true);
      expect(validationRules.positive(Number.MIN_VALUE)).toBe(true);
    });
  });

  describe('zero or greater', () => {
    it('returns true if null or undefined', () => {
      expect(validationRules.zeroOrGreater(undefined)).toBe(true);
      expect(validationRules.zeroOrGreater(null)).toBe(true);
    });

    it('returns true for positive numbers', () => {
      expect(validationRules.zeroOrGreater(42)).toBe(true);
      expect(validationRules.zeroOrGreater(73)).toBe(true);
      expect(validationRules.zeroOrGreater(42.73)).toBe(true);
    });

    it('returns true for zero', () => {
      expect(validationRules.zeroOrGreater(0)).toBe(true);
    });

    it('returns "Must be zero or greater" for negative numbers', () => {
      expect(validationRules.zeroOrGreater(-42)).toBe('Must be zero or greater');
      expect(validationRules.zeroOrGreater(-73)).toBe('Must be zero or greater');
      expect(validationRules.zeroOrGreater(-42.73)).toBe('Must be zero or greater');
      expect(validationRules.zeroOrGreater(-Infinity)).toBe('Must be zero or greater');
    });

    it('returns "Must be a valid number zero or greater" for NaN', () => {
      expect(validationRules.zeroOrGreater(NaN)).toBe('Must be a valid number zero or greater');
    });

    it('returns true for Infinity', () => {
      expect(validationRules.zeroOrGreater(Infinity)).toBe(true);
    });

    it('returns true for very small positive numbers', () => {
      expect(validationRules.zeroOrGreater(0.0001)).toBe(true);
      expect(validationRules.zeroOrGreater(0.000001)).toBe(true);
      expect(validationRules.zeroOrGreater(Number.MIN_VALUE)).toBe(true);
    });

    it('returns "Must be a valid number zero or greater" for NaN', () => {
      expect(validationRules.zeroOrGreater(NaN)).toBe('Must be a valid number zero or greater');
    });

    it('returns true for Infinity', () => {
      expect(validationRules.zeroOrGreater(Infinity)).toBe(true);
    });

    it('returns true for very small positive numbers', () => {
      expect(validationRules.zeroOrGreater(0.0001)).toBe(true);
      expect(validationRules.zeroOrGreater(0.000001)).toBe(true);
      expect(validationRules.zeroOrGreater(Number.MIN_VALUE)).toBe(true);
    });
  });

  describe('mustBeGreaterThan', () => {
    it('returns true if value is null or undefined', () => {
      expect(validationRules.mustBeGreaterThan(10)(undefined)).toBe(true);
      expect(validationRules.mustBeGreaterThan(10)(null)).toBe(true);
    });

    it('returns true if min is null or undefined', () => {
      expect(validationRules.mustBeGreaterThan(null)(5)).toBe(true);
      expect(validationRules.mustBeGreaterThan(undefined)(5)).toBe(true);
    });

    it('returns true for values strictly greater than min', () => {
      expect(validationRules.mustBeGreaterThan(10)(11)).toBe(true);
      expect(validationRules.mustBeGreaterThan(10)(100)).toBe(true);
      expect(validationRules.mustBeGreaterThan(10)(10.001)).toBe(true);
      expect(validationRules.mustBeGreaterThan(0)(1)).toBe(true);
    });

    it('returns the default error for values at or below min', () => {
      expect(validationRules.mustBeGreaterThan(10)(10)).toBe('Must be greater than 10');
      expect(validationRules.mustBeGreaterThan(10)(9)).toBe('Must be greater than 10');
      expect(validationRules.mustBeGreaterThan(10)(-5)).toBe('Must be greater than 10');
      expect(validationRules.mustBeGreaterThan(0)(0)).toBe('Must be greater than 0');
    });

    it('returns the custom message for values at or below min', () => {
      expect(validationRules.mustBeGreaterThan(10, 'Too low')(10)).toBe('Too low');
      expect(validationRules.mustBeGreaterThan(10, 'Too low')(5)).toBe('Too low');
    });

    it('returns the default NaN error for NaN', () => {
      expect(validationRules.mustBeGreaterThan(10)(NaN)).toBe('Must be a valid number greater than 10');
    });

    it('returns the custom message for NaN', () => {
      expect(validationRules.mustBeGreaterThan(10, 'Bad value')(NaN)).toBe('Bad value');
    });
  });

  describe('mustBeLessThan', () => {
    it('returns true if value is null or undefined', () => {
      expect(validationRules.mustBeLessThan(10)(undefined)).toBe(true);
      expect(validationRules.mustBeLessThan(10)(null)).toBe(true);
    });

    it('returns true if max is null or undefined', () => {
      expect(validationRules.mustBeLessThan(null)(5)).toBe(true);
      expect(validationRules.mustBeLessThan(undefined)(5)).toBe(true);
    });

    it('returns true for values strictly less than max', () => {
      expect(validationRules.mustBeLessThan(10)(9)).toBe(true);
      expect(validationRules.mustBeLessThan(10)(0)).toBe(true);
      expect(validationRules.mustBeLessThan(10)(9.999)).toBe(true);
      expect(validationRules.mustBeLessThan(0)(-1)).toBe(true);
    });

    it('returns the default error for values at or above max', () => {
      expect(validationRules.mustBeLessThan(10)(10)).toBe('Must be less than 10');
      expect(validationRules.mustBeLessThan(10)(11)).toBe('Must be less than 10');
      expect(validationRules.mustBeLessThan(10)(100)).toBe('Must be less than 10');
      expect(validationRules.mustBeLessThan(0)(0)).toBe('Must be less than 0');
    });

    it('returns the custom message for values at or above max', () => {
      expect(validationRules.mustBeLessThan(10, 'Too high')(10)).toBe('Too high');
      expect(validationRules.mustBeLessThan(10, 'Too high')(15)).toBe('Too high');
    });

    it('returns the default NaN error for NaN', () => {
      expect(validationRules.mustBeLessThan(10)(NaN)).toBe('Must be a valid number less than 10');
    });

    it('returns the custom message for NaN', () => {
      expect(validationRules.mustBeLessThan(10, 'Bad value')(NaN)).toBe('Bad value');
    });
  });
});
