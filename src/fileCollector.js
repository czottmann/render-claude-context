/**
 * @fileoverview File collection module for discovering CLAUDE.md files in directory hierarchy.
 * Walks up from current directory to home directory collecting all CLAUDE.md files.
 */

const fs = require("fs");
const path = require("path");
const os = require("os");

/**
 * Collects CLAUDE.md files from directory hierarchy starting from a given directory
 * and walking up to the home directory. Also includes ~/.claude/CLAUDE.md if it exists.
 * 
 * @param {string} startDir - Starting directory path (typically process.cwd())
 * @param {string} homeDir - Home directory path (typically os.homedir())
 * @returns {string[]} Array of absolute file paths to CLAUDE.md files found
 * 
 * @example
 * const { collectClaudeFiles } = require('./fileCollector');
 * const files = collectClaudeFiles(process.cwd(), os.homedir());
 * // Returns: ['/path/to/project/CLAUDE.md', '/Users/user/.claude/CLAUDE.md']
 */
function collectClaudeFiles(startDir, homeDir) {
  const files = [];
  let currentDir = startDir;

  // Walk up directory tree from startDir to root
  while (currentDir !== path.dirname(currentDir)) {
    const claudeFile = path.join(currentDir, "CLAUDE.md");
    if (fs.existsSync(claudeFile)) {
      files.push(claudeFile);
    }

    // Stop when we reach the home directory
    if (currentDir === homeDir) {
      break;
    }
    currentDir = path.dirname(currentDir);
  }

  // Add global CLAUDE.md from ~/.claude/ if it exists
  const globalClaudeFile = path.join(homeDir, ".claude", "CLAUDE.md");
  if (fs.existsSync(globalClaudeFile)) {
    files.push(globalClaudeFile);
  }

  return files;
}

module.exports = {
  collectClaudeFiles,
};
