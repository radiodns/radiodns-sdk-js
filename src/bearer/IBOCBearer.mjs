import AbstractBearer from '../../lib/AbstractBearer.mjs';
import parseFqdn from '../../lib/fqdn.mjs';
import castToInt from '../../lib/int.mjs';
import parseServiceIdentifier from '../../lib/service-identifier.mjs';
import parseUri from '../../lib/uri.mjs';

/**
 * Represents an In-band on-channel (IBOC) bearer, such as HD Radio
 */
export default class IBOCBearer extends AbstractBearer {
  static scheme = 'hd';

  /**
   * @param {(number|string)} cc - country code
   * @param {(number|string)} tx - transmitter identifier
   * @param {(number|string)} mid -
   *   identifier for multicast supplemental program service (SPS) channel
   */
  constructor(cc, tx, mid = null) {
    super();

    this._scheme = 'hd';
    this.cc = cc;
    this.tx = tx;
    this.mid = mid;
  }

  static fromParams([cc, tx, mid = null]) {
    return new this(cc, tx, mid);
  }

  static fromUri(uri) {
    return this.fromParams(parseUri(uri, this.scheme, [2, 3]));
  }

  static fromFqdn(fqdn) {
    return this.fromParams(parseFqdn(fqdn, this.scheme, [2, 3]));
  }

  static fromServiceIdentifier(serviceIdentifier) {
    return this.fromParams(parseServiceIdentifier(serviceIdentifier, this.scheme, [2, 3]));
  }

  /**
   * Country Code
   *
   * @params {(number|string)}
   */
  get cc() {
    return this._cc;
  }

  set cc(value) {
    const cc = castToInt(value, 16);

    if (cc < 0x0 || cc > 0xfff) {
      throw new TypeError(`cc property must be a number between 0x0 and 0xfff. "${value}" was passed.`);
    }

    this._cc = cc;
  }

  /**
   * Transmitter Identifier
   *
   * @params {(number|string)}
   */
  get tx() {
    return this._tx;
  }

  set tx(value) {
    const tx = castToInt(value, 16);
    if (tx < 0x0 || tx > 0xfffff) {
      throw new TypeError(`tx property must be a number between 0x0 and 0xfffff. "${value}" was passed.`);
    }

    this._tx = tx;
  }

  /**
   * Identifier for multicast supplemental program service (SPS) channel
   *
   * @params {(number|string)}
   */
  get mid() {
    return this._mid;
  }

  set mid(value) {
    let mid;

    if (value === null) {
      mid = null;
    } else {
      mid = castToInt(value, 16);
      if (mid < 0x0 || mid > 0xf) {
        throw new TypeError(`mid property must be a number between 0x0 and 0xf. "${value}" was passed.`);
      }
    }

    this._mid = mid;
  }

  toParams() {
    return [
      this.cc.toString(16),
      this.tx.toString(16).padStart(5, 0),
      ...this.mid !== null ? [this.mid] : [],
    ];
  }
}
