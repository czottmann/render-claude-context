<!-- Generated: 2025-07-13 17:35:00 UTC -->

# claude-context-render

Tired of maintaining two sets of context and rules for Claude Code and Gemini CLI?

This node.js CLI tool processes CLAUDE.md files with hierarchical collection and recursive `@` import resolution. Walks directory tree from current to home directory, collecting all CLAUDE.md files and processing them with file import resolution. Saves processed context files with resolved imports next to the original CLAUDE.md files.

These files can then be used as context for Gemini.

## Example

```bash
# One-time setup, tells Gemini to use context files with that name
claude-context-render setup --filename CLAUDE-derived.md

# Every day use: Generate context files on the fly, call Gemini, then clean up
claude-context-render create; gemini; claude-context-render cleanup
```

## Key Files

**Main Entry Point** - `index.js` (Commander.js integration, commands 11-75)
**File Collection** - `src/fileCollector.js` (directory traversal 5-28, ~/.claude handling 21-25)
**Import Resolution** - `src/importResolver.js` (recursive @path processing 5-40, tilde expansion 15-16)
**File Processing** - `src/fileProcessor.js` (content generation 25-46, output modes 62-76)
**Commands** - `src/commands/` (create, setup, teardown, cleanup implementations)
**Configuration** - `package.json` (binary claude-context-render 6-8, dependencies 20-22)

## Quick Build Commands

```bash
# Install dependencies and run
npm install && node index.js help

# Global installation
npm install -g . && claude-context-render help

# Create context files (default: next to each CLAUDE.md)
claude-context-render create

# Create with specific mode and filename
claude-context-render create --output-folder global --filename my-context.md

# Gemini integration setup/teardown
claude-context-render setup --filename my-context.md
claude-context-render teardown --filename my-context.md
```

## Author

Carlo Zottmann, <carlo@zottmann.dev>, https://c.zottmann.dev, https://github.com/czottmann

## Documentation

- **[Project Overview](docs/project-overview.md)** - Purpose, technology stack, platform support with file references
- **[Architecture](docs/architecture.md)** - Component map, data flow, key functions with line numbers
- **[Build System](docs/build-system.md)** - NPM workflows, dependency setup, platform configuration
- **[Testing](docs/testing.md)** - Module exports for unit testing, CLI integration testing
- **[Development](docs/development.md)** - Code patterns, Commander.js structure, debugging workflows
- **[Deployment](docs/deployment.md)** - Installation methods, output modes, external system integration
- **[Files Catalog](docs/files.md)** - Complete file organization, dependencies, naming conventions

LLMs will find specific file paths, line numbers for key functions, actual code examples from the codebase, and practical guidance for understanding and extending the hierarchical file processing system.
