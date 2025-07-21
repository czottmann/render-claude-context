/**
 * @fileoverview Target validation utility for Commander.js options.
 * Provides validation function for --target option values.
 */

const { isValidTarget, getAvailableTargets } = require("./targets");

/**
 * Validates target name for Commander.js option validation.
 * Exits process with error if target is invalid.
 * 
 * @param {string} target - Target name to validate
 * @returns {string} The valid target name
 */
function validateTarget(target) {
  if (!isValidTarget(target)) {
    const availableTargets = getAvailableTargets().join(", ");
    console.error(`Error: Unknown target '${target}'. Available targets: ${availableTargets}`);
    process.exit(1);
  }
  return target;
}

module.exports = { validateTarget };