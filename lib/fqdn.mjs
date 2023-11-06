import InvalidFqdnError from './error/InvalidFqdnError.mjs';

const fqdnPattern = /^(?<components>(?:.+?\.)+)(?<scheme>amss|dab|drm|fm|hd)(?:|(\..+?)+$)/;

/**
 * Validates a FQDN based on scheme and number of components, and then returns
 * the params for further validation and usage
 *
 * @param {string} fqdn - the FQDN to be parsed
 * @param {string} expectedScheme - scheme to match
 * @param {(number|number[])} expectedNumComponents
 *   number of components to match, as either a number or an array of numbers
 *   if there are optional components
 * @returns {Array} params of the FQDN
 * @throws {InvalidFqdnError}
 */
export default function parseFqdn(fqdn, expectedScheme, expectedNumComponents) {
  const match = fqdn.match(fqdnPattern);
  const { scheme, components = '' } = match?.groups || {};
  const params = components.split('.').reverse().slice(1);

  const isExpectedLength = !Array.isArray(expectedNumComponents)
    ? params.length === expectedNumComponents
    : expectedNumComponents.includes(params.length);

  if (scheme !== expectedScheme || !isExpectedLength) {
    throw new InvalidFqdnError(fqdn);
  }

  return params;
}
