<!-- Generated: 2025-07-21T10:24:41Z -->

# render-claude-context

Tired of maintaining several sets of context and rules for Claude Code, opencode, and Gemini CLI?

This node.js CLI tool processes CLAUDE.md files with hierarchical collection and recursive `@`-import resolution. Walks directory tree from current to `~/.claude/`, collecting all CLAUDE.md files and processing them with file import resolution. Saves processed context files with resolved imports next to the original CLAUDE.md files or in a specific location (configurable).

These files can then be used as context for Gemini or opencode.

## But why?

Claude Code uses `CLAUDE.md` files which provide context for the tool. From [Anthropic's docs](https://www.anthropic.com/engineering/claude-code-best-practices):

> You can place `CLAUDE.md` files in several locations:
>
> The root of your repo, or wherever you run `claude` from (the most common usage). Name it `CLAUDE.md` and check it into git so that you can share it across sessions and with your team […]
> Any parent of the directory where you run `claude`. This is most useful for monorepos, where you might run claude from `root/foo`, and have CLAUDE.md files in both `root/CLAUDE.md` and `root/foo/CLAUDE.md`. Both of these will be pulled into context automatically […]
> Your home folder (`~/.claude/CLAUDE.md`), which applies it to all your *claude* sessions

Other agentic tools, like **Gemini CLI** or **opencode**, work mostly the same way, but their expected file names are different (`GEMINI.md`, `AGENTS.md` etc.), and their home folder is not `~/.claude/`. Sure, I can make them read my `CLAUDE.md` files by adding that name to their settings (see [Gemini's docs about `contextFileName`](https://github.com/google-gemini/gemini-cli/blob/main/docs/cli/configuration.md#available-settings-in-settingsjson) or [opencode's docs on `instructions`](https://opencode.ai/docs/config/#instructions)), but that helps only partially – because these tools differ in one big way:

They all read rule files in different ways.

For example, both Claude Code and Gemini can `@`-import other files, meaning they will replace `@./some/file.md` directives in their context file with the contents of the referenced file. But while Claude Code will happily import files from anywhere on your device, Gemini **only** allows files in the current directory. And opencode works in a different way still.

But I switch agents quite a bit, and it's cumbersome to copy and paste my rules and guidelines around.

So in order to streamline my dev environment, I decided to keep only my `CLAUDE.md`'s in order, and make Gemini and opencode play ball. **Now I only have to set up context once (for Claude) – and have the other agents reuse it without me having to jump through hoops.**

## Showcase

### `create` - Generate context files with resolved imports

Note: _"Single collated file"_ means _"one output file that contains every processed CLAUDE.md from project up to global folder"_.

```bash
# Create individual files next to each CLAUDE.md (default behavior) from project up to global folder
# Uses: --output-folder origin (default), --filename CLAUDE-derived.md (default), 
#       --target gemini (default), commands included (default)
render-claude-context create

# Create single collated file in current project directory
# Uses: --filename CLAUDE-derived.md (default), --target gemini (default), commands included
render-claude-context create --output-folder project

# Create single collated file in global folder (~/.gemini/ for default gemini target)
# Uses: --filename CLAUDE-derived.md (default), --target gemini (default), commands included
render-claude-context create --output-folder global

# Use custom filename with default origin mode
# Uses: --output-folder origin (default), --target gemini (default), commands included
render-claude-context create --filename my-context.md

# Target OpenCode AI tool (sets global folder to ~/.config/opencode/)
# Uses: --output-folder origin (default), --filename CLAUDE-derived.md (default), commands included
render-claude-context create --target opencode

# Use custom global folder
# Uses: --output-folder origin (default), --filename CLAUDE-derived.md (default), commands included
render-claude-context create --global-folder ~/my-ai-configs/

# Skip appending commands from ~/.claude/commands/ directory
# Uses: --output-folder origin (default), --filename CLAUDE-derived.md (default), --target gemini (default)
render-claude-context create --no-add-commands

# Create single collated file in current project directory, using custom filename
# Uses: commands included (default)
render-claude-context create --output-folder project --filename project-context.md

# Global mode with custom filename and no commands
# Uses: --target gemini (default), global folder ~/.gemini/
render-claude-context create --output-folder global --filename full-context.md --no-add-commands
```

### `cleanup` - Remove generated context files

Works exactly like `create` but removes the files. Imagine that!

### `setup` - Register context file with AI tool for auto-loading

```bash
# Register default filename with default target (adds CLAUDE-derived.md to gemini settings)
# Uses: --filename CLAUDE-derived.md (default), --target gemini (default)
render-claude-context setup

# Register custom filename with default gemini target
# Uses: --target gemini (default)
render-claude-context setup --filename my-context.md

# Register default filename with OpenCode target (adds to opencode.json settings)
# Uses: --filename CLAUDE-derived.md (default)
render-claude-context setup --target opencode

# Register custom filename with OpenCode target
render-claude-context setup --target opencode --filename project-context.md
```

### `teardown` - Unregister context file from AI tool

Works exactly like `setup` but removes the settings.

## Output Folder Modes (`--output-folder` flag)

Note: _"Single collated file"_ means _"one output file that contains every processed CLAUDE.md from project up to global folder"_.

### `origin` (default)
- Creates individual files next to each `CLAUDE.md` in the directory hierarchy
- Special case: `~/.claude/CLAUDE.md` output goes to target's global folder
- Most flexible for development workflows

### `project`
- Creates single collated file in current working directory, containing all `CLAUDE.md` output from project folder on up, including `~/.claude/CLAUDE.md`
- Good for project-specific context generation

### `global`
- Creates single collated file in target's global folder
- Best for persistent AI tool integration

## Examples

### For Gemini

```bash
# One-time setup, tells Gemini to use context files with that name
render-claude-context setup --filename CLAUDE-derived.md

# Every day use: Generate context files on the fly, call Gemini, then clean up
render-claude-context create
gemini
render-claude-context cleanup
```

### opencode, 0FG mode ("zero f's given")

```bash
# No prior "setup" necessary, just generate `AGENTS.md` on the fly
# 🚨 THIS WILL OVERWRITE ANY EXISTING `AGENTS.md` FILES FROM PROJECT UP TO
# 🚨 GLOBAL FOLDER 
render-claude-context create --filename AGENTS.md --target opencode
opencode
render-claude-context cleanup --filename AGENTS.md --target opencode
```

## Installation

```bash
npm install -g git@github.com:czottmann/render-claude-context.git
```

## Quick Build Commands

```bash
# See usage
render-claude-context help

# Create context files (default: next to each CLAUDE.md)
render-claude-context create

# Write all processed CLAUDE.md output from project folder up to `~/.claude/`
# into a single `my-context.md` file in default global folder (`~/.gemini/`).
render-claude-context create --output-folder global --filename my-context.md

# Create but write the processed version of the Claude file found in 
# `~/.claude/CLAUDE.md` to a custom global folder
render-claude-context create --global-folder ~/Desktop/
render-claude-context cleanup --global-folder ~/Desktop/

# Gemini integration setup/teardown
render-claude-context setup --filename my-context.md --target gemini
render-claude-context teardown --filename my-context.md --target gemini
```

## Author

Carlo Zottmann, <carlo@zottmann.dev>, https://c.zottmann.dev, https://github.com/czottmann

> ### 💡 Did you know?
>
> I make Shortcuts-related macOS & iOS productivity apps like [Actions For Obsidian](https://actions.work/actions-for-obsidian), [Browser Actions](https://actions.work/browser-actions) (which adds Shortcuts support for several major browsers), and [BarCuts](https://actions.work/barcuts) (a surprisingly useful contextual Shortcuts launcher). Check them out!

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

