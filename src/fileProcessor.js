/**
 * @fileoverview File processing module for generating context content from CLAUDE.md files.
 * Handles file processing, content generation, and output management with multiple output modes.
 */

const fs = require("fs");
const path = require("path");
const os = require("os");
const { collectClaudeFiles } = require("./fileCollector");
const { resolveImports } = require("./importResolver");

/**
 * Processes an array of CLAUDE.md file paths, reading and resolving imports for each.
 * 
 * @param {string[]} files - Array of absolute file paths to CLAUDE.md files
 * @returns {Array<{content: string, path: string}>} Array of processed file objects
 */
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

/**
 * Generates complete context content by collecting and processing CLAUDE.md files.
 * Files are processed in reverse order with HTML comment separators.
 * 
 * @param {string} [startDir=process.cwd()] - Starting directory for file collection
 * @returns {string} Complete context content with resolved imports and HTML separators
 */
function generateContextContent(startDir = process.cwd()) {
  const homeDir = os.homedir();
  const claudeFiles = collectClaudeFiles(startDir, homeDir);
  const processedContents = processFiles(claudeFiles);

  // Generate content in reverse order with HTML comment separators
  const reversedContents = processedContents.reverse();
  let output = "";

  for (let i = 0; i < reversedContents.length; i++) {
    const { content, path: filePath } = reversedContents[i];

    // Add HTML comment with file path before content (except for first file)
    if (i > 0) {
      output += `\n\n<!-- ${filePath} -->\n\n`;
    }

    output += content;
  }

  return output;
}

/**
 * Generates context content for a single CLAUDE.md file with import resolution.
 * 
 * @param {string} claudeFile - Absolute path to CLAUDE.md file
 * @returns {string} File content with all imports resolved
 */
function generateContextContentForFile(claudeFile) {
  const fileDir = path.dirname(claudeFile);
  const content = fs.readFileSync(claudeFile, "utf8");
  return resolveImports(content, fileDir);
}

/**
 * Writes content to a file, creating directories as needed.
 * 
 * @param {string} content - Content to write to file
 * @param {string} outputPath - Absolute path where file should be written
 */
function writeToFile(content, outputPath) {
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(outputPath, content, "utf8");
}

/**
 * Determines output file path based on output folder mode.
 * 
 * @param {string} outputFolder - Output mode: "global", "project", or "origin"
 * @param {string} filename - Output filename
 * @param {string} [startDir=process.cwd()] - Starting directory for project mode
 * @param {string} [globalFolder="~/.gemini/"] - Global folder for global mode
 * @returns {string|null} Absolute output path, or null for origin mode
 * @throws {Error} If outputFolder mode is unknown
 */
function getOutputPath(outputFolder, filename, startDir = process.cwd(), globalFolder = "~/.gemini/") {
  const homeDir = os.homedir();
  
  // Handle tilde expansion for globalFolder
  const expandedGlobalFolder = globalFolder.startsWith("~/") 
    ? path.join(homeDir, globalFolder.slice(2))
    : globalFolder;

  switch (outputFolder) {
    case "global":
      return path.join(expandedGlobalFolder, filename);
    case "project":
      return path.join(startDir, filename);
    case "origin":
      // For origin mode, we'll handle multiple files differently
      return null;
    default:
      throw new Error(`Unknown output folder mode: ${outputFolder}`);
  }
}

/**
 * Handles origin mode output by creating individual files next to each CLAUDE.md.
 * Special case: ~/.claude/CLAUDE.md outputs to configured global folder instead.
 * 
 * @param {string} filename - Output filename to use
 * @param {string} [startDir=process.cwd()] - Starting directory for file collection
 * @param {string} [globalFolder="~/.gemini/"] - Global folder for special handling
 * @returns {string[]} Array of created file paths
 */
function handleOriginMode(filename, startDir = process.cwd(), globalFolder = "~/.gemini/") {
  const homeDir = os.homedir();
  const claudeFiles = collectClaudeFiles(startDir, homeDir);
  const filesCreated = [];
  
  // Handle tilde expansion for globalFolder
  const expandedGlobalFolder = globalFolder.startsWith("~/") 
    ? path.join(homeDir, globalFolder.slice(2))
    : globalFolder;

  claudeFiles.forEach((claudeFile) => {
    const fileDir = path.dirname(claudeFile);
    const content = generateContextContentForFile(claudeFile);

    // Special case: if the CLAUDE.md file is in ~/.claude/, put output in configured global folder
    let outputPath;
    const claudePath = path.join(homeDir, ".claude", "CLAUDE.md");
    if (claudeFile === claudePath) {
      outputPath = path.join(expandedGlobalFolder, filename);
    } else {
      outputPath = path.join(fileDir, filename);
    }

    writeToFile(content, outputPath);
    filesCreated.push(outputPath);
  });

  return filesCreated;
}

module.exports = {
  processFiles,
  generateContextContent,
  generateContextContentForFile,
  writeToFile,
  getOutputPath,
  handleOriginMode,
};
