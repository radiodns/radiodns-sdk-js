/**
 * Thrown when an invalid value is supplied, either assigning to a property or
 * passing as an argument to a function.
 */
export default class ValidationError extends TypeError {
  /**
   * @param {string} message - description of the issue
   * @param {*} input - the value that caused the issue
   */
  constructor(message, input) {
    super(message);
    /**
     * assists with identifying the type of error
     * @type {string}
     * @default
     */
    this.code = 'ERR_INVALID';
    /**
     * the value that caused the issue
     * @type {*}
     */
    this.input = input;
  }
}
