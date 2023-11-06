/**
 * Abstract class for all Bearer classes to extend. Provides the common `scheme`
 * property which is read from a static variable declared in each class.
 */
export default class AbstractBearer {
  /**
   * URI scheme for this bearer type
   *
   * @type {string}
   */
  static scheme;

  constructor() {
    if (new.target === AbstractBearer) {
      throw new TypeError('Cannot construct AbstractBearer instances directly');
    }
    if (this.constructor.scheme === undefined) {
      throw new Error('subclass must set scheme static property');
    }
  }

  /**
   * Tests if the supplied URI is valid and parsable
   *
   * @param {string} uri - the URI to be tested
   * @returns {boolean} whether the URI parses without error
   */
  static canParseUri(uri) {
    if (!uri.startsWith(`${this.scheme}:`)) {
      return false;
    }
    try {
      this.fromUri(uri);
    } catch (error) {
      if (error.code !== 'ERR_INVALID_URI') {
        throw error;
      }
      return false;
    }
    return true;
  }

  /**
   * Tests if the supplied FQDN is valid and parsable
   *
   * @param {string} fqdn - the FQDN to be tested
   * @returns {boolean} whether the FQDN parses without error
   */
  static canParseFqdn(fqdn) {
    if (!fqdn.includes(`.${this.scheme}`)) {
      return false;
    }
    try {
      this.fromFqdn(fqdn);
    } catch (error) {
      if (error.code !== 'ERR_INVALID_FQDN') {
        throw error;
      }
      return false;
    }
    return true;
  }

  /**
   * Tests if the supplied service identifier is valid and parsable
   *
   * @param {string} serviceIdentifier - the service identifier to be tested
   * @returns {boolean} whether the service identifier parses without error
   */
  static canParseServiceIdentifier(serviceIdentifier) {
    if (!serviceIdentifier.includes(`${this.scheme}/`)) {
      return false;
    }
    try {
      this.fromServiceIdentifier(serviceIdentifier);
    } catch (error) {
      if (error.code !== 'ERR_INVALID_SERVICE_IDENTIFIER') {
        throw error;
      }
      return false;
    }
    return true;
  }

  /**
   * Parses the supplied parameters in to a Bearer type
   *
   * @param {array} params - order parameters to construct the bearer
   * @returns {Bearer}
   */
  static fromParams(params) { // eslint-disable-line no-unused-vars
    throw new Error('subclass must override fromParams static function');
  }

  /**
   * Parses the supplied string in to a Bearer type
   *
   * @param {string} uri - the URI to be parsed
   * @returns {Bearer}
   */
  static fromUri(uri) { // eslint-disable-line no-unused-vars
    throw new Error('subclass must override fromUri static function');
  }

  /**
   * Parses the supplied string in to a Bearer type
   *
   * @param {string} fqdn - the FQDN to be parsed
   * @returns {Bearer}
   */
  static fromFqdn(fqdn) { // eslint-disable-line no-unused-vars
    throw new Error('subclass must override fromFqdn static function');
  }

  /**
   * Parses the supplied service identifier string in to a Bearer type
   *
   * @param {string} serviceIdentifier - the service identifier to be parsed
   * @returns {Bearer}
   */
  static fromServiceIdentifier(serviceIdentifier) { // eslint-disable-line no-unused-vars
    throw new Error('subclass must override fromServiceIdentifier static function');
  }

  /**
   * Returns an array of ordered strings to make up a URI, fully qualified
   * domain name or service identifier
   *
   * @returns {string[]}
   */
  toParams() {
    throw new Error('subclass must override toParams instance function');
  }

  /**
   * Represents the bearer object to a URI string
   *
   * @returns {string}
   */
  toUri() {
    return [this.constructor.scheme, this.toParams().join('.')].join(':');
  }

  /**
   * Returns the bearer as a Fully Qualified Domain Name (FQDN) string
   *
   * @param {Object} options
   * @param {string} [options.suffix=.radiodns.org] - suffix for the FQDN
   * @returns {string}
   */
  toFqdn(options = {}) {
    const { suffix = 'radiodns.org' } = options;
    return [...this.toParams().reverse(), this.constructor.scheme, suffix].join('.');
  }

  /**
   * Returns the bearer as a service identifier string
   *
   * @returns {string}
   */
  toServiceIdentifier() {
    return [this.constructor.scheme, ...this.toParams()].join('/');
  }

  toString() {
    return this.toUri();
  }
}
