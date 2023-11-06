import t from 'tap';

import Bearer from '../../../../src/bearer/Bearer.mjs';
import validBearers from '../../../mock/valid.mjs';

t.test('new Bearer()', (t) => {
  t.throws(
    () => new Bearer(),
    new TypeError('Cannot construct Bearer instances directly'),
    'cannot instantiate Bearer class',
  );

  t.end();
});

t.test('Bearer#canParseUri', (t) => {
  validBearers.forEach(({ uri }) => {
    const [scheme] = uri.split(':');
    t.ok(Bearer.canParseUri(uri), `can parse valid ${scheme.toUpperCase()} URI`);
  });

  t.end();
});

t.test('Bearer#canParseFqdn', (t) => {
  validBearers.forEach(({ uri, fqdn }) => {
    if (fqdn === undefined) {
      return;
    }
    const [scheme] = uri.split(':');
    t.ok(Bearer.canParseFqdn(fqdn), `can parse valid ${scheme.toUpperCase()} FQDN`);
  });

  t.end();
});

t.test('Bearer#canParseServiceIdentifier', (t) => {
  validBearers.forEach(({ uri, serviceIdentifier }) => {
    if (serviceIdentifier === undefined) {
      return;
    }
    const [scheme] = uri.split('/');
    t.ok(Bearer.canParseServiceIdentifier(serviceIdentifier), `can parse valid ${scheme.toUpperCase()} service identifier`);
  });

  t.end();
});

t.test('Bearer#fromUri', (t) => {
  validBearers.forEach(({ uri, params }) => {
    const bearer = Bearer.fromUri(uri);
    const [scheme] = uri.split(':');
    Object.entries(params).forEach(([name, expected]) => {
      t.equal(bearer[name], expected, `can parse "${name}" property for "${scheme}:" URI`);
    });
  });

  const unsupportedUri = 'foo:1';
  const expect = new TypeError('Invalid URI');
  expect.input = unsupportedUri;
  expect.code = 'ERR_INVALID_URI';

  t.throws(
    () => { Bearer.fromUri(unsupportedUri); },
    expect,
    'throws when supplied an invalid URI',
  );

  t.end();
});

t.test('Bearer#fromFqdn', (t) => {
  validBearers.forEach(({ uri, fqdn, params }) => {
    if (fqdn === undefined) {
      return;
    }
    const bearer = Bearer.fromFqdn(fqdn);
    const [scheme] = uri.split(':');
    Object.entries(params).forEach(([name, expected]) => {
      t.equal(bearer[name], expected, `can parse "${name}" property for ${scheme.toUpperCase()} FQDN`);
    });
  });

  const unsupportedFqdn = '1.foo';
  const expect = new TypeError('Invalid FQDN');
  expect.input = unsupportedFqdn;
  expect.code = 'ERR_INVALID_FQDN';

  t.throws(
    () => { Bearer.fromFqdn(unsupportedFqdn); },
    expect,
    'throws when supplied an invalid FQDN',
  );

  t.end();
});

t.test('Bearer#fromServiceIdentifier', (t) => {
  validBearers.forEach(({ uri, serviceIdentifier, params }) => {
    if (serviceIdentifier === undefined) {
      return;
    }
    const bearer = Bearer.fromServiceIdentifier(serviceIdentifier);
    const [scheme] = uri.split(':');
    Object.entries(params).forEach(([name, expected]) => {
      t.equal(bearer[name], expected, `can parse "${name}" property for ${scheme.toUpperCase()} service identifer`);
    });
  });

  const unsupportedServiceIdentifier = 'foo/1';
  const expect = new TypeError('Invalid Service Identifier');
  expect.input = unsupportedServiceIdentifier;
  expect.code = 'ERR_INVALID_SERVICE_IDENTIFIER';

  t.throws(
    () => { Bearer.fromServiceIdentifier(unsupportedServiceIdentifier); },
    expect,
    'throws when supplied an invalid service identifier',
  );

  t.end();
});
