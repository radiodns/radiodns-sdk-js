import InvalidUriError from './error/InvalidUriError.mjs';

/**
 * Validates a URI based on scheme and number of components, and then returns
 * the params for further validation and usage
 *
 * @param {string} uri - the URI to be parsed
 * @param {string} expectedScheme - scheme to match
 * @param {(number|number[])} expectedNumComponents
 *   number of components to match, as either a number or an array of numbers if
 *   there are optional components
 * @returns {Array} params of the URI
 * @throws {InvalidUriError}
 */
export default function parseUri(uri, expectedScheme, expectedNumComponents) {
  const [scheme, path = ''] = uri.split(':');
  const params = path.split('.');

  const isExpectedLength = !Array.isArray(expectedNumComponents)
    ? params.length === expectedNumComponents
    : expectedNumComponents.includes(params.length);

  if (scheme !== expectedScheme || !isExpectedLength) {
    throw new InvalidUriError(uri);
  }

  return params;
}
