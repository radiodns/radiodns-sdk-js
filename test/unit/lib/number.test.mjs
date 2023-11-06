import t from 'tap';

import InvalidNumberError from '../../../lib/error/InvalidNumberError.mjs';
import castToInt from '../../../lib/int.mjs';

t.test('castToInt', (t) => {
  t.test('casts number', (t) => {
    t.equal(castToInt(1), 1, 'can cast number');
    t.equal(castToInt(0xf), 15, 'can cast hex formatted number');

    t.end();
  });

  t.test('casts string', (t) => {
    t.equal(castToInt('1'), 1, 'can cast decimal string');
    t.equal(castToInt('f', 16), 0xf, 'can cast hexadecimal string');
    t.equal(castToInt('0xab', 16), 0xab, 'can cast formally formatted hexadecimal string');

    t.end();
  });

  t.test('rejects invalid values', (t) => {
    const expect = new InvalidNumberError();

    t.throws(() => castToInt('x'), { ...expect, input: 'x' }, 'cannot cast invalid string');
    t.throws(() => castToInt('2345x1'), { ...expect, input: '2345x1' }, 'cannot cast partial string');
    t.throws(() => castToInt([]), { ...expect, input: [] }, 'cannot cast array');
    t.throws(() => castToInt({}), { ...expect, input: {} }, 'cannot cast object');

    t.end();
  });

  t.end();
});
