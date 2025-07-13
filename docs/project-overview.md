<!-- Generated: 2025-07-13 10:44:02 UTC -->

# Project Overview

claude-context-render is a Node.js CLI tool that processes CLAUDE.md files with a hierarchical collection system and recursive import resolution. The tool walks up the directory tree from the current working directory to the user's home folder, collecting all `CLAUDE.md` files and processing them with file import resolution using `@` syntax. It provides multiple output modes, Gemini integration for automatic context loading, and comprehensive file management commands.

The architecture is modular with separate concerns: file collection traverses directories upward, import resolution processes `@` references recursively with circular import protection, and file processing generates output in reverse collection order. This enables building complex context hierarchies where local CLAUDE.md files can import and extend configurations from parent directories, external files, or global configurations.

The tool supports three output modes (global, project, origin), Gemini settings integration for automatic context loading, and includes setup/teardown commands for complete workflow management. It's designed for hierarchical configuration management where higher-level directories can override or extend lower-level configurations through the CLAUDE.md file system.

## Key Files

**Main Entry Point** - `index.js` (lines 11-75): CLI orchestration with Commander.js, command routing, and module re-exports
**Package Configuration** - `package.json` (lines 6-7): Binary configuration for `claude-context-render` CLI tool
**File Collection** - `src/fileCollector.js` (lines 5-27): Directory traversal and CLAUDE.md discovery logic
**Import Resolution** - `src/importResolver.js` (lines 5-39): Recursive `@` import processing with circular protection
**File Processing** - `src/fileProcessor.js` (lines 25-101): Content generation, output modes, and file writing
**Command Implementations** - `src/commands/`: Individual command handlers for create, setup, teardown, cleanup

## Technology Stack

**Runtime Environment** - Node.js with Commander.js framework for CLI structure (`package.json` line 21)
**Core Dependencies** - Commander v14.0.0 for command-line interface (`index.js` lines 3, 12-25)
**File System Operations** - Built-in `fs` module for file I/O (`src/fileCollector.js` lines 1, 11, 23)
**Path Resolution** - Built-in `path` module for cross-platform paths (`src/importResolver.js` lines 2, 16, 18)
**OS Integration** - Built-in `os` module for home directory detection (`src/fileCollector.js` lines 3, 22)
**Import Processing** - Regex-based `@` import syntax with tilde expansion (`src/importResolver.js` lines 6, 15-16)

## Platform Support

**Requirements** - Node.js runtime (any recent version supporting ES6+ features)
**Platform Compatibility** - Cross-platform via Node.js built-in modules and Commander.js
**Installation Methods** - Global NPM installation (`npm install -g .`) or direct execution (`node index.js`)
**Binary Configuration** - Package.json bin field maps `claude-context-render` to `./index.js` (`package.json` lines 6-7)
**Execution** - Shebang line enables direct execution (`index.js` line 1: `#!/usr/bin/env node`)
**Output Locations** - Supports multiple output modes: `~/.gemini/` (global), current directory (project), or alongside source files (origin)