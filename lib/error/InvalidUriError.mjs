/**
 * Thrown when an invalid uniform resource identifier (URI) is provided as input
 * for a function expecting a valid URI.
 */
export default class InvalidUriError extends TypeError {
  /**
   * @param {*} input - the invalid URI
   */
  constructor(input) {
    super('Invalid URI');
    /**
     * assists with identifying the type of error
     * @type {string}
     * @default
     */
    this.code = 'ERR_INVALID_URI';
    /**
     * the invalid URI
     * @type {*}
     */
    this.input = input;
  }
}
