#!/usr/bin/env node

const { Command } = require("commander");
const createCommand = require("./src/commands/create");
const setupCommand = require("./src/commands/setup");
const teardownCommand = require("./src/commands/teardown");
const cleanupCommand = require("./src/commands/cleanup");
const helpCommand = require("./src/commands/help");
const { validateFilename } = require("./src/utils/validation");

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
    .argument("[command]", "Show help for specific command")
    .action(helpCommand);

  program
    .command("create")
    .description("Generate processed context files with resolved imports")
    .option(
      "--output-folder <mode>",
      "Output folder mode: global, project, or origin",
      "origin",
    )
    .option("--filename <name>", "Output filename", validateFilename, "CLAUDE-derived.md")
    .action(createCommand);

  program
    .command("setup")
    .description(
      "Add filename to ~/.gemini/settings.json contextFileName array for auto-loading",
    )
    .option("--filename <name>", "Output filename", validateFilename, "CLAUDE-derived.md")
    .action(setupCommand);

  program
    .command("teardown")
    .description("Remove filename from Gemini contextFileName array")
    .option("--filename <name>", "Output filename", validateFilename, "CLAUDE-derived.md")
    .action(teardownCommand);

  program
    .command("cleanup")
    .description("Delete generated context files from filesystem")
    .option(
      "--output-folder <mode>",
      "Output folder mode: global, project, or origin",
      "origin",
    )
    .option("--filename <name>", "Output filename", validateFilename, "CLAUDE-derived.md")
    .action(cleanupCommand);

  program.parse();
}

if (require.main === module) {
  main();
}

module.exports = {
  // Re-export functions from modules for backwards compatibility
  ...require("./src/fileCollector"),
  ...require("./src/importResolver"),
  ...require("./src/fileProcessor"),
};
