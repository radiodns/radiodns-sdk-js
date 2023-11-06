import dns from 'node:dns/promises';

import AMSSBearer from './bearer/AMSSBearer.mjs';
import Bearer from './bearer/Bearer.mjs';
import DABBearer from './bearer/DABBearer.mjs';
import DRMBearer from './bearer/DRMBearer.mjs';
import FMBearer from './bearer/FMBearer.mjs';
import IBOCBearer from './bearer/IBOCBearer.mjs';

/**
 * @typedef {Object} BearerParams
 * @property {('amss'|'dab'|'drm'|'fm'|'iboc'))} platform
 *   which platform the remaining properties relate to
 * @property {(string|number)} [sid] - required for AMSS, DAB or DRM
 * @property {(string|number)} [ecc] - required for DAB and FM if no gcc property
 * @property {(string|number)} [gcc] - required for DAB and FM if no ecc property
 * @property {(string|number)} [eid] - required for DAB
 * @property {(string|number)} [sid] - required for DAB
 * @property {(string|number)} [scids] - required for DAB
 * @property {(string|number)} [uatype] - optional for DAB
 * @property {(string|number)} [appdomain] - optional for DAB
 * @property {(string|number)} [pi] - required for FM
 * @property {(string|number)} [frequency] - required for FM
 * @property {(string|number)} [cc] - required for IBOC
 * @property {(string|number)} [tx] - required for IBOC
 * @property {(string|number)} [mid] - required for IBOC
 */

/**
 * Resolves a Bearer to an Authoratitive Fully Qualified Domain Name (FQDN)
 *
 * @param {string|AMSSBearer|DABBearer|DRMBearer|FMBearer|IBOCBearer|BearerParams} bearer
 *   either a URI string, Bearer object or object literal with required properties
 * @returns {string|undefined} authoratitive FQDN
 */
export default async function resolveBearer(bearer) {
  // generate the FQDN to lookup
  let fqdn;
  if (typeof bearer.toFqdn === 'function') {
    fqdn = bearer.toFqdn();
  } else if (typeof bearer === 'string') {
    fqdn = Bearer.fromUri(bearer).toFqdn();
  } else {
    switch (bearer.platform) {
      case 'amss': {
        fqdn = (new AMSSBearer(bearer.sid)).toFqdn();
        break;
      }
      case 'dab': {
        fqdn = (new DABBearer(
          bearer.ecc || bearer.gcc || bearer.country,
          bearer.eid,
          bearer.sid,
          bearer.scids,
          bearer.uatype,
        )).toFqdn();
        break;
      }
      case 'drm': {
        fqdn = (new DRMBearer(bearer.sid, bearer.appdomain, bearer.uatype)).toFqdn();
        break;
      }
      case 'fm': {
        fqdn = (new FMBearer(
          bearer.ecc || bearer.gcc || bearer.country,
          bearer.pi,
          bearer.frequency,
        )).toFqdn();
        break;
      }
      case 'hd': {
        fqdn = (new IBOCBearer(bearer.cc, bearer.tx, bearer.mid)).toFqdn();
        break;
      }
      default: {
        throw new TypeError('bearer argument must be a URI string, Bearer instance or parameter object');
      }
    }
  }
  // resolve the FQDN to an authoritative FQDN
  let authFqdn;
  try {
    [authFqdn] = await dns.resolveCname(fqdn);
  } catch (error) {
    if (error.code !== 'ENOTFOUND') {
      throw error;
    }
    return undefined;
  }
  return authFqdn;
}
