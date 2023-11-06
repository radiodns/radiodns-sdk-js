import t from 'tap';

import DABBearer from '../../../../src/bearer/DABBearer.mjs';
import { dab as validBearers } from '../../../mock/valid.mjs';

t.test('new DABBearer()', (t) => {
  validBearers.forEach(({
    params: {
      ecc,
      eid,
      sid,
      scids,
      uatype,
    },
  }) => {
    t.ok(new DABBearer(ecc, eid, sid, scids, uatype), 'can create with valid args');
  });

  const [{
    params: {
      ecc,
      eid,
      sid,
      scids,
      uatype,
    },
  }] = validBearers;
  t.throws(() => new DABBearer('foo', eid, sid, scids, uatype), 'cannot create with invalid ecc arg');
  t.throws(() => new DABBearer(ecc, 'foo', sid, scids, uatype), 'cannot create with invalid eid arg');
  t.throws(() => new DABBearer(ecc, eid, 'foo', scids, uatype), 'cannot create with invalid sid arg');
  t.throws(() => new DABBearer(ecc, eid, sid, 'foo', uatype), 'cannot create with invalid scids arg');
  t.throws(() => new DABBearer(ecc, eid, sid, scids, 'foo'), 'cannot create with invalid uatype arg');

  t.end();
});

t.test('DABBearer#canParseUri', (t) => {
  validBearers.forEach(({ uri }) => {
    t.ok(DABBearer.canParseUri(uri), 'can parse valid URI');
  });

  t.notOk(DABBearer.canParseUri('foo:bar'), 'cannot parse invalid URI');

  t.end();
});

t.test('DABBearer#fromUri', (t) => {
  validBearers.forEach(({
    uri,
    params: {
      ecc,
      eid,
      sid,
      scids,
      uatype,
    },
  }) => {
    const bearer = DABBearer.fromUri(uri);
    t.equal(bearer.ecc, ecc, 'can parse ecc property');
    t.equal(bearer.eid, eid, 'can parse eid property');
    t.equal(bearer.sid, sid, 'can parse sid property');
    t.equal(bearer.scids, scids, 'can parse scids property');
    t.equal(bearer.uatype, uatype, 'can parse uatype property');
  });

  t.throws(
    () => { DABBearer.fromUri('dab:ce1.c123'); },
    { message: 'Invalid URI' },
    'cannot parse invalid URI with too few parameters',
  );
  t.throws(
    () => { DABBearer.fromUri('dab:ce.c123.c456.0'); },
    { message: 'gcc URI parameter must be a 3 digit hexadecimal number' },
    'cannot parse invalid URI with too short gcc',
  );
  t.throws(
    () => { DABBearer.fromUri('dab:ce11.c123.c456.0'); },
    { message: 'gcc URI parameter must be a 3 digit hexadecimal number' },
    'cannot parse invalid URI with too long gcc',
  );
  t.throws(
    () => { DABBearer.fromUri('dab:ce1.c12.c456.0'); },
    { message: 'eid URI parameter must be a 4 digit hexadecimal number' },
    'cannot parse invalid URI with too short eid',
  );
  t.throws(
    () => { DABBearer.fromUri('dab:ce1.c1234.c456.0'); },
    { message: 'eid URI parameter must be a 4 digit hexadecimal number' },
    'cannot parse invalid URI with too long eid',
  );
  t.throws(
    () => { DABBearer.fromUri('dab:ce1.c123.c45.0'); },
    { message: 'sid URI parameter must be a 4 or 8 digit hexadecimal number' },
    'cannot parse invalid URI with too short sid',
  );
  t.throws(
    () => { DABBearer.fromUri('dab:ce1.c123.e1c4567.0'); },
    { message: 'sid URI parameter must be a 4 or 8 digit hexadecimal number' },
    'cannot parse invalid URI with too long/short sid',
  );
  t.throws(
    () => { DABBearer.fromUri('dab:ce1.c123.e1c456789.0'); },
    { message: 'sid URI parameter must be a 4 or 8 digit hexadecimal number' },
    'cannot parse invalid URI with too long sid',
  );
  t.throws(
    () => { DABBearer.fromUri('dab:ce1.c123.c456.'); },
    { message: 'scids URI parameter must be a 1 digit hexadecimal number' },
    'cannot parse invalid URI with too short scids',
  );
  t.throws(
    () => { DABBearer.fromUri('dab:ce1.c123.c456.12'); },
    { message: 'scids URI parameter must be a 1 digit hexadecimal number' },
    'cannot parse invalid URI with too long scids',
  );
  t.throws(
    () => { DABBearer.fromUri('dab:ce1.c123.c456.0.12'); },
    { message: 'uatype URI parameter must be a 3 digit hexadecimal number' },
    'cannot parse invalid URI with too short uatype',
  );
  t.throws(
    () => { DABBearer.fromUri('dab:ce1.c123.c456.0.1234'); },
    { message: 'uatype URI parameter must be a 3 digit hexadecimal number' },
    'cannot parse invalid URI with too long uatype',
  );
  t.throws(
    () => { DABBearer.fromUri('foo:bar'); },
    { message: 'Invalid URI' },
    'cannot parse invalid URI',
  );

  t.end();
});

