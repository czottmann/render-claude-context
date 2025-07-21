/**
 * @fileoverview Cleanup command implementation for removing generated files.
 * Deletes context files from filesystem based on output mode and filename.
 */

const fs = require("fs");
const path = require("path");
const os = require("os");
const { collectClaudeFiles } = require("../fileCollector");
const { getOutputPath } = require("../fileProcessor");

/**
 * Deletes generated context files from filesystem based on output mode.
 * Supports all output modes: origin (individual files), global, and project.
 * 
 * @param {Object} options - Command options from Commander.js
 * @param {string} options.outputFolder - Output mode: "origin", "global", or "project"
 * @param {string} options.filename - Filename pattern to delete
 * @param {string} options.globalFolder - Global folder for global output and special handling
 */
function cleanupCommand(options) {
  try {
    let filesRemoved = [];

    if (options.outputFolder === "origin") {
      // Remove files in origin mode (next to each CLAUDE.md, with special ~/.claude/ case)
      const homeDir = os.homedir();
      const claudeFiles = collectClaudeFiles(process.cwd(), homeDir);
      
      // Handle tilde expansion for globalFolder
      const expandedGlobalFolder = options.globalFolder.startsWith("~/") 
        ? path.join(homeDir, options.globalFolder.slice(2))
        : options.globalFolder;

      claudeFiles.forEach((claudeFile) => {
        // Special case: if the CLAUDE.md file is in ~/.claude/, the output is in configured global folder
        let outputPath;
        const claudePath = path.join(homeDir, ".claude", "CLAUDE.md");
        if (claudeFile === claudePath) {
          outputPath = path.join(expandedGlobalFolder, options.filename);
        } else {
          const fileDir = path.dirname(claudeFile);
          outputPath = path.join(fileDir, options.filename);
        }

        if (fs.existsSync(outputPath)) {
          fs.unlinkSync(outputPath);
          filesRemoved.push(outputPath);
        }
      });
    } else {
      // Remove file based on specified output folder mode
      const outputPath = getOutputPath(options.outputFolder, options.filename, process.cwd(), options.globalFolder);
      if (fs.existsSync(outputPath)) {
        fs.unlinkSync(outputPath);
        filesRemoved.push(outputPath);
      }
    }

    if (filesRemoved.length > 0) {
      console.log(`Removed ${filesRemoved.length} context file(s):`);
      filesRemoved.forEach((file) => console.log(`  ${file}`));
    } else {
      console.log("No context files found to remove");
    }
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

module.exports = cleanupCommand;
