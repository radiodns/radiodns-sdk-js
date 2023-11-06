/**
 * Provides a set of valid bearer params for each scheme for unit tests.
 */

export const fm = [
  {
    uri: 'fm:ce1.c586.09580',
    fqdn: '09580.c586.ce1.fm.radiodns.org',
    serviceIdentifier: 'fm/ce1/c586/09580',
    params: {
      gcc: 0xce1,
      ecc: 0xe1,
      pi: 0xc586,
      frequency: 95.8,
    },
  },
  {
    uri: 'fm:ce1.c201.*',
    params: {
      gcc: 0xce1,
      ecc: 0xe1,
      pi: 0xc201,
      frequency: null,
    },
  },
];

export const dab = [
  {
    uri: 'dab:ce1.c185.e1c00098.0.004',
    fqdn: '004.0.e1c00098.c185.ce1.dab.radiodns.org',
    serviceIdentifier: 'dab/ce1/c185/e1c00098/0/004',
    params: {
      gcc: 0xce1,
      ecc: 0xe1,
      eid: 0xc185,
      sid: 0xe1c00098,
      scids: 0x0,
      uatype: 0x4,
    },
  },
  {
    uri: 'dab:de0.100c.d220.0',
    fqdn: '0.d220.100c.de0.dab.radiodns.org',
    serviceIdentifier: 'dab/de0/100c/d220/0',
    params: {
      gcc: 0xde0,
      ecc: 0xe0,
      eid: 0x100c,
      sid: 0xd220,
      scids: 0x0,
      uatype: null,
    },
  },
];

export const drm = [
  {
    uri: 'drm:f07256.1.00d',
    fqdn: '00d.1.f07256.drm.radiodns.org',
    serviceIdentifier: 'drm/f07256/1/00d',
    params: {
      sid: 0xf07256,
      appdomain: 0x1,
      uatype: 0x00d,
    },
  },
  {
    uri: 'drm:e1c238',
    fqdn: 'e1c238.drm.radiodns.org',
    serviceIdentifier: 'drm/e1c238',
    params: {
      sid: 0xe1c238,
      appdomain: null,
      uatype: null,
    },
  },
  {
    uri: 'drm:a13002',
    fqdn: 'a13002.drm.radiodns.org',
    serviceIdentifier: 'drm/a13002',
    params: {
      sid: 0xa13002,
      appdomain: null,
      uatype: null,
    },
  },
];

export const amss = [
  {
    uri: 'amss:e1c238',
    fqdn: 'e1c238.amss.radiodns.org',
    serviceIdentifier: 'amss/e1c238',
    params: {
      sid: 0xe1c238,
    },
  },
];

export const iboc = [
  {
    uri: 'hd:292.07a26.2',
    fqdn: '2.07a26.292.hd.radiodns.org',
    serviceIdentifier: 'hd/292/07a26/2',
    params: {
      cc: 0x292,
      tx: 0x07a26,
      mid: 0x2,
    },
  },
  {
    uri: 'hd:292.07a26',
    fqdn: '07a26.292.hd.radiodns.org',
    serviceIdentifier: 'hd/292/07a26',
    params: {
      cc: 0x292,
      tx: 0x07a26,
      mid: null,
    },
  },
];

// concatenate all valid bearers for easy iteration
export default [...fm, ...dab, ...drm, ...amss, ...iboc];
