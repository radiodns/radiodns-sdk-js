import AbstractBearer from '../../lib/AbstractBearer.mjs';
import ValidationError from '../../lib/error/ValidationError.mjs';
import parseFqdn from '../../lib/fqdn.mjs';
import isHex from '../../lib/hex.mjs';
import castToInt from '../../lib/int.mjs';
import parseServiceIdentifier from '../../lib/service-identifier.mjs';
import parseUri from '../../lib/uri.mjs';

/**
 * Represents an Amplitude Modulation Signalling System (AMSS) bearer
 */
export default class AMSSBearer extends AbstractBearer {
  static scheme = 'amss';

  /**
   * @param {(number|string)} sid - the SId value for this bearer
   */
  constructor(sid) {
    super();

    this.sid = sid;
  }

  static fromParams([sid]) {
    if (sid.length !== 6 || !isHex(sid)) {
      throw new ValidationError('sid URI parameter must be 6 digit hexadecimal number', sid);
    }

    return new this(sid);
  }

  static fromUri(uri) {
    return this.fromParams(parseUri(uri, this.scheme, 1));
  }

  static fromFqdn(fqdn) {
    return this.fromParams(parseFqdn(fqdn, this.scheme, 1));
  }

  static fromServiceIdentifier(serviceIdentifier) {
    return this.fromParams(parseServiceIdentifier(serviceIdentifier, this.scheme, 1));
  }

  /**
   * Service identifier
   * @type {(number|string)}
   */
  get sid() {
    return this._sid;
  }

  set sid(value) {
    let sid;
    try {
      sid = castToInt(value, 16);
      if (sid < 0x0 || sid > 0xffffff) {
        throw new ValidationError('must be between 0x0 and 0xffffff');
      }
    } catch (error) {
      const acceptableErrorCodes = ['ERR_INVALID_NUM', 'ERR_INVALID_PARAM'];
      if (!acceptableErrorCodes.includes(error.code)) {
        throw error;
      }
      throw new ValidationError(`invalid sid value: ${error.message}`, value);
    }
    this._sid = sid;
  }

  toParams() {
    return [this.sid.toString(16).padStart(6, 0)];
  }
}