t.test('DABBearer.gcc', (t) => {
  const [{
    params: {
      gcc,
      ecc,
      eid,
      sid,
      scids,
      uatype,
    },
  }] = validBearers;
  const bearer = new DABBearer(ecc, eid, sid, scids, uatype);

  t.equal(bearer.gcc, gcc);

  t.end();
});

t.test('DABBearer.ecc', (t) => {
  const [{
    params: {
      ecc,
      eid,
      sid,
      scids,
      uatype,
    },
  }] = validBearers;
  const bearer = new DABBearer(ecc, eid, sid, scids, uatype);

  t.equal(bearer.ecc, ecc);

  t.end();
});

t.test('DABBearer.eid', (t) => {
  const [{
    params: {
      ecc,
      eid,
      sid,
      scids,
      uatype,
    },
  }] = validBearers;
  const bearer = new DABBearer(ecc, eid, sid, scids, uatype);

  t.equal(bearer.eid, eid);
  t.throws(() => { bearer.eid = 0x999; });
  t.throws(() => { bearer.eid = 0x1ffff; });
  t.throws(() => { bearer.eid = 'g'; });

  t.end();
});

t.test('DABBearer.sid', (t) => {
  const [{
    params: {
      ecc,
      eid,
      sid,
      scids,
      uatype,
    },
  }] = validBearers;
  const bearer = new DABBearer(ecc, eid, sid, scids, uatype);

  t.equal(bearer.sid, sid);
  t.throws(() => { bearer.sid = 0x999; });
  t.throws(() => { bearer.sid = 0x1ffff; });
  t.throws(() => { bearer.sid = 0x1ffffffff; });
  t.throws(() => { bearer.sid = 'g'; });
  t.throws(() => { bearer.sid = 0xd1c00000; });

  t.end();
});

t.test('DABBearer.scids', (t) => {
  const [{
    params: {
      ecc,
      eid,
      sid,
      scids,
      uatype,
    },
  }] = validBearers;
  const bearer = new DABBearer(ecc, eid, sid, scids, uatype);

  t.equal(bearer.scids, scids);
  t.throws(() => { bearer.scids = 0x1f; });
  t.throws(() => { bearer.scids = 'g'; });

  t.end();
});

t.test('DABBearer.uatype', (t) => {
  const [{
    params: {
      ecc,
      eid,
      sid,
      scids,
      uatype,
    },
  }] = validBearers;
  const bearer = new DABBearer(ecc, eid, sid, scids, uatype);

  t.equal(bearer.uatype, uatype);
  t.throws(() => { bearer.uatype = 0x1fff; });
  t.throws(() => { bearer.uatype = 'g'; });

  t.end();
});

t.test('DABBearer.toUri', (t) => {
  const [{
    uri,
    params: {
      ecc,
      eid,
      sid,
      scids,
      uatype,
    },
  }] = validBearers;
  const bearer = new DABBearer(ecc, eid, sid, scids, uatype);

  const noUatypeParams = validBearers.find(({ params }) => !params.uatype);
  const noUatypeBearer = new DABBearer(
    noUatypeParams.params.ecc,
    noUatypeParams.params.eid,
    noUatypeParams.params.sid,
    noUatypeParams.params.scids,
  );

  t.equal(bearer.toUri(), uri, 'can generate URI string');
  t.equal(noUatypeBearer.toUri(), noUatypeParams.uri, 'can generate URI string without uatype');

  t.end();
});

t.test('DABBearer.toFqdn', (t) => {
  const [{
    fqdn,
    params: {
      ecc,
      eid,
      sid,
      scids,
      uatype,
    },
  }] = validBearers;
  const bearer = new DABBearer(ecc, eid, sid, scids, uatype);

  const noUatypeParams = validBearers.find(({ params }) => !params.uatype);
  const noUatypeBearer = new DABBearer(
    noUatypeParams.params.ecc,
    noUatypeParams.params.eid,
    noUatypeParams.params.sid,
    noUatypeParams.params.scids,
  );

  t.equal(bearer.toFqdn(), fqdn, 'can generate FQDN string');
  t.equal(noUatypeBearer.toFqdn(), noUatypeParams.fqdn, 'can generate FQDN string without uatype');

  t.end();
});

t.test('DABBearer.toServiceIdentifier', (t) => {
  const [{
    serviceIdentifier,
    params: {
      ecc,
      eid,
      sid,
      scids,
      uatype,
    },
  }] = validBearers;
  const bearer = new DABBearer(ecc, eid, sid, scids, uatype);

  const noUatypeParams = validBearers.find(({ params }) => !params.uatype);
  const noUatypeBearer = new DABBearer(
    noUatypeParams.params.ecc,
    noUatypeParams.params.eid,
    noUatypeParams.params.sid,
    noUatypeParams.params.scids,
  );

  t.equal(bearer.toServiceIdentifier(), serviceIdentifier, 'can generate service identifier string');
  t.equal(noUatypeBearer.toServiceIdentifier(), noUatypeParams.serviceIdentifier, 'can generate service identifier string without uatype');

  t.end();
});

t.test('DABBearer.toString', (t) => {
  const [{
    uri,
    params: {
      ecc,
      eid,
      sid,
      scids,
      uatype,
    },
  }] = validBearers;
  const bearer = new DABBearer(ecc, eid, sid, scids, uatype);

  t.equal(bearer.toString(), uri, 'can generate URI string');
  t.equal(String(bearer), uri, 'can cast to URI string');

  t.end();
});
