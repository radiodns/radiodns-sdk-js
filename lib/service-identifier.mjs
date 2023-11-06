import InvalidServiceIdentifierError from './error/InvalidServiceIdentifierError.mjs';

/**
 * Validates a service identifier string based on scheme and number of
 * components, and then returns the params for further validation and usage
 *
 * @param {string} serviceIdentifier - the service identifier to be parsed
 * @param {string} expectedScheme - scheme to match
 * @param {(number|number[])} expectedNumComponents
 *   number of components to match, as either a number or an array of numbers if
 *   there are optional components
 * @returns {Array} params of the service identifier
 * @throws {InvalidServiceIdentifierError}
 */
export default function parseServiceIdentifier(
  serviceIdentifier,
  expectedScheme,
  expectedNumComponents,
) {
  const [scheme, ...params] = serviceIdentifier.split('/');

  const isExpectedLength = !Array.isArray(expectedNumComponents)
    ? params.length === expectedNumComponents
    : expectedNumComponents.includes(params.length);

  if (scheme !== expectedScheme || !isExpectedLength) {
    throw new InvalidServiceIdentifierError(serviceIdentifier);
  }

  return params;
}
