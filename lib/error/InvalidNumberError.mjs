/**
 * Thrown when attempting to cast an unsuitable variable type or value to an
 * integer
 */
export default class InvalidNumberError extends TypeError {
  /**
   * Create an error
   *
   * @param {*} input - the unsuitable value that caused this error to be thrown
   */
  constructor(input) {
    super('Value is not a number');
    /**
     * assists with identifying the type of error
     * @type {string}
     * @default
     */
    this.code = 'ERR_INVALID_NUM';
    /**
     * the invalid number
     * @type {*}
     */
    this.input = input;
  }
}
