/**
 * @fileoverview File processing module for generating context content from CLAUDE.md files.
 * Handles file processing, content generation, and output management with multiple output modes.
 */

const fs = require("fs");
const path = require("path");
const os = require("os");
const { collectClaudeFiles } = require("./fileCollector");
const { resolveImports, stripFrontMatter } = require("./importResolver");

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
 * Collects and processes command files from ~/.claude/commands/ directory.
 * Handles symlinks and processes files like regular imports.
 * 
 * @returns {string|null} Processed commands content or null if directory doesn't exist
 */
function collectCommands() {
  const homeDir = os.homedir();
  const commandsDir = path.join(homeDir, ".claude", "commands");
  
  try {
    // Check if commands directory exists (could be symlink)
    if (!fs.existsSync(commandsDir)) {
      return null;
    }
    
    const stats = fs.lstatSync(commandsDir);
    if (!stats.isDirectory() && !stats.isSymbolicLink()) {
      return null;
    }
    
    // Read directory contents
    const files = fs.readdirSync(commandsDir);
    const commandFiles = files
      .filter(file => file.endsWith('.md'))
      .sort()
      .map(file => {
        const filePath = path.join(commandsDir, file);
        try {
          const content = fs.readFileSync(filePath, 'utf8');
          // Strip front matter and resolve imports relative to the command file's directory
          const strippedContent = stripFrontMatter(content);
          const processedContent = resolveImports(strippedContent, path.dirname(filePath));
          return { content: processedContent, path: filePath };
        } catch (error) {
          // Skip files that can't be read
          return null;
        }
      })
      .filter(Boolean);
    
    if (commandFiles.length === 0) {
      return null;
    }
    
    // Build commands section content
    let commandsContent = "\n\n# Commands\n\n";
    
    for (let i = 0; i < commandFiles.length; i++) {
      const { content, path: filePath } = commandFiles[i];
      
      // Add HTML comment with file path before content
      if (i > 0) {
        commandsContent += `\n\n<!-- ${filePath} -->\n\n`;
      } else {
        commandsContent += `<!-- ${filePath} -->\n\n`;
      }
      
      commandsContent += content;
    }
    
    return commandsContent;
    
  } catch (error) {
    // Return null if any error occurs
    return null;
  }
}

/**
 * Generates complete context content by collecting and processing CLAUDE.md files.
 * Files are processed in reverse order with HTML comment separators.
 * Commands from ~/.claude/commands/ are inserted after the global CLAUDE.md file.
 * 
 * @param {string} [startDir=process.cwd()] - Starting directory for file collection
 * @param {boolean} [addCommands=true] - Whether to append commands from ~/.claude/commands/
 * @returns {string} Complete context content with resolved imports and HTML separators
 */
function generateContextContent(startDir = process.cwd(), addCommands = true) {
  const homeDir = os.homedir();
  const claudeFiles = collectClaudeFiles(startDir, homeDir);
  const processedContents = processFiles(claudeFiles);

  // Generate content in reverse order with HTML comment separators
  const reversedContents = processedContents.reverse();
  let output = "";

  // Collect commands once if needed
  const commandsContent = addCommands ? collectCommands() : null;

  for (let i = 0; i < reversedContents.length; i++) {
    const { content, path: filePath } = reversedContents[i];

    // Add HTML comment with file path before content (except for first file)
    if (i > 0) {
      output += `\n\n<!-- ${filePath} -->\n\n`;
    }

    output += content;

    // Insert commands after the first file (global ~/.claude/CLAUDE.md)
    if (i === 0 && commandsContent) {
      output += commandsContent;
    }
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
 * Global commands are only appended to the file that goes to the global folder.
 * 
 * @param {string} filename - Output filename to use
 * @param {string} [startDir=process.cwd()] - Starting directory for file collection
 * @param {string} [globalFolder="~/.gemini/"] - Global folder for special handling
 * @param {boolean} [addCommands=true] - Whether to add commands from ~/.claude/commands/
 * @returns {string[]} Array of created file paths
 */
function handleOriginMode(filename, startDir = process.cwd(), globalFolder = "~/.gemini/", addCommands = true) {
  const homeDir = os.homedir();
  const claudeFiles = collectClaudeFiles(startDir, homeDir);
  const filesCreated = [];
  
  // Handle tilde expansion for globalFolder
  const expandedGlobalFolder = globalFolder.startsWith("~/") 
    ? path.join(homeDir, globalFolder.slice(2))
    : globalFolder;

  // Collect commands once if needed for global files
  const commandsContent = addCommands ? collectCommands() : null;

  claudeFiles.forEach((claudeFile) => {
    const fileDir = path.dirname(claudeFile);
    let content = generateContextContentForFile(claudeFile);

    // Special case: if the CLAUDE.md file is in ~/.claude/, put output in configured global folder
    let outputPath;
    const claudePath = path.join(homeDir, ".claude", "CLAUDE.md");
    const isGlobalFile = claudeFile === claudePath;
    
    if (isGlobalFile) {
      outputPath = path.join(expandedGlobalFolder, filename);
      // Only append commands to files that go to the global folder
      if (commandsContent) {
        content += commandsContent;
      }
    } else {
      outputPath = path.join(fileDir, filename);
      // Don't append commands to local files
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
