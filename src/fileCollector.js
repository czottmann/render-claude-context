const fs = require("fs");
const path = require("path");
const os = require("os");

function collectClaudeFiles(startDir, homeDir) {
  const files = [];
  let currentDir = startDir;

  while (currentDir !== path.dirname(currentDir)) {
    const claudeFile = path.join(currentDir, "CLAUDE.md");
    if (fs.existsSync(claudeFile)) {
      files.push(claudeFile);
    }

    if (currentDir === homeDir) {
      break;
    }
    currentDir = path.dirname(currentDir);
  }

  // Add ~/.claude/CLAUDE.md if it exists
  const globalClaudeFile = path.join(homeDir, ".claude", "CLAUDE.md");
  if (fs.existsSync(globalClaudeFile)) {
    files.push(globalClaudeFile);
  }

  return files;
}

module.exports = {
  collectClaudeFiles,
};