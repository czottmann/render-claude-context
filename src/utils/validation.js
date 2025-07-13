/**
 * @fileoverview Input validation utilities for CLI options.
 * Provides validation functions for filename and other CLI parameter validation.
 */

/**
 * Validates filename input to prevent overwriting source CLAUDE.md files.
 * Used as a Commander.js option parser to validate --filename arguments.
 * 
 * @param {string} filename - Filename to validate
 * @returns {string} The validated filename if valid
 * @throws {SystemExit} Exits process with error message if filename is invalid
 * 
 * @example
 * // In Commander.js option definition:
 * .option("--filename <name>", "Output filename", validateFilename, "CLAUDE-derived.md")
 */
function validateFilename(filename) {
  if (filename === "CLAUDE.md") {
    console.error("Error: Cannot use 'CLAUDE.md' as output filename");
    process.exit(1);
  }
  return filename;
}

module.exports = {
  validateFilename,
};
