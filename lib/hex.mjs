const hexPattern = /^[0-9A-Fa-f]+$/;
const hexPatternWithPrefix = /^(0x|)[0-9A-Fa-f]+$/;

/**
 * Evaluates if the supplied value is a hexadecimal string.
 */
export default (value, options = {}) => (options.allowPrefix !== true
  ? hexPattern.test(value)
  : hexPatternWithPrefix.test(value));
