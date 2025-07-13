#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const os = require("os");
const { Command } = require("commander");

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

function generateContextContentForFile(claudeFile) {
  const fileDir = path.dirname(claudeFile);
  const content = fs.readFileSync(claudeFile, "utf8");
  return resolveImports(content, fileDir);
}

function main() {
  const program = new Command();

  program
    .name("claude-context-render")
    .description(
      "CLI tool to collect and process CLAUDE.md files from directory hierarchy",
    )
    .version("1.0.0");

  program
    .command("help", { isDefault: true })
    .description("Show usage instructions")
    .action(() => {
      console.log(`
claude-context-render - CLI tool for processing CLAUDE.md files

USAGE:
  claude-context-render <command> [options]

COMMANDS:
  create     Create context files from CLAUDE.md files (processes hierarchy and imports)
  setup      Add output file to Gemini settings contextFileName array
  teardown   Remove output file from Gemini settings contextFileName array
  cleanup    Remove generated context files
  help       Show this help message

CREATE COMMAND:
  claude-context-render create [options]

  Options:
    --output-folder <mode>  Where to place output files:
                           • global: ~/.gemini/ (single collated file)
                           • project: current directory (single collated file)
                           • origin: next to each CLAUDE.md (individual files)
                           Default: project
    --filename <name>      Output filename (default: CLAUDE-derived.md)

  Examples:
    claude-context-render create
    claude-context-render create --output-folder global --filename my-context.md
    claude-context-render create --output-folder origin

SETUP COMMAND:
  claude-context-render setup [options]

  Adds the specified filename to ~/.gemini/settings.json contextFileName array
  so Gemini CLI automatically loads the context file.

  Options: Same as create command (except origin mode not applicable)

  Examples:
    claude-context-render setup
    claude-context-render setup --filename my-context.md

TEARDOWN COMMAND:
  claude-context-render teardown [options]

  Removes the specified filename from ~/.gemini/settings.json contextFileName array
  so Gemini CLI stops loading the context file.

  Options: Same as setup command

  Examples:
    claude-context-render teardown
    claude-context-render teardown --filename my-context.md

CLEANUP COMMAND:
  claude-context-render cleanup [options]

  Removes generated context files based on the specified output mode and filename.

  Options: Same as create command

  Examples:
    claude-context-render cleanup
    claude-context-render cleanup --output-folder global --filename my-context.md
    claude-context-render cleanup --output-folder origin

For more details, see: https://github.com/anthropics/claude-code
`);
    });

  program
    .command("create")
    .description("Create context files from CLAUDE.md files")
    .option(
      "--output-folder <mode>",
      "Output folder mode: global, project, or origin",
      "project",
    )
    .option("--filename <name>", "Output filename", "CLAUDE-derived.md")
    .action((options) => {
      try {
        if (options.filename === "CLAUDE.md") {
          console.error("Error: Cannot use 'CLAUDE.md' as output filename to prevent overwriting source files");
          process.exit(1);
        }

        if (options.outputFolder === "origin") {
          const filesCreated = handleOriginMode(options.filename);
          console.log(`Created ${filesCreated.length} context file(s):`);
          filesCreated.forEach((file) => console.log(`  ${file}`));
        } else {
          const content = generateContextContent();
          const outputPath = getOutputPath(
            options.outputFolder,
            options.filename,
          );
          writeToFile(content, outputPath);
          console.log(`Created 1 context file(s):`);
          console.log(`  ${outputPath}`);
        }
      } catch (error) {
        console.error("Error:", error.message);
        process.exit(1);
      }
    });

  program
    .command("setup")
    .description(
      "Add output file to ~/.gemini/settings.json contextFileName array",
    )
    .option(
      "--output-folder <mode>",
      "Output folder mode: global, project, or origin",
      "project",
    )
    .option("--filename <name>", "Output filename", "CLAUDE-derived.md")
    .action((options) => {
      try {
        if (options.filename === "CLAUDE.md") {
          console.error("Error: Cannot use 'CLAUDE.md' as output filename to prevent overwriting source files");
          process.exit(1);
        }

        if (options.outputFolder === "origin") {
          console.log("Setup command not applicable for origin mode");
          return;
        }

        const settingsPath = path.join(
          os.homedir(),
          ".gemini",
          "settings.json",
        );

        let settings = {};
        if (fs.existsSync(settingsPath)) {
          settings = JSON.parse(fs.readFileSync(settingsPath, "utf8"));
        }

        if (!settings.contextFileName) {
          settings.contextFileName = [];
        }

        // Always add the specified filename to settings
        if (!settings.contextFileName.includes(options.filename)) {
          settings.contextFileName.push(options.filename);

          const settingsDir = path.dirname(settingsPath);
          if (!fs.existsSync(settingsDir)) {
            fs.mkdirSync(settingsDir, { recursive: true });
          }

          fs.writeFileSync(
            settingsPath,
            JSON.stringify(settings, null, 2),
            "utf8",
          );
          console.log(
            `Added ${options.filename} to ~/.gemini/settings.json contextFileName array`,
          );
        } else {
          console.log(
            `${options.filename} already exists in ~/.gemini/settings.json contextFileName array`,
          );
        }
      } catch (error) {
        console.error("Error:", error.message);
        process.exit(1);
      }
    });

  program
    .command("teardown")
    .description(
      "Remove output file from ~/.gemini/settings.json contextFileName array",
    )
    .option(
      "--output-folder <mode>",
      "Output folder mode: global, project, or origin",
      "project",
    )
    .option("--filename <name>", "Output filename", "CLAUDE-derived.md")
    .action((options) => {
      try {
        if (options.filename === "CLAUDE.md") {
          console.error("Error: Cannot use 'CLAUDE.md' as output filename to prevent overwriting source files");
          process.exit(1);
        }

        if (options.outputFolder === "origin") {
          console.log("Teardown command not applicable for origin mode");
          return;
        }

        const settingsPath = path.join(
          os.homedir(),
          ".gemini",
          "settings.json",
        );

        if (!fs.existsSync(settingsPath)) {
          console.log("No Gemini settings file found");
          return;
        }

        let settings = {};
        try {
          settings = JSON.parse(fs.readFileSync(settingsPath, "utf8"));
        } catch (error) {
          console.error("Error reading Gemini settings file:", error.message);
          process.exit(1);
        }

        if (!settings.contextFileName || !Array.isArray(settings.contextFileName)) {
          console.log("No contextFileName array found in Gemini settings");
          return;
        }

        const index = settings.contextFileName.indexOf(options.filename);
        if (index !== -1) {
          settings.contextFileName.splice(index, 1);

          fs.writeFileSync(
            settingsPath,
            JSON.stringify(settings, null, 2),
            "utf8",
          );
          console.log(
            `Removed ${options.filename} from ~/.gemini/settings.json contextFileName array`,
          );
        } else {
          console.log(
            `${options.filename} not found in ~/.gemini/settings.json contextFileName array`,
          );
        }
      } catch (error) {
        console.error("Error:", error.message);
        process.exit(1);
      }
    });

  program
    .command("cleanup")
    .description("Remove generated context files")
    .option(
      "--output-folder <mode>",
      "Output folder mode: global, project, or origin",
      "project",
    )
    .option("--filename <name>", "Output filename", "CLAUDE-derived.md")
    .action((options) => {
      try {
        if (options.filename === "CLAUDE.md") {
          console.error("Error: Cannot use 'CLAUDE.md' as filename to prevent accidental deletion of source files");
          process.exit(1);
        }

        let filesRemoved = [];

        if (options.outputFolder === "origin") {
          // Remove files in origin mode (next to each CLAUDE.md, with special ~/.claude/ case)
          const homeDir = os.homedir();
          const claudeFiles = collectClaudeFiles(process.cwd(), homeDir);

          claudeFiles.forEach((claudeFile) => {
            // Special case: if the CLAUDE.md file is in ~/.claude/, the output is in ~/.gemini/
            let outputPath;
            const claudePath = path.join(homeDir, ".claude", "CLAUDE.md");
            if (claudeFile === claudePath) {
              outputPath = path.join(homeDir, ".gemini", options.filename);
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
          const outputPath = getOutputPath(
            options.outputFolder,
            options.filename,
          );
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
    });

  program.parse();
}

if (require.main === module) {
  main();
}

module.exports = {
  collectClaudeFiles,
  resolveImports,
  processFiles,
  generateContextContent,
  writeToFile,
  getOutputPath,
  handleOriginMode,
  generateContextContentForFile,
};
