<!-- Generated: 2025-07-21T10:24:41Z -->

# render-claude-context

Tired of maintaining two sets of context and rules for Claude Code and Gemini CLI?

This node.js CLI tool processes CLAUDE.md files with hierarchical collection and recursive `@`-import resolution. Walks directory tree from current to home directory, collecting all CLAUDE.md files and processing them with file import resolution. Saves processed context files with resolved imports next to the original CLAUDE.md files.

These files can then be used as context for Gemini.

## But why?

Claude Code uses `CLAUDE.md` files which contains context for the tool. From [Anthropic's docs](https://www.anthropic.com/engineering/claude-code-best-practices):

> You can place `CLAUDE.md` files in several locations:
>
> The root of your repo, or wherever you run `claude` from (the most common usage). Name it `CLAUDE.md` and check it into git so that you can share it across sessions and with your team […]
> Any parent of the directory where you run `claude`. This is most useful for monorepos, where you might run claude from `root/foo`, and have CLAUDE.md files in both `root/CLAUDE.md` and `root/foo/CLAUDE.md`. Both of these will be pulled into context automatically […]
> Your home folder (`~/.claude/CLAUDE.md`), which applies it to all your *claude* sessions

Gemini CLI works mostly the same way, but the file name is `GEMINI.md`, and the home folder is `~/.gemini/`. Sure, I can add `CLAUDE.md` to the list of Gemini's auto-read context files (see [config docs about `contextFileName`](https://github.com/google-gemini/gemini-cli/blob/main/docs/cli/configuration.md#available-settings-in-settingsjson)), but that helps only partially because the tools differ in one big way:

Both Claude Code and Gemini can `@`-import other files, meaning they will transpose `@./some/file.md` directives in their context file with the contents of the referenced file. BUT: Claude Code will happily import files from anywhere on your device while Gemini **only** allows files in the current directory. And that's my main issue with it!

Because I usually mix and match my rules, depending on the project, I put them in a separate folder on my machine. Claude can use them. Gemini can, too, but only when I copy them to the project, and then `@`-import that local copy.

So in order to streamline my dev environment, I decided to keep only my `CLAUDE.md`'s in order, and make Gemini play ball. That means that I only have to set up context once (for Claude) – and Gemini reuses it without me having to copy/symlink rules and manually copy/rewriting context files.

## Example

```bash
# One-time setup, tells Gemini to use context files with that name
render-claude-context setup --filename CLAUDE-derived.md

# Every day use: Generate context files on the fly, call Gemini, then clean up
render-claude-context create; gemini; render-claude-context cleanup
```

## Quick Build Commands

```bash
# Install dependencies and run
npm install && node index.js help

# Global installation
npm install -g . && render-claude-context help

# Create context files (default: next to each CLAUDE.md)
render-claude-context create

# Create with specific mode and filename
render-claude-context create --output-folder global --filename my-context.md

# Create but write the processed version of the Claude file found in 
# `~/.claude/CLAUDE.md` to a custom global folder
render-claude-context create --global-folder ~/.config/opencode/
render-claude-context cleanup --global-folder ~/.config/opencode/

# Gemini integration setup/teardown
render-claude-context setup --filename my-context.md
render-claude-context teardown --filename my-context.md
```

## Key Files

- **Main Entry Point**: `index.js` (Commander.js integration, commands 11-75)
- **File Collection**: `src/fileCollector.js` (directory traversal 5-28, ~/.claude handling 21-25)
- **Import Resolution**: `src/importResolver.js` (recursive @path processing 5-40, tilde expansion 15-16)
- **File Processing**: `src/fileProcessor.js` (content generation 25-46, output modes 62-76)
- **Commands**: `src/commands/` (create, setup, teardown, cleanup implementations)
- **Configuration**: `package.json` (binary render-claude-context 6-8, dependencies 20-22)

## Documentation

- **[Project Overview](docs/project-overview.md)** - Purpose, technology stack, platform support with file references
- **[Architecture](docs/architecture.md)** - Component map, data flow, key functions with line numbers
- **[Build System](docs/build-system.md)** - NPM workflows, dependency setup, platform configuration
- **[Testing](docs/testing.md)** - Module exports for unit testing, CLI integration testing
- **[Development](docs/development.md)** - Code patterns, Commander.js structure, debugging workflows
- **[Deployment](docs/deployment.md)** - Installation methods, output modes, external system integration
- **[Files Catalog](docs/files.md)** - Complete file organization, dependencies, naming conventions

LLMs will find specific file paths, line numbers for key functions, actual code examples from the codebase, and practical guidance for understanding and extending the hierarchical file processing system.

## Author

Carlo Zottmann, <carlo@zottmann.dev>, https://c.zottmann.dev, https://github.com/czottmann
