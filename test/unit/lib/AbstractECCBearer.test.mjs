import t from 'tap';

import AbstractECCBearer from '../../../lib/AbstractECCBearer.mjs';

class Example extends AbstractECCBearer {
  static scheme = 'example';
}

t.test('AbstractBearer.ecc', (t) => {
  const bearer = new Example();
  t.ok(() => { bearer.ecc = 0xe2; }, 'can set ecc property');

  bearer.ecc = 0xe1;
  t.equal(bearer.ecc, 0xe1, 'can get ecc property value');

  t.throws(() => { bearer.ecc = 0x9f; }, 'cannot set too low ecc property value');
  t.throws(() => { bearer.ecc = 0xfa; }, 'cannot set too high ecc property value');

  t.end();
});

t.test('AbstractBearer.gcc', (t) => {
  const bearer = new Example();

  t.throws(
    () => { bearer.gcc = 0xce1; },
    new Error('gcc property cannot be written'),
    'cannot set gcc property',
  );
  t.throws(
    () => bearer.gcc,
    new Error('subclass must override gcc getter'),
    'cannot get gcc property on abstract',
  );

  t.end();
});
