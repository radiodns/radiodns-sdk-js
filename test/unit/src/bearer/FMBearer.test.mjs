import t from 'tap';

import ValidationError from '../../../../lib/error/ValidationError.mjs';
import castToInt from '../../../../lib/int.mjs';
import FMBearer from '../../../../src/bearer/FMBearer.mjs';
import { fm as validBearers } from '../../../mock/valid.mjs';

t.test('new FMBearer()', (t) => {
  validBearers.forEach(({ params: { ecc, pi, frequency } }) => {
    t.ok(new FMBearer(ecc, pi, frequency), 'can create with valid args');
  });

  const [{ ecc, pi, frequency }] = validBearers;
  t.throws(() => new FMBearer('foo', pi, frequency), 'cannot create with invalid ecc');
  t.throws(() => new FMBearer(ecc, 'foo', frequency), 'cannot create with invalid pi');
  t.throws(() => new FMBearer(ecc, pi, 'foo'), 'cannot create with invalid frequency');

  t.end();
});

t.test('FMBearer#canParseUri', (t) => {
  validBearers.forEach(({ uri }) => {
    t.ok(FMBearer.canParseUri(uri), 'can parse valid URI');
  });

  t.notOk(FMBearer.canParseUri('foo:bar'), 'cannot parse invalid URI');

  t.end();
});

t.test('FMBearer#fromUri', (t) => {
  validBearers.forEach(({
    uri,
    params: {
      ecc,
      pi,
      frequency,
    },
  }) => {
    const bearer = FMBearer.fromUri(uri);
    t.equal(bearer.ecc, ecc, 'can parse ecc property');
    t.equal(bearer.pi, pi, 'can parse pi property');
    t.equal(bearer.frequency, frequency, 'can parse frequency property');
  });

  t.throws(
    () => { FMBearer.fromUri('fm:ce.c123.09850'); },
    { message: 'gcc URI parameter must be 3 digit hexadecimal number' },
    'cannot parse invalid URI with too short gcc',
  );
  t.throws(
    () => { FMBearer.fromUri('fm:ce11.c123.09850'); },
    { message: 'gcc URI parameter must be 3 digit hexadecimal number' },
    'cannot parse invalid URI with too long gcc',
  );
  t.throws(
    () => { FMBearer.fromUri('fm:ce1.c12.09850'); },
    { message: 'pi URI parameter must be 4 digit hexadecimal number' },
    'cannot parse invalid URI with too short pi',
  );
  t.throws(
    () => { FMBearer.fromUri('fm:ce1.c1234.09850'); },
    { message: 'pi URI parameter must be 4 digit hexadecimal number' },
    'cannot parse invalid URI with too long pi',
  );
  t.throws(
    () => { FMBearer.fromUri('fm:ce1.c123.0985'); },
    { message: 'frequency URI parameter must be a 5 digit number with zero padding' },
    'cannot parse invalid URI with too short frequency',
  );
  t.throws(
    () => { FMBearer.fromUri('fm:ce1.c123.098501'); },
    { message: 'frequency URI parameter must be a 5 digit number with zero padding' },
    'cannot parse invalid URI with too long frequency',
  );
  t.throws(
    () => { FMBearer.fromUri('foo:bar'); },
    { message: 'Invalid URI' },
    'cannot parse invalid URI',
  );

  t.end();
});

t.test('FMBearer.gcc', (t) => {
  const [{
    params: {
      ecc,
      gcc,
      pi,
      frequency,
    },
  }] = validBearers;
  const bearer = new FMBearer(ecc, pi, frequency);

  t.equal(bearer.gcc, gcc);

  t.end();
});

t.test('FMBearer.ecc', (t) => {
  const [{ params: { ecc, pi, frequency } }] = validBearers;
  const bearer = new FMBearer(ecc, pi, frequency);

  t.equal(bearer.ecc, ecc);

  t.end();
});

