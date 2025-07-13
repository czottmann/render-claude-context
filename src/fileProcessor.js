const fs = require("fs");
const path = require("path");
const os = require("os");
const { collectClaudeFiles } = require("./fileCollector");
const { resolveImports } = require("./importResolver");

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

function generateContextContentForFile(claudeFile) {
  const fileDir = path.dirname(claudeFile);
  const content = fs.readFileSync(claudeFile, "utf8");
  return resolveImports(content, fileDir);
}

function writeToFile(content, outputPath) {
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(outputPath, content, "utf8");
}

function getOutputPath(outputFolder, filename, startDir = process.cwd()) {
  const homeDir = os.homedir();

  switch (outputFolder) {
    case "global":
      return path.join(homeDir, ".gemini", filename);
    case "project":
      return path.join(startDir, filename);
    case "origin":
      // For origin mode, we'll handle multiple files differently
      return null;
    default:
      throw new Error(`Unknown output folder mode: ${outputFolder}`);
  }
}

function handleOriginMode(filename, startDir = process.cwd()) {
  const homeDir = os.homedir();
  const claudeFiles = collectClaudeFiles(startDir, homeDir);
  const filesCreated = [];

  claudeFiles.forEach((claudeFile) => {
    const fileDir = path.dirname(claudeFile);
    const content = generateContextContentForFile(claudeFile);

    // Special case: if the CLAUDE.md file is in ~/.claude/, put output in ~/.gemini/
    let outputPath;
    const claudePath = path.join(homeDir, ".claude", "CLAUDE.md");
    if (claudeFile === claudePath) {
      outputPath = path.join(homeDir, ".gemini", filename);
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