/* eslint-disable max-classes-per-file */
import t from 'tap';

import AbstractBearer from '../../../lib/AbstractBearer.mjs';
import InvalidFqdnError from '../../../lib/error/InvalidFqdnError.mjs';
import InvalidServiceIdentifierError from '../../../lib/error/InvalidServiceIdentifierError.mjs';
import InvalidURIError from '../../../lib/error/InvalidUriError.mjs';

t.test('new AbstractBearer()', (t) => {
  t.throws(
    () => new AbstractBearer(),
    new TypeError('Cannot construct AbstractBearer instances directly'),
    'cannot instantiate AbstractBearer class',
  );

  t.throws(
    () => {
      class NoStaticSchemeExample extends AbstractBearer {}

      new NoStaticSchemeExample(); // eslint-disable-line no-new
    },
    new Error('subclass must set scheme static property'),
    'cannot instantiate a subclass without scheme static variable',
  );

  t.end();
});

t.test('AbstractBearer#canParseUri', (t) => {
  class ImplementedBearer extends AbstractBearer {
    static scheme = 'foo';

    static fromUri() {}
  }

  t.ok(ImplementedBearer.canParseUri('foo:bar'), 'can parse a bearer when implemented');
  t.notOk(AbstractBearer.canParseUri('foo:bar'), 'cannot parse an unrecognised bearer');

  class ExpectedErroringBearer extends AbstractBearer {
    static scheme = 'foo';

    static fromUri() {
      throw new InvalidURIError();
    }
  }

  t.notOk(ExpectedErroringBearer.canParseUri('foo:bar'), 'does swallow expected error');

  const unexpectedError = new Error('unexpected error');

  class UnexpectedErroringBearer extends AbstractBearer {
    static scheme = 'foo';

    static fromUri() {
      throw unexpectedError;
    }
  }

  t.throws(
    () => { UnexpectedErroringBearer.canParseUri('foo:bar'); },
    unexpectedError,
    'does not swallow unexpected error',
  );

  t.end();
});

t.test('AbstractBearer#canParseFqdn', (t) => {
  class ImplementedBearer extends AbstractBearer {
    static scheme = 'foo';

    static fromFqdn() {}
  }

  t.ok(ImplementedBearer.canParseFqdn('bar.foo'), 'can parse a bearer when implemented');
  t.notOk(AbstractBearer.canParseFqdn('bar.foo'), 'cannot parse an unrecognised bearer');

  class ExpectedErroringBearer extends AbstractBearer {
    static scheme = 'foo';

    static fromFqdn() {
      throw new InvalidFqdnError();
    }
  }

  t.notOk(ExpectedErroringBearer.canParseFqdn('bar.foo'), 'does swallow expected error');

  const unexpectedError = new Error('unexpected error');

  class UnexpectedErroringBearer extends AbstractBearer {
    static scheme = 'foo';

    static fromFqdn() {
      throw unexpectedError;
    }
  }

  t.throws(
    () => { UnexpectedErroringBearer.canParseFqdn('bar.foo'); },
    unexpectedError,
    'does not swallow unexpected error',
  );

  t.end();
});

t.test('AbstractBearer#canParseServiceIdentifier', (t) => {
  class ImplementedBearer extends AbstractBearer {
    static scheme = 'foo';

    static fromServiceIdentifier() {}
  }

  t.ok(ImplementedBearer.canParseServiceIdentifier('foo/bar'), 'can parse a bearer when implemented');
  t.notOk(AbstractBearer.canParseServiceIdentifier('foo/bar'), 'cannot parse an unrecognised bearer');

  class ExpectedErroringBearer extends AbstractBearer {
    static scheme = 'foo';

    static fromServiceIdentifier() {
      throw new InvalidServiceIdentifierError();
    }
  }

  t.notOk(ExpectedErroringBearer.canParseServiceIdentifier('foo/bar'), 'does swallow expected error');

  const unexpectedError = new Error('unexpected error');

  class UnexpectedErroringBearer extends AbstractBearer {
    static scheme = 'foo';

    static fromServiceIdentifier() {
      throw unexpectedError;
    }
  }

  t.throws(
    () => { UnexpectedErroringBearer.canParseServiceIdentifier('foo/bar'); },
    unexpectedError,
    'does not swallow unexpected error',
  );

  t.end();
});

t.test('AbstractBearer#fromParams', (t) => {
  t.throws(
    () => { AbstractBearer.fromParams(['bar']); },
    new Error('subclass must override fromParams static function'),
    'cannot call fromParams method',
  );

  t.end();
});

t.test('AbstractBearer#fromUri', (t) => {
  t.throws(
    () => { AbstractBearer.fromUri('foo:bar'); },
    new Error('subclass must override fromUri static function'),
    'cannot call fromUri method',
  );

  t.end();
});

t.test('AbstractBearer#fromFqdn', (t) => {
  t.throws(
    () => { AbstractBearer.fromFqdn('bar.foo'); },
    new Error('subclass must override fromFqdn static function'),
    'cannot call fromFqdn method',
  );

  t.end();
});

t.test('AbstractBearer#fromServiceIdentifier', (t) => {
  t.throws(
    () => { AbstractBearer.fromServiceIdentifier('foo/bar'); },
    new Error('subclass must override fromServiceIdentifier static function'),
    'cannot call fromServiceIdentifier method',
  );

  t.end();
});

class NoToParamsBearer extends AbstractBearer {
  static scheme = 'example';
}

t.test('AbstractBearer.toParams', (t) => {
  const bearer = new NoToParamsBearer();

  t.throws(
    () => bearer.toParams(),
    new Error('subclass must override toParams instance function'),
    'cannot call toParams method',
  );

  t.end();
});

class ToParamsBearer extends AbstractBearer {
  static scheme = 'example';

  toParams() {
    return ['foo', 'bar', 'baz'];
  }
}

t.test('AbstractBearer.toUri', (t) => {
  const bearer = new ToParamsBearer();

  t.equal(bearer.toUri(), 'example:foo.bar.baz', 'can construct FQDN from params');

  t.end();
});

t.test('AbstractBearer.toFqdn', (t) => {
  const bearer = new ToParamsBearer();

  t.equal(
    bearer.toFqdn(),
    'baz.bar.foo.example.radiodns.org',
    'can construct FQDN from params',
  );
  t.equal(
    bearer.toFqdn({ suffix: 'example.org' }),
    'baz.bar.foo.example.example.org',
    'can construct FQDN from params',
  );

  t.end();
});

t.test('AbstractBearer.toServiceIdentifier', (t) => {
  const bearer = new ToParamsBearer();

  t.equal(
    bearer.toServiceIdentifier(),
    'example/foo/bar/baz',
    'can construct service identifier',
  );

  t.end();
});
