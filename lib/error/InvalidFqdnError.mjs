/**
 * Thrown when an invalid fully qualified domain name (FQDN) is provided as
 * input for a function expecting a valid FQDN
 */
export default class InvalidFqdnError extends TypeError {
  /**
   * @param {*} input - the invalid FQDN
   */
  constructor(input) {
    super('Invalid FQDN');
    /**
     * assists with identifying the type of error
     * @type {string}
     * @default
     */
    this.code = 'ERR_INVALID_FQDN';
    /**
     * the invalid fqdn
     * @type {*}
     */
    this.input = input;
  }
}
