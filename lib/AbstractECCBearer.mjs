import AbstractBearer from './AbstractBearer.mjs';
import ValidationError from './error/ValidationError.mjs';
import castToInt from './int.mjs';

/**
 * Extended abstract class for ECC-based bearers (FM and DAB). Provides ecc
 * property and stubs the read only gcc property (implementation depends on
 * Bearer type, subclasses must override).
 */
export default class AbstractECCBearer extends AbstractBearer {
  /**
   * Extended Country Code (ECC)
   *
   * @type {(number|string)}
   */
  get ecc() {
    return this._ecc;
  }

  set ecc(value) {
    const ecc = castToInt(value, 16);

    if (ecc < 0xa0 || ecc > 0xf9) {
      throw new ValidationError('ecc property must be a number between 0xa0 and 0xf9', ecc);
    }

    this._ecc = ecc;
  }

  /**
   * Global Country Code (GCC)
   *
   * @type {(number|string)}
   */
  get gcc() {
    throw new Error('subclass must override gcc getter');
  }

  set gcc(value) {
    throw new Error('gcc property cannot be written');
  }
}
