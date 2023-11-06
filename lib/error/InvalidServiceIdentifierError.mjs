/**
 * Thrown when an invalid service identifier is provided as input for a function
 * expecting a valid FQDN.
 */
export default class InvalidServiceIdentifierError extends TypeError {
  /**
   * @param {*} input - the invalid service identifier
   */
  constructor(input) {
    super('Invalid Service Identifier');
    /**
     * assists with identifying the type of error
     * @type {string}
     * @default
     */
    this.code = 'ERR_INVALID_SERVICE_IDENTIFIER';
    /**
     * the invalid service identifier
     * @type {*}
     */
    this.input = input;
  }
}
