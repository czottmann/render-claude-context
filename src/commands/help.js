function helpCommand(command) {
  if (command) {
    // Show help for specific command
    switch (command) {
      case "create":
        console.log(`
CREATE COMMAND:
  claude-context-render create [options]

  Walks up directory tree collecting CLAUDE.md files, processes @imports recursively,
  and outputs single or multiple processed files.

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
`);
        break;
      case "setup":
        console.log(`
SETUP COMMAND:
  claude-context-render setup [options]

  Writes filename to ~/.gemini/settings.json contextFileName array
  so Gemini CLI auto-loads the context file on startup.

  Options:
    --output-folder <mode>  Output folder mode: global, project (origin not applicable)
    --filename <name>      Output filename (default: CLAUDE-derived.md)

  Examples:
    claude-context-render setup
    claude-context-render setup --filename my-context.md
`);
        break;
      case "teardown":
        console.log(`
TEARDOWN COMMAND:
  claude-context-render teardown [options]

  Removes filename from ~/.gemini/settings.json contextFileName array
  so Gemini CLI stops auto-loading the context file.

  Options:
    --output-folder <mode>  Output folder mode: global, project (origin not applicable)
    --filename <name>      Output filename (default: CLAUDE-derived.md)

  Examples:
    claude-context-render teardown
    claude-context-render teardown --filename my-context.md
`);
        break;
      case "cleanup":
        console.log(`
CLEANUP COMMAND:
  claude-context-render cleanup [options]

  Deletes generated context files from filesystem based on output mode and filename.

  Options:
    --output-folder <mode>  Output folder mode: global, project, or origin
    --filename <name>      Output filename (default: CLAUDE-derived.md)

  Examples:
    claude-context-render cleanup
    claude-context-render cleanup --output-folder global --filename my-context.md
    claude-context-render cleanup --output-folder origin
`);
        break;
      default:
        console.log(`Unknown command: ${command}`);
        console.log("Available commands: create, setup, teardown, cleanup");
    }
  } else {
    // Show general help
    console.log(`
Collects CLAUDE.md files from directory hierarchy (project folder up to ~/.claude/),
embeds their @imports, and generates processed context files with resolved imports.
These files can then be used as context for Gemini.

USAGE:
  claude-context-render <command> [options]
  claude-context-render help [command]

COMMANDS:
  create     Generate processed context files with resolved imports
  setup      Add filename to Gemini contextFileName array for auto-loading
  teardown   Remove filename from Gemini contextFileName array
  cleanup    Delete generated context files from filesystem
  help       Show usage instructions

Use "claude-context-render help <command>" for detailed command help.
Use "claude-context-render <command> --help" for command options.
`);
  }
}

module.exports = helpCommand;