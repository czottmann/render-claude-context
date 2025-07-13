const fs = require("fs");
const path = require("path");
const os = require("os");

function resolveImports(content, fileDir) {
  const importRegex = /@([^\s\n]+)/g;
  let result = content;
  const resolved = new Set(); // Prevent circular imports

  function processImports(text, currentDir) {
    return text.replace(importRegex, (match, importPath) => {
      let fullPath;

      // Handle tilde expansion for home directory
      if (importPath.startsWith("~/")) {
        fullPath = path.join(os.homedir(), importPath.slice(2));
      } else {
        fullPath = path.resolve(currentDir, importPath);
      }

      // Check if it's a valid file path and exists
      if (!fs.existsSync(fullPath) || resolved.has(fullPath)) {
        return match; // Keep original if file doesn't exist or already processed
      }

      try {
        resolved.add(fullPath);
        const importedContent = fs.readFileSync(fullPath, "utf8");
        const importedDir = path.dirname(fullPath);

        // Recursively process imports in the imported file
        return processImports(importedContent, importedDir);
      } catch (error) {
        return match; // Keep original if read fails
      }
    });
  }

  return processImports(result, fileDir);
}

module.exports = {
  resolveImports,
};