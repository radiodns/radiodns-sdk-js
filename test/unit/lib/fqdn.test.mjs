import t from 'tap';

import parseFqdn from '../../../lib/fqdn.mjs';

t.test('parseFqdn', (t) => {
  t.test('parses uri', (t) => {
    t.match(
      parseFqdn('09580.c586.ce1.fm', 'fm', 3),
      ['ce1', 'c586', '09580'],
      'can parse fqdn',
    );

    t.match(
      parseFqdn('004.0.e1c00098.c185.ce1.dab', 'dab', [4, 5]),
      ['ce1', 'c185', 'e1c00098', '0', '004'],
      'can parse fqdn with multiple argument numbers and lowest number supplied',
    );

    t.match(
      parseFqdn('0.d220.100c.de0.dab', 'dab', [4, 5]),
      ['de0', '100c', 'd220', '0'],
      'can parse fqdn with alternative argument number and largest number supplied',
    );

    t.match(
      parseFqdn('09580.c586.ce1.fm.radiodns.org', 'fm', 3),
      ['ce1', 'c586', '09580'],
      'can parse fqdn with radiodns.org suffix',
    );

    t.match(
      parseFqdn('09580.c586.ce1.fm.example.org', 'fm', 3),
      ['ce1', 'c586', '09580'],
      'can parse fqdn with alternate suffix',
    );

    t.end();
  });

  t.test('rejects invalid values', (t) => {
    t.throws(() => parseFqdn('09580.c586.ce1.foo', 'fm', 3), 'reject mismatched scheme');
    t.throws(() => parseFqdn('c586.ce1.fm', 'fm', 3), 'reject incorrect number of arguments');
    t.throws(() => parseFqdn('x.09580.c586.ce1.fm', 'fm', 3), 'reject incorrect number of arguments');

    t.end();
  });

  t.end();
});
