import t from 'tap';

import IBOCBearer from '../../../../src/bearer/IBOCBearer.mjs';
import { iboc as validBearers } from '../../../mock/valid.mjs';

t.test('new IBOCBearer()', (t) => {
  validBearers.forEach(({ params: { cc, tx, mid } }) => {
    t.ok(new IBOCBearer(cc, tx, mid), 'can create with valid args');
  });

  const [{ params: { cc, tx, mid } }] = validBearers;
  t.throws(() => new IBOCBearer('foo', tx, mid), 'cannot create with invalid cc');
  t.throws(() => new IBOCBearer(cc, 'foo', mid), 'cannot create with invalid tx');
  t.throws(() => new IBOCBearer(cc, tx, 'foo'), 'cannot create with invalid mid');

  t.end();
});

t.test('IBOCBearer#canParseUri', (t) => {
  validBearers.forEach(({ uri }) => {
    t.ok(IBOCBearer.canParseUri(uri), 'can parse valid URI');
  });

  t.notOk(IBOCBearer.canParseUri('foo:bar'), 'cannot parse invalid URI');

  t.end();
});

t.test('IBOCBearer#fromUri', (t) => {
  validBearers.forEach(({
    uri,
    params: {
      cc,
      tx,
      mid,
    },
  }) => {
    const bearer = IBOCBearer.fromUri(uri);
    t.equal(bearer.cc, cc, 'can parse cc property');
    t.equal(bearer.tx, tx, 'can parse tx property');
    t.equal(bearer.mid, mid, 'can parse mid property');
  });

  t.throws(() => { IBOCBearer.fromUri('foo:bar'); }, 'cannot parse invalid URI');

  t.end();
});

t.test('IBOCBearer.cc', (t) => {
  const [{ params: { cc, tx, mid } }] = validBearers;
  const bearer = new IBOCBearer(cc, tx, mid);

  t.equal(bearer.cc, cc);
  t.throws(() => { bearer.cc = 0x1fff; });
  t.throws(() => { bearer.cc = 'g'; });

  t.end();
});

t.test('IBOCBearer.tx', (t) => {
  const [{ params: { cc, tx, mid } }] = validBearers;
  const bearer = new IBOCBearer(cc, tx, mid);

  t.equal(bearer.tx, tx);
  t.throws(() => { bearer.tx = 0x1fffff; });
  t.throws(() => { bearer.tx = 'g'; });

  t.end();
});

t.test('IBOCBearer.mid', (t) => {
  const [{ params: { cc, tx, mid } }] = validBearers;
  const bearer = new IBOCBearer(cc, tx, mid);

  t.equal(bearer.mid, mid);
  t.throws(() => { bearer.mid = 0x1f; });
  t.throws(() => { bearer.mid = 'g'; });

  t.end();
});

t.test('IBOCBearer.toUri', (t) => {
  validBearers.forEach(({ uri, params }) => {
    const bearer = new IBOCBearer(params.cc, params.tx, params.mid);
    t.equal(bearer.toUri(), uri, 'can generate URI string');
  });

  t.end();
});

t.test('IBOCBearer.toFqdn', (t) => {
  const [{
    fqdn,
    params: {
      cc,
      tx,
      mid,
    },
  }] = validBearers;
  const bearer = new IBOCBearer(cc, tx, mid);

  const noMidParams = validBearers.find(({ params }) => !params.mid);
  const noMidBearer = new IBOCBearer(
    noMidParams.params.cc,
    noMidParams.params.tx,
    noMidParams.params.mid,
  );

  t.equal(bearer.toFqdn(), fqdn, 'can generate FQDN string');
  t.equal(noMidBearer.toFqdn(), noMidParams.fqdn, 'can generate FQDN string without mid');

  t.end();
});

t.test('IBOCBearer.toServiceIdentifier', (t) => {
  const [{
    serviceIdentifier,
    params: {
      cc,
      tx,
      mid,
    },
  }] = validBearers;
  const bearer = new IBOCBearer(cc, tx, mid);

  const noMidParams = validBearers.find(({ params }) => !params.mid);
  const noMidBearer = new IBOCBearer(
    noMidParams.params.cc,
    noMidParams.params.tx,
    noMidParams.params.mid,
  );

  t.equal(bearer.toServiceIdentifier(), serviceIdentifier, 'can generate service identifier string');
  t.equal(noMidBearer.toServiceIdentifier(), noMidParams.serviceIdentifier, 'can generate service identifier string without mid');

  t.end();
});

t.test('IBOCBearer.toString', (t) => {
  const [{
    uri,
    params: {
      cc,
      tx,
      mid,
    },
  }] = validBearers;
  const bearer = new IBOCBearer(cc, tx, mid);

  t.equal(bearer.toString(), uri, 'can generate URI string');
  t.equal(String(bearer), uri, 'can cast to URI string');

  t.end();
});
