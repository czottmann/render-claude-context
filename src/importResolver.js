/**
 * @fileoverview Import resolution module for processing @path import statements.
 * Recursively resolves @path imports with tilde expansion and circular dependency protection.
 */

const fs = require("fs");
const path = require("path");
const os = require("os");

/**
 * Resolves @path import statements in content by replacing them with the actual file contents.
 * Supports tilde expansion (~/) and recursive import resolution with circular dependency protection.
 * 
 * @param {string} content - Text content containing @path import statements
 * @param {string} fileDir - Directory path of the file containing the imports (for relative path resolution)
 * @returns {string} Content with all valid @path imports replaced by their file contents
 * 
 * @example
 * // Input content: "Some text @~/config/settings.md more text"
 * // Returns: "Some text [contents of ~/config/settings.md] more text"
 * const resolved = resolveImports(content, '/path/to/current/dir');
 */
function resolveImports(content, fileDir) {
  const importRegex = /@([^\s\n]+)/g;
  let result = content;
  const resolved = new Set(); // Prevent circular imports

  /**
   * Internal helper function that recursively processes imports in text content.
   * Handles tilde expansion, relative path resolution, and circular dependency detection.
   * 
   * @param {string} text - Text content to process
   * @param {string} currentDir - Current directory for resolving relative paths
   * @returns {string} Text with imports resolved
   */
  function processImports(text, currentDir) {
    return text.replace(importRegex, (match, importPath) => {
      let fullPath;

      // Handle tilde expansion for home directory (~/)
      if (importPath.startsWith("~/")) {
        fullPath = path.join(os.homedir(), importPath.slice(2));
      } else {
        // Resolve relative paths against current directory
        fullPath = path.resolve(currentDir, importPath);
      }

      // Skip if file doesn't exist or already processed (circular import protection)
      if (!fs.existsSync(fullPath) || resolved.has(fullPath)) {
        return match; // Keep original @path if file doesn't exist or already processed
      }

      try {
        resolved.add(fullPath);
        const importedContent = fs.readFileSync(fullPath, "utf8");
        const importedDir = path.dirname(fullPath);

        // Recursively process imports in the imported file
        return processImports(importedContent, importedDir);
      } catch (error) {
        return match; // Keep original @path if read fails
      }
    });
  }

  return processImports(result, fileDir);
}

module.exports = {
  resolveImports,
};
