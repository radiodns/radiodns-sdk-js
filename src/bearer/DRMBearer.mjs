import AbstractBearer from '../../lib/AbstractBearer.mjs';
import ValidationError from '../../lib/error/ValidationError.mjs';
import parseFqdn from '../../lib/fqdn.mjs';
import isHex from '../../lib/hex.mjs';
import castToInt from '../../lib/int.mjs';
import parseServiceIdentifier from '../../lib/service-identifier.mjs';
import parseUri from '../../lib/uri.mjs';

/**
 * Represents a Digital Radio Mondiale (DRM) bearer
 */
export default class DRMBearer extends AbstractBearer {
  static scheme = 'drm';

  /**
   * @param {(number|string)} sid - service identifier
   * @param {(number|string)} appdomain -
   *   application domain of the data component
   * @param {(number|string)} uatype -
   *   user application type of the data component
   */
  constructor(sid, appdomain = null, uatype = null) {
    super();

    this.sid = sid;
    this.appdomain = appdomain;
    this.uatype = uatype;
  }

  static fromParams([sid, appdomain, uatype]) {
    if (sid.length !== 6 || !isHex(sid)) {
      throw new ValidationError('sid URI parameter must be 6 digit hexadecimal number', sid);
    }
    if (appdomain !== undefined && (appdomain.length !== 1 || !isHex(appdomain))) {
      throw new ValidationError('appdomain URI parameter must be 1 digit hexadecimal number', appdomain);
    }
    if (uatype !== undefined && (uatype.length !== 3 || !isHex(uatype))) {
      throw new ValidationError('uatype URI parameter must be 3 digit hexadecimal number', uatype);
    }

    return new this(sid, appdomain, uatype);
  }

  static fromUri(uri) {
    return this.fromParams(parseUri(uri, this.scheme, [1, 3]));
  }

  static fromFqdn(fqdn) {
    return this.fromParams(parseFqdn(fqdn, this.scheme, [1, 3]));
  }

  static fromServiceIdentifier(serviceIdentifier) {
    return this.fromParams(parseServiceIdentifier(serviceIdentifier, this.scheme, [1, 3]));
  }

  /**
   * Service Identifier (SId)
   */
  get sid() {
    return this._sid;
  }

  set sid(value) {
    const sid = castToInt(value, 16);
    if (sid < 0x0 || sid > 0xffffff) {
      throw new ValidationError('sid property must be a number between 0x0 and 0xffffff', sid);
    }

    this._sid = sid;
  }

  /**
   * Application Domain of the data component
   */
  get appdomain() {
    return this._appdomain;
  }

  set appdomain(value) {
    let appdomain = null;

    if (value !== null) {
      appdomain = castToInt(value, 16);
      if (appdomain < 0x0 || appdomain > 0xf) {
        throw new ValidationError('appdomain property must be a number between 0x0 and 0xf', value);
      }
    }

    this._appdomain = appdomain;
  }

  /**
   * User Application Type of the data component
   */
  get uatype() {
    return this._uatype;
  }

  set uatype(value) {
    let uatype = null;

    if (value !== null) {
      uatype = castToInt(value, 16);
      if (uatype < 0x0 || uatype > 0xfff) {
        throw new ValidationError('uatype property must be a number between 0x0 and 0xfff', value);
      }
    }

    this._uatype = uatype;
  }

  toParams() {
    return [
      this.sid.toString(16),
      ...this.appdomain !== null
        ? [this.appdomain.toString(16), this.uatype.toString(16).padStart(3, 0)]
        : [],
    ];
  }
}
