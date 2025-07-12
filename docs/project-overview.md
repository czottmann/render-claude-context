<!-- Generated: 2025-07-12 20:30:00 UTC -->

# Project Overview

This is a Node.js CLI tool that processes CLAUDE.md files with a hierarchical collection system. The tool walks up the directory tree from the current working directory to the user's home folder, collecting all `CLAUDE.md` files and processing them with recursive file import resolution. It's designed for hierarchical configuration management where higher-level directories can override or extend lower-level configurations.

The core functionality involves three phases: file discovery through directory traversal, recursive import resolution using `@` syntax, and output generation in reverse collection order. This enables building complex context hierarchies where local CLAUDE.md files can import and extend configurations from parent directories or external files.

## Key Files

**Main Entry Point** - `index.js` (lines 87-111): CLI entry point with main() function
**Package Configuration** - `package.json` (lines 6-8): Binary configuration for CLI tool
**Project Specification** - `SPEC.md`: Complete functional requirements and processing rules
**Local Configuration** - `CLAUDE.md`: Project-specific context and instructions

## Technology Stack

**Runtime** - Node.js with built-in modules only
**File System** - `fs` module for file operations (`index.js` lines 3, 13-14, 25-26, 49, 55, 74)
**Path Resolution** - `path` module for cross-platform paths (`index.js` lines 4, 12, 20, 24, 43-46)
**OS Integration** - `os` module for home directory detection (`index.js` lines 5, 43, 89)

## Platform Support

**Requirements** - Node.js runtime (any recent version)
**Platform Compatibility** - Cross-platform via Node.js built-in modules
**Installation** - Direct execution via shebang (`index.js` line 1: `#!/usr/bin/env node`)
**Binary Configuration** - Package.json bin field enables global CLI installation (`package.json` lines 6-8)