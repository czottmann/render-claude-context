#!/usr/bin/env node

/**
 * @fileoverview CLI entry point for render-claude-context.
 * Orchestrates Commander.js CLI framework with modular command implementations.
 */

const { Command } = require("commander");
const createCommand = require("./src/commands/create");
const setupCommand = require("./src/commands/setup");
const teardownCommand = require("./src/commands/teardown");
const cleanupCommand = require("./src/commands/cleanup");
const { validateFilename } = require("./src/utils/validation");
const { validateTarget } = require("./src/utils/targetValidator");
const { getDefaultTarget } = require("./src/utils/targets");

/**
 * Main CLI application entry point.
 * Sets up Commander.js program with all commands and their options.
 */
function main() {
  const program = new Command();

  program
    .name("render-claude-context")
    .description(
      "Collects CLAUDE.md files from directory hierarchy (project folder up to ~/.claude/), embeds their @imports, and generates processed context files with resolved imports.\n\nThese files can then be used as context for Gemini.",
    )
    .addHelpText(
      "after",
      `
Example:

  Walk up from the current folder up to the global ~/.claude/, find every
  CLAUDE.md file in the hierarchy, resolve its @-imports as Claude Code would,
  generate a fully rendered "CLAUDE-derived.md" file next to the original, then
  call Gemini CLI which will use them as context (assuming it was told so before
  using \`setup\`). When gemini exits, clean up the generated files.

  $ render-claude-context create; gemini; render-claude-context cleanup
  `,
    )
    .version("1.0.0");

  program
    .command("create")
    .description(
      "Collect CLAUDE.md files from current directory up to ~/, resolve @-imports recursively, and write a context output file to specified location",
    )
    .option(
      "--output-folder <mode>",
      "Where to write output:\n- global (global folder (see below), one collated file)\n- project (cwd, one collated file)\n- origin (single files, next to each found CLAUDE.md file)",
      "origin",
    )
    .option(
      "--global-folder <path>",
      "Global folder for global output and special handling",
      "~/.gemini/",
    )
    .option(
      "--filename <name>",
      "Name of output file",
      validateFilename,
      "CLAUDE-derived.md",
    )
    .addHelpText(
      "after",
      `
Examples:
  $ render-claude-context create
  $ render-claude-context create --output-folder global --filename my-context.md
  $ render-claude-context create --output-folder origin`,
    )
    .action(createCommand);

  program
    .command("cleanup")
    .description("Delete generated context files from filesystem")
    .option(
      "--output-folder <mode>",
      "Where to remove output from:\n- global (~/.claude/)\n- project (cwd)\n- origin (each folder in the hierarchy containing a CLAUDE.md file)",
      "origin",
    )
    .option(
      "--filename <name>",
      "Name of context file to delete",
      validateFilename,
      "CLAUDE-derived.md",
    )
    .option(
      "--global-folder <path>",
      "Global folder for global output and special handling",
      "~/.gemini/",
    )
    .addHelpText(
      "after",
      `
Examples:
  $ render-claude-context cleanup
  $ render-claude-context cleanup --output-folder global --filename my-context.md
  $ render-claude-context cleanup --output-folder origin`,
    )
    .action(cleanupCommand);

  program
    .command("setup")
    .description(
      "Add output filename to target AI tool settings for auto-loading generated context files",
    )
    .option(
      "--filename <name>",
      "Name of context file to register",
      validateFilename,
      "CLAUDE-derived.md",
    )
    .option(
      "--target <name>",
      "Target AI tool (gemini, opencode)",
      validateTarget,
      getDefaultTarget(),
    )
    .addHelpText(
      "after",
      `
Examples:
  $ render-claude-context setup
  $ render-claude-context setup --filename my-context.md
  $ render-claude-context setup --target opencode
  $ render-claude-context setup --filename my-context.md --target opencode`,
    )
    .action(setupCommand);

  program
    .command("teardown")
    .description(
      "Remove filename from target AI tool settings to stop auto-loading",
    )
    .option(
      "--filename <name>",
      "Name of context file to unregister",
      validateFilename,
      "CLAUDE-derived.md",
    )
    .option(
      "--target <name>",
      "Target AI tool (gemini, opencode)",
      validateTarget,
      getDefaultTarget(),
    )
    .addHelpText(
      "after",
      `
Examples:
  $ render-claude-context teardown
  $ render-claude-context teardown --filename my-context.md
  $ render-claude-context teardown --target opencode
  $ render-claude-context teardown --filename my-context.md --target opencode`,
    )
    .action(teardownCommand);

  program.parse();
}

if (require.main === module) {
  main();
}

/**
 * Module exports for programmatic access and testing.
 * Re-exports core functions from modular components for backwards compatibility.
 */
module.exports = {
  // Re-export functions from modules for backwards compatibility
  ...require("./src/fileCollector"),
  ...require("./src/importResolver"),
  ...require("./src/fileProcessor"),
};
