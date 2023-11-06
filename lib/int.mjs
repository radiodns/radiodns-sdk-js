import InvalidNumberError from './error/InvalidNumberError.mjs';
import isHex from './hex.mjs';

/**
 * Handles validating and then casting a value to an integer
 *
 * @param {*} value - the value to be cast to an integer
 * @param {number} radix - passed internally to Number.parseInt
 * @returns {number}
 * @throws {InvalidNumberError} Value is not suitable to casting to integer
 */
export default function castToInt(value, radix) {
  if (typeof value !== 'number') {
    // parseInt alone accepts the first part of a string that's a valid number...
    const number = Number.parseInt(value, radix);
    // ...so we use regex to refuse values such as '1234ohno'
    if (typeof value !== 'string' || !isHex(value, { allowPrefix: true }) || Number.isNaN(number)) {
      throw new InvalidNumberError(value);
    }
    return number;
  }
  return value;
}
