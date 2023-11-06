/* eslint-disable no-bitwise */
import AbstractECCBearer from '../../lib/AbstractECCBearer.mjs';
import parseCountry from '../../lib/country.mjs';
import ValidationError from '../../lib/error/ValidationError.mjs';
import parseFqdn from '../../lib/fqdn.mjs';
import isHex from '../../lib/hex.mjs';
import castToInt from '../../lib/int.mjs';
import parseServiceIdentifier from '../../lib/service-identifier.mjs';
import parseUri from '../../lib/uri.mjs';

const decimalPattern = /^[0-9]+$/;

/**
 * Represents an FM bearer with Radio Data System (RDS) support
 */
export default class FMBearer extends AbstractECCBearer {
  static scheme = 'fm';

  /**
   * @param {(number|string)} country - either ECC, GCC or ISO country code
   * @param {(number|string)} pi - RDS programme identifier
   * @param {(number|string)} frequency - broadcast frequency in MHz
   */
  constructor(country, pi, frequency = null) {
    super();

    this.ecc = parseCountry(country, { pi });
    this.pi = pi;
    this.frequency = frequency;
  }

  static fromParams([gcc, pi, frequencyString]) {
    if (gcc.length !== 3 || !isHex(gcc)) {
      throw new ValidationError('gcc URI parameter must be 3 digit hexadecimal number', gcc);
    }
    if (pi.length !== 4 || !isHex(pi)) {
      throw new ValidationError('pi URI parameter must be 4 digit hexadecimal number', pi);
    }
    if (frequencyString !== '*' && (frequencyString.length !== 5 || !decimalPattern.test(frequencyString))) {
      throw new ValidationError('frequency URI parameter must be a 5 digit number with zero padding', frequencyString);
    }

    const frequency = frequencyString !== '*'
      ? Number.parseInt(frequencyString, 10) / 100.0
      : null;

    return new this(gcc, pi, frequency);
  }

  static fromUri(uri) {
    return this.fromParams(parseUri(uri, this.scheme, 3));
  }

  static fromFqdn(fqdn) {
    return this.fromParams(parseFqdn(fqdn, this.scheme, 3));
  }

  static fromServiceIdentifier(serviceIdentifier) {
    return this.fromParams(parseServiceIdentifier(serviceIdentifier, this.scheme, 3));
  }

  get gcc() {
    return ((this.pi & 0xf000) >> 4) | this.ecc;
  }

  /**
   * RDS Programme Idenitifer (PI)
   *
   * @type {number}
   */
  get pi() {
    return this._pi;
  }

  set pi(value) {
    let pi;
    try {
      pi = castToInt(value, 16);
      if (pi < 0x1000 || pi > 0xfffff) {
        throw new ValidationError('first nibble must be between 0x1 and 0xf');
      }
      if ((pi & 0xff) === 0 || (pi & 0xff) === 0xff) {
        throw new ValidationError('third and forth nibbles combined cannot be 0x00 or 0xff');
      }
    } catch (error) {
      const acceptableErrorCodes = ['ERR_INVALID_NUM', 'ERR_INVALID_PARAM'];
      if (!acceptableErrorCodes.includes(error.code)) {
        throw error;
      }
      throw new ValidationError(`invalid pi value: ${error.message}`, value);
    }

    this._pi = pi;
  }

  /**
   * Frequency (in MHz)
   *
   * @type {number}
   */
  get frequency() {
    return this._frequency;
  }

  set frequency(value) {
    let frequency;

    if (value === '*' || value === null) {
      frequency = null;
    } else {
      frequency = Number.parseFloat(value);
      if (Number.isNaN(frequency) || frequency < 76 || frequency > 108) {
        throw new ValidationError('frequency property must be a number between 76 and 108 (MHz)', value);
      }
    }

    this._frequency = frequency;
  }

  toParams() {
    return [
      this.gcc.toString(16),
      this.pi.toString(16),
      this.frequency !== null ? String(this.frequency * 100).padStart(5, '0') : '*',
    ];
  }

  toFqdn(options) {
    if (this.frequency === null) {
      throw new TypeError('cannot generate FQDN for FM bearer without frequency');
    }
    return super.toFqdn(options);
  }

  toServiceIdentifier() {
    if (this.frequency === null) {
      throw new TypeError('cannot generate service identifier for FM bearer without frequency');
    }
    return super.toServiceIdentifier();
  }
}
