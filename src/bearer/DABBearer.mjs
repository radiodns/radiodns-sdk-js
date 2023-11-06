/* eslint-disable no-bitwise */
import AbstractECCBearer from '../../lib/AbstractECCBearer.mjs';
import parseCountry from '../../lib/country.mjs';
import ValidationError from '../../lib/error/ValidationError.mjs';
import parseFqdn from '../../lib/fqdn.mjs';
import isHex from '../../lib/hex.mjs';
import castToInt from '../../lib/int.mjs';
import parseServiceIdentifier from '../../lib/service-identifier.mjs';
import parseUri from '../../lib/uri.mjs';

/**
 * Represents a Digital Audio Broadcasting (DAB) bearer
 */
export default class DABBearer extends AbstractECCBearer {
  static scheme = 'dab';

  /**
   * @param {(number|string)} country - either ECC, GCC or ISO country code
   * @param {(number|string)} eid - ensemble identifier
   * @param {(number|string)} sid - service identifier
   * @param {(number|string)} scids
   *   service component identifier within the service
   * @param {(number|string)} uatype
   *   user application type of the data component
   */
  constructor(country, eid, sid, scids, uatype = null) {
    super();

    this.ecc = parseCountry(country, { sid });
    this.eid = eid;
    this.sid = sid;
    this.scids = scids;
    this.uatype = uatype;
  }

  static fromParams([gcc, eid, sid, scids, uatype]) {
    if (gcc.length !== 3 || !isHex(gcc)) {
      throw new ValidationError('gcc URI parameter must be a 3 digit hexadecimal number', gcc);
    }
    if (eid.length !== 4 || !isHex(gcc)) {
      throw new ValidationError('eid URI parameter must be a 4 digit hexadecimal number', eid);
    }
    if ((sid.length !== 4 && sid.length !== 8) || !isHex(gcc)) {
      throw new ValidationError('sid URI parameter must be a 4 or 8 digit hexadecimal number', sid);
    }
    if (scids.length !== 1 || !isHex(gcc)) {
      throw new ValidationError('scids URI parameter must be a 1 digit hexadecimal number', scids);
    }
    if (uatype !== undefined && (uatype.length !== 3 || !isHex(gcc))) {
      throw new ValidationError('uatype URI parameter must be a 3 digit hexadecimal number', uatype);
    }

    return new this(gcc, eid, sid, scids, uatype);
  }

  static fromUri(uri) {
    return this.fromParams(parseUri(uri, this.scheme, [4, 5]));
  }

  static fromFqdn(fqdn) {
    return this.fromParams(parseFqdn(fqdn, this.scheme, [4, 5]));
  }

  static fromServiceIdentifier(serviceIdentifier) {
    return this.fromParams(parseServiceIdentifier(serviceIdentifier, this.scheme, [4, 5]));
  }

  get gcc() {
    return ((this.sid >= 0x10000000 ? this.sid >>> 12 : this.sid >>> 4) & 0xf00) | this.ecc;
  }

  /**
   * Ensemble Identifier (EId)
   */
  get eid() {
    return this._eid;
  }

  set eid(value) {
    const eid = castToInt(value, 16);

    if (eid < 0x1000 || eid > 0xfffe) {
      throw new ValidationError('eid property must be a number between 0x1000 and 0xfffe', eid);
    }

    this._eid = eid;
  }

  /**
   * Service Identifier (SId)
   */
  get sid() {
    return this._sid;
  }

  set sid(value) {
    const sid = castToInt(value, 16);

    if (sid < 0x1000 || (sid > 0xffff && sid < 0xa0a00000) || sid > 0xf9ffffff) {
      throw new ValidationError('sid property must be a number between 0x1000 and 0xffff or 0xa0a00000 and 0xf9ffffff', sid);
    }
    if (sid >= 0xa0a00000 && this.ecc !== undefined && ((sid >> 24) & 0xff) !== this.ecc) {
      throw new ValidationError('first two nibbles of 8-digit sid property must match ecc property', sid);
    }

    this._sid = sid;
  }

  /**
   * Service Component Identifier within the Service (SCIdS)
   */
  get scids() {
    return this._scids;
  }

  set scids(value) {
    const scids = castToInt(value, 16);
    if (scids < 0x0 || scids > 0xf) {
      throw new ValidationError('scids property must be a number between 0x0 and 0xf', scids);
    }

    this._scids = scids;
  }

  /**
   * User Application Type (UAtype) of the data component
   */
  get uatype() {
    return this._uatype;
  }

  set uatype(value) {
    let uatype;

    if (value === null) {
      uatype = null;
    } else {
      uatype = castToInt(value);
      if (uatype < 0x0 || uatype > 0xfff) {
        throw new TypeError(`uatype property must be a number between 0x100 and 0xfff. "${value}" was passed.`);
      }
    }

    this._uatype = uatype;
  }

  toParams() {
    return [
      this.gcc.toString(16),
      this.eid.toString(16),
      this.sid.toString(16),
      this.scids.toString(16),
      ...this.uatype !== null
        ? [this.uatype.toString(16).padStart(3, 0)]
        : [],
    ];
  }
}
