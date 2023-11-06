import t from 'tap';

import DRMBearer from '../../../../src/bearer/DRMBearer.mjs';
import { drm as validBearers } from '../../../mock/valid.mjs';

t.test('new DRMBearer()', (t) => {
  validBearers.forEach(({ params: { sid, adddomain, uatype } }) => {
    t.ok(new DRMBearer(sid, adddomain, uatype), 'can create with valid args');
  });

  const [{ params: { sid, appdomain, uatype } }] = validBearers;
  t.throws(() => new DRMBearer('foo', appdomain, uatype), 'cannot create with invalid sid');
  t.throws(() => new DRMBearer(sid, 'foo', uatype), 'cannot create with invalid appdomain');
  t.throws(() => new DRMBearer(sid, appdomain, 'foo'), 'cannot create with invalid uatype');

  t.end();
});

t.test('DRMBearer#canParseUri', (t) => {
  validBearers.forEach(({ uri }) => {
    t.ok(DRMBearer.canParseUri(uri), 'can parse valid URI');
  });

  t.notOk(DRMBearer.canParseUri('foo:bar'), 'cannot parse invalid URI');

  t.end();
});

t.test('DRMBearer#fromUri', (t) => {
  validBearers.forEach(({
    uri,
    params: {
      sid,
      appdomain,
      uatype,
    },
  }) => {
    const bearer = DRMBearer.fromUri(uri);
    t.equal(bearer.sid, sid, 'can parse sid property');
    t.equal(bearer.appdomain, appdomain, 'can parse appdomain property');
    t.equal(bearer.uatype, uatype, 'can parse uatype property');
  });

  t.throws(
    () => { DRMBearer.fromUri('drm:a1234'); },
    { message: 'sid URI parameter must be 6 digit hexadecimal number' },
    'cannot parse invalid URI with too short sid',
  );
  t.throws(
    () => { DRMBearer.fromUri('drm:a123456'); },
    { message: 'sid URI parameter must be 6 digit hexadecimal number' },
    'cannot parse invalid URI with too long sid',
  );
  t.throws(
    () => { DRMBearer.fromUri('drm:a12345..123'); },
    { message: 'appdomain URI parameter must be 1 digit hexadecimal number' },
    'cannot parse invalid URI with too short appdomain',
  );
  t.throws(
    () => { DRMBearer.fromUri('drm:a12345.11.123'); },
    { message: 'appdomain URI parameter must be 1 digit hexadecimal number' },
    'cannot parse invalid URI with too long appdomain',
  );
  t.throws(
    () => { DRMBearer.fromUri('drm:a12345.1.12'); },
    { message: 'uatype URI parameter must be 3 digit hexadecimal number' },
    'cannot parse invalid URI with too short uatype',
  );
  t.throws(
    () => { DRMBearer.fromUri('drm:a12345.1.1234'); },
    { message: 'uatype URI parameter must be 3 digit hexadecimal number' },
    'cannot parse invalid URI with too long uatype',
  );
  t.throws(
    () => { DRMBearer.fromUri('foo:bar'); },
    { message: 'Invalid URI' },
    'cannot parse invalid URI',
  );

  t.end();
});

t.test('DRMBearer.sid', (t) => {
  const [{ params: { sid, appdomain, uatype } }] = validBearers;
  const bearer = new DRMBearer(sid, appdomain, uatype);

  t.equal(bearer.sid, sid);
  t.throws(() => { bearer.sid = 0x1ffffff; });
  t.throws(() => { bearer.sid = 'g'; });

  t.end();
});

t.test('DRMBearer.appdomain', (t) => {
  const [{ params: { sid, appdomain, uatype } }] = validBearers;
  const bearer = new DRMBearer(sid, appdomain, uatype);

  t.equal(bearer.appdomain, appdomain);
  t.throws(() => { bearer.appdomain = 0x1f; });
  t.throws(() => { bearer.appdomain = 'g'; });

  t.end();
});

t.test('DRMBearer.uatype', (t) => {
  const [{ params: { sid, appdomain, uatype } }] = validBearers;
  const bearer = new DRMBearer(sid, appdomain, uatype);

  t.equal(bearer.uatype, uatype);
  t.throws(() => { bearer.uatype = 0x1ffff; });
  t.throws(() => { bearer.uatype = 'g'; });

  t.end();
});

t.test('DRMBearer.toUri', (t) => {
  const [{
    uri,
    params: {
      sid,
      appdomain,
      uatype,
    },
  }] = validBearers;
  const bearer = new DRMBearer(sid, appdomain, uatype);

  const noUatypeParams = validBearers.find(({ params }) => !params.appdomain && !params.uatype);
  const noUatypeBearer = new DRMBearer(
    noUatypeParams.params.sid,
    noUatypeParams.params.appdomain,
    noUatypeParams.params.uatype,
  );

  t.equal(bearer.toUri(), uri, 'can generate URI string');
  t.equal(noUatypeBearer.toUri(), noUatypeParams.uri, 'can generate URI string without uatype');

  t.end();
});

t.test('DRMBearer.toFqdn', (t) => {
  const [{
    fqdn,
    params: {
      sid,
      appdomain,
      uatype,
    },
  }] = validBearers;
  const bearer = new DRMBearer(sid, appdomain, uatype);

  const noUatypeParams = validBearers.find(({ params }) => !params.appdomain && !params.uatype);
  const noUatypeBearer = new DRMBearer(
    noUatypeParams.params.sid,
    noUatypeParams.params.appdomain,
    noUatypeParams.params.uatype,
  );

  t.equal(bearer.toFqdn(), fqdn, 'can generate URI string');
  t.equal(noUatypeBearer.toFqdn(), noUatypeParams.fqdn, 'can generate URI string without uatype');

  t.end();
});

t.test('DRMBearer.toServiceIdentifier', (t) => {
  const [{
    serviceIdentifier,
    params: {
      sid,
      appdomain,
      uatype,
    },
  }] = validBearers;
  const bearer = new DRMBearer(sid, appdomain, uatype);

  const noUatypeParams = validBearers.find(({ params }) => !params.appdomain && !params.uatype);
  const noUatypeBearer = new DRMBearer(
    noUatypeParams.params.sid,
    noUatypeParams.params.appdomain,
    noUatypeParams.params.uatype,
  );

  t.equal(bearer.toServiceIdentifier(), serviceIdentifier, 'can generate URI string');
  t.equal(noUatypeBearer.toServiceIdentifier(), noUatypeParams.serviceIdentifier, 'can generate URI string without uatype');

  t.end();
});

t.test('DRMBearer.toString', (t) => {
  const [{
    uri,
    params: {
      sid,
      appdomain,
      uatype,
    },
  }] = validBearers;
  const bearer = new DRMBearer(sid, appdomain, uatype);

  t.equal(bearer.toString(), uri, 'can generate URI string');
  t.equal(String(bearer), uri, 'can cast to URI string');

  t.end();
});
