// @ts-check

/**
 * @param {unknown} value
 * @param {string | (() => string)} [message]
 * @returns {asserts value}
 */
export function assert(value, message) {
  if (!value) {
    throw new Error(
      typeof message === "function" ? message() : message ?? "Assertion failed"
    );
  }
}
