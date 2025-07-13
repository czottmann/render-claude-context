/**
 * @fileoverview Create command implementation for generating context files.
 * Handles creating context files with resolved imports in different output modes.
 */

const {
  generateContextContent,
  getOutputPath,
  writeToFile,
  handleOriginMode,
} = require("../fileProcessor");

/**
 * Creates context files from CLAUDE.md hierarchy with import resolution.
 * Supports multiple output modes: origin (individual files), global, and project.
 * 
 * @param {Object} options - Command options from Commander.js
 * @param {string} options.outputFolder - Output mode: "origin", "global", or "project"
 * @param {string} options.filename - Output filename to use
 */
function createCommand(options) {
  try {
    if (options.outputFolder === "origin") {
      const filesCreated = handleOriginMode(options.filename);
      console.log(`Created ${filesCreated.length} context file(s):`);
      filesCreated.forEach((file) => console.log(`  ${file}`));
    } else {
      const content = generateContextContent();
      const outputPath = getOutputPath(options.outputFolder, options.filename);
      writeToFile(content, outputPath);
      console.log(`Created 1 context file(s):`);
      console.log(`  ${outputPath}`);
    }
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

module.exports = createCommand;
