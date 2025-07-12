#!/usr/bin/env node

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

function processFiles(files) {
  const processedContents = [];

  for (const file of files) {
    try {
      const content = fs.readFileSync(file, "utf8");
      const fileDir = path.dirname(file);
      const processedContent = resolveImports(content, fileDir);
      processedContents.push({ content: processedContent, path: file });
    } catch (error) {
      // Skip files that can't be read
      continue;
    }
  }

  return processedContents;
}

function main() {
  const startDir = process.cwd();
  const homeDir = os.homedir();

  const claudeFiles = collectClaudeFiles(startDir, homeDir);
  const processedContents = processFiles(claudeFiles);

  // Output in reverse order with HTML comment separators
  const reversedContents = processedContents.reverse();

  for (let i = 0; i < reversedContents.length; i++) {
    const { content, path: filePath } = reversedContents[i];

    // Add HTML comment with file path before content (except for first file)
    if (i > 0) {
      process.stdout.write(`\n\n<!-- ${filePath} -->\n\n`);
    }

    process.stdout.write(content);
  }
}

if (require.main === module) {
  main();
}

module.exports = { collectClaudeFiles, resolveImports, processFiles };