t.test('FMBearer.pi', async (t) => {
  const [{ params: { ecc, pi, frequency } }] = validBearers;
  const bearer = new FMBearer(ecc, pi, frequency);

  const unexpectedError = new Error('unexpected error');
  const { default: MockedFMBearer } = await t.mockImport(
    '../../../../src/bearer/FMBearer.mjs',
    {
      '../../../../lib/int.mjs': (value, radix) => {
        if (value !== 'foo') {
          return castToInt(value, radix);
        }
        throw unexpectedError;
      },
    },
  );
  const mockedBearer = new MockedFMBearer(ecc, pi, frequency);

  t.equal(bearer.pi, pi, 'can read pi value');
  t.throws(() => { bearer.pi = 0x999; }, 'cannot write pi with too low value');
  t.throws(() => { bearer.pi = 0x1ffff; }, 'cannot write pi with too high value');
  t.throws(() => { bearer.pi = 'foo'; }, 'cannot write pi with invalid value');
  t.throws(() => { mockedBearer.pi = 'foo'; }, unexpectedError, 'does not swallow unexpected error');

  t.end();
});

t.test('FMBearer.frequency', (t) => {
  const [{ params: { ecc, pi, frequency } }] = validBearers;
  const bearer = new FMBearer(ecc, pi, frequency);

  t.equal(bearer.frequency, frequency, 'can read frequency value');
  t.throws(
    () => { bearer.frequency = 75.9; },
    new ValidationError('frequency property must be a number between 76 and 108 (MHz)', 75.9),
    'cannot write frequency with too low value',
  );
  t.throws(
    () => { bearer.frequency = 180.1; },
    new ValidationError('frequency property must be a number between 76 and 108 (MHz)', 180.1),
    'cannot write frequency with too high value',
  );
  t.throws(
    () => { bearer.frequency = 'foo'; },
    new ValidationError('frequency property must be a number between 76 and 108 (MHz)', 'foo'),
    'cannot write frequency with invalid value',
  );

  t.end();
});

t.test('FMBearer.toUri', (t) => {
  const [{ uri, params: { ecc, pi, frequency } }] = validBearers;
  const bearer = new FMBearer(ecc, pi, frequency);

  const wildcardParams = validBearers.find(({ params }) => !params.frequency);
  const wildcardBearer = new FMBearer(wildcardParams.params.ecc, wildcardParams.params.pi);

  t.equal(bearer.toUri(), uri, 'can generate URI string');
  t.equal(wildcardBearer.toUri(), wildcardParams.uri, 'can generate URI string with wildcard');

  t.end();
});

t.test('FMBearer.toFqdn', (t) => {
  const [{ fqdn, params: { ecc, pi, frequency } }] = validBearers;
  const bearer = new FMBearer(ecc, pi, frequency);

  const wildcardParams = validBearers.find(({ params }) => !params.frequency);
  const wildcardBearer = new FMBearer(wildcardParams.params.ecc, wildcardParams.params.pi);

  t.equal(bearer.toFqdn(), fqdn, 'can generate fqdn string');
  t.throws(() => wildcardBearer.toFqdn(), 'cannot generate fqdn string with wildcard');

  t.end();
});

t.test('FMBearer.toServiceIdentifier', (t) => {
  const [{ serviceIdentifier, params: { ecc, pi, frequency } }] = validBearers;
  const bearer = new FMBearer(ecc, pi, frequency);

  const wildcardParams = validBearers.find(({ params }) => !params.frequency);
  const wildcardBearer = new FMBearer(wildcardParams.params.ecc, wildcardParams.params.pi);

  t.equal(bearer.toServiceIdentifier(), serviceIdentifier, 'can generate service identifier string');
  t.throws(() => wildcardBearer.toServiceIdentifier(), 'cannot generate service identifier string with wildcard');

  t.end();
});

t.test('FMBearer.toString', (t) => {
  const [{ uri, params: { ecc, pi, frequency } }] = validBearers;
  const bearer = new FMBearer(ecc, pi, frequency);

  t.equal(bearer.toString(), uri, 'can generate URI string');
  t.equal(String(bearer), uri, 'can cast to URI string');

  t.end();
});
