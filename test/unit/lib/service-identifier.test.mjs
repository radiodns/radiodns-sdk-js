import t from 'tap';

import parseServiceIdentifier from '../../../lib/service-identifier.mjs';

t.test('parseServiceIdentifier', (t) => {
  t.test('parses uri', (t) => {
    t.match(
      parseServiceIdentifier('fm/ce1/c586/09580', 'fm', 3),
      ['ce1', 'c586', '09580'],
      'can parse service identifier',
    );

    t.match(
      parseServiceIdentifier('dab/ce1/c185/e1c00098/0/004', 'dab', [4, 5]),
      ['ce1', 'c185', 'e1c00098', '0', '004'],
      'can parse service identifier with multiple argument numbers and lowest number supplied',
    );

    t.match(
      parseServiceIdentifier('dab/de0/100c/d220/0', 'dab', [4, 5]),
      ['de0', '100c', 'd220', '0'],
      'can parse service identifier with alternative argument number and largest number supplied',
    );

    t.end();
  });

  t.test('rejects invalid values', (t) => {
    t.throws(
      () => parseServiceIdentifier('foo/ce1/c586/09580', 'fm', 3),
      'cannot parse mismatched scheme',
    );
    t.throws(
      () => parseServiceIdentifier('fm/ce1/c586', 'fm', 3),
      'cannot parse too few arguments',
    );
    t.throws(
      () => parseServiceIdentifier('fm/ce1/c586/09580/x', 'fm', 3),
      'cannot parse too many arguments',
    );

    t.end();
  });

  t.end();
});
