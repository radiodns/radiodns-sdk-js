import t from 'tap';

import castToInt from '../../../../lib/int.mjs';
import AMSSBearer from '../../../../src/bearer/AMSSBearer.mjs';
import { amss as validBearers } from '../../../mock/valid.mjs';

t.test('new AMSSBearer()', (t) => {
  validBearers.forEach(({ params: { sid } }) => {
    t.ok(new AMSSBearer(sid), 'can create with valid args');
  });

  t.throws(() => new AMSSBearer('foo'), 'cannot create with invalid sid');

  t.end();
});

t.test('AMSSBearer#canParseUri', (t) => {
  validBearers.forEach(({ uri }) => {
    t.ok(AMSSBearer.canParseUri(uri), 'can parse valid URI');
  });

  t.notOk(AMSSBearer.canParseUri('foo:bar'), 'cannot parse invalid URI');

  t.end();
});

t.test('AMSSBearer#fromUri', (t) => {
  validBearers.forEach(({ uri, params: { sid } }) => {
    const bearer = AMSSBearer.fromUri(uri);
    t.equal(bearer.sid, sid, 'can parse sid property');
  });

  t.throws(() => AMSSBearer.fromUri('amss:12345'), 'cannot parse invalid URI with 5 character sid');
  t.throws(() => AMSSBearer.fromUri('amss:1234567'), 'cannot parse invalid URI with 7 character sid');
  t.throws(() => AMSSBearer.fromUri('foo:bar'), 'cannot parse invalid URI with mismatched URI');

  t.end();
});

t.test('AMSSBearer.sid', async (t) => {
  const [{ params: { sid } }] = validBearers;
  const bearer = new AMSSBearer(sid);

  const unexpectedError = new Error('unexpected error');
  const { default: MockedFMBearer } = await t.mockImport(
    '../../../../src/bearer/AMSSBearer.mjs',
    {
      '../../../../lib/int.mjs': (value, radix) => {
        if (value !== 'foo') {
          return castToInt(value, radix);
        }
        throw unexpectedError;
      },
    },
  );
  const mockedBearer = new MockedFMBearer(sid);

  t.equal(bearer.sid, sid, 'can read sid value');
  t.throws(() => { bearer.sid = -0x1; }, 'cannot write sid with too low value');
  t.throws(() => { bearer.sid = 0x1ffffff; }, 'cannot write sid with too high value');
  t.throws(() => { bearer.sid = 'foo'; }, 'cannot write sid with invalid value');
  t.throws(() => { mockedBearer.sid = 'foo'; }, unexpectedError, 'does not swallow unexpected error');

  t.end();
});

t.test('AMSSBearer.toUri', (t) => {
  const [{ uri, params: { sid } }] = validBearers;
  const bearer = new AMSSBearer(sid);

  t.equal(bearer.toUri(), uri, 'can generate URI string');

  t.end();
});

t.test('AMSSBearer.toFqdn', (t) => {
  const [{ fqdn, params: { sid } }] = validBearers;
  const bearer = new AMSSBearer(sid);

  t.equal(bearer.toFqdn(), fqdn, 'can generate FQDN string');

  t.end();
});

t.test('AMSSBearer.toServiceIdentifier', (t) => {
  const [{ serviceIdentifier, params: { sid } }] = validBearers;
  const bearer = new AMSSBearer(sid);

  t.equal(bearer.toServiceIdentifier(), serviceIdentifier, 'can generate service identifier string');

  t.end();
});

t.test('AMSSBearer.toString', (t) => {
  const [{ uri, params: { sid } }] = validBearers;
  const bearer = new AMSSBearer(sid);

  t.equal(bearer.toString(), uri, 'can generate URI string');
  t.equal(String(bearer), uri, 'can cast to URI string');

  t.end();
});
