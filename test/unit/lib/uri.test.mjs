import t from 'tap';

import parseUri from '../../../lib/uri.mjs';

t.test('parseUri', (t) => {
  t.test('parses uri', (t) => {
    t.match(
      parseUri('fm:ce1.c586.09580', 'fm', 3),
      ['ce1', 'c586', '09580'],
      'can parse uri',
    );

    t.match(
      parseUri('dab:ce1.c185.e1c00098.0.004', 'dab', [4, 5]),
      ['ce1', 'c185', 'e1c00098', '0', '004'],
      'can parse uri with multiple argument numbers and lowest number supplied',
    );

    t.match(
      parseUri('dab:de0.100c.d220.0', 'dab', [4, 5]),
      ['de0', '100c', 'd220', '0'],
      'can parse uri with alternative argument number and largest number supplied',
    );

    t.end();
  });

  t.test('rejects invalid values', (t) => {
    t.throws(() => parseUri('foo:ce1.c586.09580', 'fm', 3));
    t.throws(() => parseUri('fm:ce1.c586', 'fm', 3));
    t.throws(() => parseUri('fm:ce1.c586.09580.x', 'fm', 3));

    t.end();
  });

  t.end();
});
