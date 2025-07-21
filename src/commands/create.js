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
const { getTargetGlobalFolder } = require("../utils/targets");

/**
 * Creates context files from CLAUDE.md hierarchy with import resolution.
 * Supports multiple output modes: origin (individual files), global, and project.
 * 
 * @param {Object} options - Command options from Commander.js
 * @param {string} options.outputFolder - Output mode: "origin", "global", or "project"
 * @param {string} options.filename - Output filename to use
 * @param {string} [options.globalFolder] - Global folder for global output and special handling
 * @param {string} [options.target] - Target AI tool name (sets globalFolder automatically)
 * @param {boolean} [options.noAddCommands] - Skip appending commands from ~/.claude/commands/
 */
function createCommand(options) {
  try {
    // Validate mutual exclusion of --target and --global-folder
    if (options.target && options.globalFolder !== "~/.gemini/") {
      console.error("Error: --target and --global-folder options are mutually exclusive");
      process.exit(1);
    }

    // Determine the global folder to use
    const globalFolder = options.target 
      ? getTargetGlobalFolder(options.target)
      : options.globalFolder;

    // Determine whether to add commands (default true, disabled with --no-add-commands)
    const addCommands = !options.noAddCommands;

    if (options.outputFolder === "origin") {
      const filesCreated = handleOriginMode(options.filename, process.cwd(), globalFolder, addCommands);
      console.log(`Created ${filesCreated.length} context file(s):`);
      filesCreated.forEach((file) => console.log(`  ${file}`));
    } else {
      const content = generateContextContent(process.cwd(), addCommands);
      const outputPath = getOutputPath(options.outputFolder, options.filename, process.cwd(), globalFolder);
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
