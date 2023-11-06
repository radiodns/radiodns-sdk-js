import AMSSBearer from './AMSSBearer.mjs';
import DABBearer from './DABBearer.mjs';
import DRMBearer from './DRMBearer.mjs';
import FMBearer from './FMBearer.mjs';
import IBOCBearer from './IBOCBearer.mjs';
import InvalidFqdnError from '../../lib/error/InvalidFqdnError.mjs';
import InvalidServiceIdentifierError from '../../lib/error/InvalidServiceIdentifierError.mjs';
import InvalidUriError from '../../lib/error/InvalidUriError.mjs';

// allows us to iterate sub-classes
const classes = [
  AMSSBearer,
  DABBearer,
  DRMBearer,
  FMBearer,
  IBOCBearer,
];

/**
 * Base class for all Bearer types
 */
export default class Bearer {
  constructor() {
    if (new.target === this.constructor) {
      throw new TypeError('Cannot construct Bearer instances directly');
    }
  }

  /**
   * Tests if the passed value is a valid Uniform Resource Identifier (URI) for
   * the Bearer scheme the target class represents. For the parent Bearer class,
   * it tries all known schemes.
   *
   * @param {string} uri - URI to test
   * @returns {boolean}
   */
  static canParseUri(uri) {
    return classes.some((cls) => cls.canParseUri(uri));
  }

  /**
   * Tests if the passed value is a valid Fully Qualified Domain Name (FQDN) for
   * the Bearer scheme the target class represents. For the parent Bearer class,
   * it tries all known schemes.
   *
   * @param {string} fqdn - FQDN to test
   * @returns {boolean}
   */
  static canParseFqdn(fqdn) {
    return classes.some((cls) => cls.canParseFqdn(fqdn));
  }

  /**
   * Tests if the passed value is a valid service identifer for the Bearer
   * scheme the target class represents. For the parent Bearer class, it tries
   * all known schemes.
   *
   * @param {string} serviceIdentifier - service identifier to test
   * @returns {boolean}
   */
  static canParseServiceIdentifier(serviceIdentifier) {
    return classes.some((cls) => cls.canParseServiceIdentifier(serviceIdentifier));
  }

  /**
   * Creates a relevant Bearer subclass instance for the given Uniform Resource
   * Identifier (URI)
   *
   * @param {string} uri - URI to parse for bearer construction
   * @returns {Bearer}
   * @throws {InvalidUriError}
  */
  static fromUri(uri) {
    const subclass = classes.find((cls) => cls.canParseUri(uri));
    if (subclass === undefined) {
      throw new InvalidUriError(uri);
    }
    return subclass.fromUri(uri);
  }

  /**
   * Creates a relevant Bearer subclass instance for the given Fully Qualified
   * Domain Name (FQDN)
   *
   * @param {string} fqdn - FQDN to parse for the bearer construction
   * @returns {Bearer}
   * @throws {InvalidFqdnError}
   */
  static fromFqdn(fqdn) {
    const subclass = classes.find((cls) => cls.canParseFqdn(fqdn));
    if (subclass === undefined) {
      throw new InvalidFqdnError(fqdn);
    }
    return subclass.fromFqdn(fqdn);
  }

  /**
   * Creates a relevant Bearer subclass instance for the given service
   * identifier
   *
   * @param {string} serviceIdentifier
   *   - service identifier to parse for the bearer construction
   * @returns {Bearer}
   * @throws {InvalidServiceIdentifierError}
   */
  static fromServiceIdentifier(serviceIdentifier) {
    const subclass = classes.find((cls) => cls.canParseServiceIdentifier(serviceIdentifier));
    if (subclass === undefined) {
      throw new InvalidServiceIdentifierError(serviceIdentifier);
    }
    return subclass.fromServiceIdentifier(serviceIdentifier);
  }
}
