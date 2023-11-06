import fs from 'node:fs';

import castToInt from './int.mjs';

const isoCountryPattern = /^[A-Za-z]{2}$/;
let countries;

function getComparison({ pi, sid }) {
  if (pi === undefined && sid === undefined) {
    throw new TypeError('options.pi or options.sid must be set');
  }
  if (pi) {
    return { name: 'pi', value: castToInt(pi, 16) };
  }
  const value = castToInt(sid, 16);
  return {
    name: 'sid',
    // if it's an 8-char sid we need to bitshift it to the right position
    value: value > 0xffff
      ? (value & 0xffffff) >> 8 // eslint-disable-line no-bitwise
      : value,
  };
}

function parseIsoCountryCode(code, comparison) {
  // lazy load countries only when required
  if (countries === undefined) {
    countries = JSON.parse(fs.readFileSync('./res/country.json', 'utf8'));
  }
  // attempt to locate match
  let match = countries[code.toLowerCase()];
  // eslint-disable-next-line no-bitwise
  if (match !== undefined && !match?.gcc.some((gcc) => gcc >> 8 === comparison.value >> 12)) {
    // country does not match pi/sid, try a nearby
    match = countries[match.nearby[comparison.value >> 12]]; // eslint-disable-line no-bitwise
  }
  // if no match found, bail
  if (match?.gcc === undefined) {
    throw new TypeError('country parameter not recognised as ECC or GCC or valid ISO country code');
  }
  // else, return the ECC
  return match.gcc[0] & 0xff; // eslint-disable-line no-bitwise
}

export default function parseEcc(country, options = {}) {
  const comparison = getComparison(options);

  if (isoCountryPattern.test(country)) {
    return parseIsoCountryCode(country, comparison);
  }

  const value = castToInt(country, 16);

  const isEcc = value >= 0x0a0 && value <= 0x0f9;
  if (isEcc) {
    return value;
  }

  const isGcc = value >= 0x1a0 && value <= 0xff9;
  if (!isGcc) {
    throw new TypeError('country parameter not recognised as ECC or GCC or valid ISO country code');
  }

  // validate the ECC nibble of GCC matches the ECC nibble in FM PI or DAB SId
  // eslint-disable-next-line no-bitwise
  if (((value & 0xf00) >> 8) !== ((comparison.value & 0xf000) >> 12)) {
    throw new TypeError(`gcc cannot start with a different nibble to the ECC nibble of ${comparison.name}`);
  }

  return value & 0xff; // eslint-disable-line no-bitwise
}
