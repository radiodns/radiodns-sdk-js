import t from 'tap';

import parseCountry from '../../../lib/country.mjs';

t.test('parseCountry', (t) => {
  t.test('parses ECC', (t) => {
    t.equal(parseCountry('e1', { pi: 0xc123 }), 0xe1, 'can parse hex string');
    t.equal(parseCountry('0xe1', { pi: 0xc123 }), 0xe1, 'can parse hex string with prefix');
    t.equal(parseCountry(0xe1, { pi: 0xc123 }), 0xe1, 'can pass hex number');

    t.end();
  });

  t.test('parses GCC', (t) => {
    t.equal(parseCountry('ce1', { pi: 0xc123 }), 0xe1, 'can parse hex string');
    t.equal(parseCountry('0xce1', { pi: 0xc123 }), 0xe1, 'can parse hex string with prefix');
    t.equal(parseCountry(0xce1, { pi: 0xc123 }), 0xe1, 'can pass hex number');

    t.end();
  });

  t.test('parses GCC', (t) => {
    t.equal(parseCountry('fr', { pi: 0xc123 }), 0xe1, 'can parse iso country string');

    t.end();
  });

  t.test('rejects invalid values', (t) => {
    const invalidError = new TypeError('country parameter not recognised as ECC or GCC or valid ISO country code');
    t.throws(() => parseCountry('9f', { pi: 0xc123 }), invalidError, 'cannot parse invalid string');
    t.throws(() => parseCountry(0x9f, { pi: 0xc123 }), invalidError, 'cannot parse invalid number');
    t.throws(() => parseCountry('fa', { pi: 0xc123 }), invalidError, 'cannot parse invalid string');
    t.throws(() => parseCountry(0xfa, { pi: 0xc123 }), invalidError, 'cannot parse invalid number');
    t.throws(() => parseCountry('19f', { pi: 0xc123 }), invalidError, 'cannot parse invalid string');
    t.throws(() => parseCountry(0x19f, { pi: 0xc123 }), invalidError, 'cannot parse invalid number');
    t.throws(() => parseCountry('ffa', { pi: 0xc123 }), invalidError, 'cannot parse invalid string');
    t.throws(() => parseCountry(0xffa, { pi: 0xc123 }), invalidError, 'cannot parse invalid number');

    t.throws(
      () => parseCountry(0xce1, { pi: 0xd123 }),
      { message: 'gcc cannot start with a different nibble to the ECC nibble of pi' },
      'cannot parse mismatching first nibble with PI',
    );

    t.throws(
      () => parseCountry(0xce1, { sid: 0xd123 }),
      { message: 'gcc cannot start with a different nibble to the ECC nibble of sid' },
      'cannot parse mismatching first nibble with SId',
    );

    t.throws(
      () => parseCountry(0xce1, { sid: 0xe0d12345 }),
      { message: 'gcc cannot start with a different nibble to the ECC nibble of sid' },
      'cannot parse mismatching first nibble with long SId',
    );

    t.end();
  });

  t.throws(() => parseCountry(0xce1), 'throws when neither sid or eid option passed');

  t.end();
});
