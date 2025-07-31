<!-- Generated: 2025-07-21T19:27:18+02:00 -->

# Project Overview

render-claude-context is a Node.js CLI tool that collects CLAUDE.md files hierarchically from the current directory up to the user's home directory, resolving `@path` imports recursively to generate processed context files for AI agents. The tool enables building complex context hierarchies where project-specific files can import and extend configurations from parent directories, external files, or global user configurations in `~/.claude/`.

The modular architecture separates concerns across dedicated components: file collection via upward directory traversal (`src/fileCollector.js`), recursive import resolution with circular protection (`src/importResolver.js`), content generation with multiple output modes (`src/fileProcessor.js`), and command routing through a Commander.js CLI interface (`index.js`). Files are processed in reverse collection order with HTML comment separators, allowing higher-level configurations to take precedence.

Supports seamless integration with AI tools like Crush, Gemini, and opencode through target-specific global folder mapping, automatic command inclusion from `~/.claude/commands/`, and setup/teardown workflows for complete AI context management. Commands include create, cleanup, setup, and teardown for end-to-end context file lifecycle management.

## Key Files

**CLI Entry Point** - `index.js` (lines 21-179): Commander.js CLI setup with create, setup, teardown, cleanup commands and comprehensive option validation
**Binary Configuration** - `package.json` (lines 6-7): NPM bin entry mapping `render-claude-context` command to `./index.js` executable with shebang
**File Discovery** - `src/fileCollector.js` (lines 23-47): Hierarchical directory traversal from current working directory up to home directory, including `~/.claude/CLAUDE.md`
**Import Resolution** - `src/importResolver.js` (lines 48-93): Recursive `@path` import processing with tilde expansion (`~/`), front matter stripping, and circular dependency protection
**Content Generation** - `src/fileProcessor.js` (lines 114-143): Context assembly with HTML comment file separators, automatic command inclusion from `~/.claude/commands/`, and reverse-order processing
**Command Implementation** - `src/commands/create.js` (lines 25-56): Output mode routing (origin/global/project) with target-specific global folder resolution and mutual exclusion validation
**Target Configuration** - `src/utils/targets.js` (lines 13-39): AI tool configuration mapping for Crush (`~/.config/crush/`), Gemini (`~/.gemini/`), and opencode (`~/.config/opencode/`) with settings paths
**Validation Utilities** - `src/utils/validation.js`, `src/utils/targetValidator.js`: Input validation for filenames and target names with error handling

## Technology Stack

**CLI Framework** - Commander.js v14.0.0 for argument parsing, command structure, help generation, and option validation (`index.js` line 8, `package.json` line 23)
**File Operations** - Node.js built-in `fs` module for synchronous file reading, directory scanning, existence checking, and symlink handling (`src/fileCollector.js` lines 6, 30, 43; `src/fileProcessor.js` lines 52-53)
**Path Handling** - Built-in `path` module for cross-platform path resolution, joining, dirname operations, and absolute path conversion (`src/importResolver.js` lines 8, 67, 70; `src/fileProcessor.js` lines 164, 186)
**System Integration** - Built-in `os` module for home directory detection, tilde expansion, and cross-platform compatibility (`src/fileCollector.js` line 8, `src/importResolver.js` line 67, `src/utils/targets.js` line 16)
**Pattern Matching** - Regex-based `@path` import detection and YAML front matter stripping with multiline support (`src/importResolver.js` lines 49, 30)
**Content Processing** - Recursive import resolution with Set-based circular dependency protection and front matter handling (`src/importResolver.js` lines 51, 74-75, 84)

## Platform Support

**Requirements** - Node.js runtime with ES6+ support for const, destructuring, template literals, and built-in fs/path/os modules
**Cross-Platform** - Works on Windows, macOS, Linux via Node.js built-ins with platform-specific path handling (`src/importResolver.js` line 70, `src/fileProcessor.js` line 186)
**Installation** - Global installation via `npm install -g .` creates `render-claude-context` command, or direct execution `node index.js` (`package.json` lines 6-7)
**Binary Setup** - Shebang header for Unix-like systems (`index.js` line 1) with package.json bin mapping for cross-platform executable installation
**Output Modes** - Three modes: global folder (configurable, default `~/.gemini/`), project folder (current working directory), or origin mode (individual files next to each CLAUDE.md)
**AI Tool Integration** - Native support for Crush (`~/.config/crush/crush.json`), Gemini (`~/.gemini/settings.json`), and opencode (`~/.config/opencode/opencode.json`) with automatic folder detection (`src/utils/targets.js`)
**Target Configuration** - `--target` option automatically sets appropriate global folders and settings paths for supported AI tools, with mutual exclusion validation for `--global-folder`
