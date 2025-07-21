<!-- Generated: 2025-07-21T10:24:41Z -->

# Files Catalog

This Node.js CLI tool uses a modular architecture with Commander.js for command handling and separate modules for core functionality. The codebase follows modern npm CLI conventions with clear separation between command handling, file processing, and utility functions.

The project maintains a clean structure with source files organized by function - commands in `src/commands/`, core processing logic in dedicated modules, and comprehensive documentation. All functionality is built on Node.js standard library with minimal external dependencies.

## Core Source Files

**index.js** - Main CLI entry point with Commander.js integration
- Lines 1-10: Dependencies and command imports
- Lines 11-19: CLI program setup and version configuration
- Lines 21-61: Command definitions (help, create, setup, teardown, cleanup)
- Lines 70-75: Module re-exports for backwards compatibility

**src/fileCollector.js** - Directory traversal and CLAUDE.md file discovery
- Lines 5-28: `collectClaudeFiles()` walks up directory tree from current to home
- Lines 21-25: Adds `~/.claude/CLAUDE.md` if it exists
- Exports: collectClaudeFiles function

**src/fileProcessor.js** - File processing pipeline and output generation
- Lines 7-23: `processFiles()` reads and processes file contents
- Lines 25-46: `generateContextContent()` creates collated output with HTML separators
- Lines 48-52: `generateContextContentForFile()` processes single file
- Lines 54-60: `writeToFile()` utility for safe file writing
- Lines 62-76: `getOutputPath()` determines output location by mode
- Lines 78-101: `handleOriginMode()` creates multiple files next to source

**src/importResolver.js** - Recursive import resolution with `@` syntax
- Lines 5-40: `resolveImports()` processes `@path` imports recursively
- Lines 10-37: Import processing with tilde expansion and circular detection
- Lines 14-19: Tilde expansion for home directory paths
- Lines 21-24: File existence validation and circular import prevention

## Platform Implementation

**src/commands/create.js** - File generation command implementation
- Lines 8-25: Create command logic with origin/global/project mode handling
- Integrates fileProcessor functions for content generation

**src/commands/help.js** - Comprehensive help system with command-specific documentation
- Lines 1-102: Command-specific help text for create, setup, teardown, cleanup
- Lines 82-101: General help overview with command listing

**src/commands/setup.js** - Gemini CLI integration setup
**src/commands/teardown.js** - Gemini CLI integration removal
**src/commands/cleanup.js** - Generated file cleanup functionality

**src/utils/validation.js** - Input validation utilities
- Lines 1-7: `validateFilename()` prevents overwriting source CLAUDE.md files

## Build System

**package.json** - NPM package configuration with CLI binary setup
- Lines 6-8: Binary configuration mapping `render-claude-context` to `index.js`
- Lines 9-12: Build and test scripts
- Lines 20-22: Commander.js dependency (^14.0.0)

**package-lock.json** - Dependency lock file for consistent installations

## Configuration

**CLAUDE.md** - Project-specific context and instructions for Claude Code
- Project overview and architecture documentation
- File processing system explanation and import syntax guide
- Key implementation details with line number references

**README.md** - Main project documentation and usage instructions

**TODO.md** - Development task tracking and feature roadmap

**CLAUDE-derived.md** - Generated context file example/output

## Documentation

**docs/project-overview.md** - High-level project description and key files
**docs/architecture.md** - System design and component relationships
**docs/build-system.md** - Build configuration and development workflows
**docs/testing.md** - Test strategies and execution instructions
**docs/development.md** - Development patterns and code style guidelines
**docs/deployment.md** - Distribution and installation procedures

## Reference

**File Organization Patterns**:
- Modular architecture with `src/` containing all implementation
- Commands separated in `src/commands/` by functionality
- Utilities in `src/utils/` for reusable functions
- Documentation in `docs/` with specific purpose files

**Naming Conventions**:
- Commands: lowercase verbs (create.js, setup.js, teardown.js, cleanup.js)
- Modules: camelCase describing function (fileCollector.js, importResolver.js)
- Documentation: kebab-case descriptive names in docs/ folder

**Dependency Relationships**:
- `index.js` → Commander.js + all src/commands/* modules
- `src/commands/*` → Core processing modules (fileProcessor, etc.)
- `src/fileProcessor.js` → fileCollector.js + importResolver.js
- `src/importResolver.js` → Node.js fs, path, os modules only
- All modules use Node.js standard library except Commander.js CLI framework

**Module Exports**:
- Each src/ module exports specific functions via module.exports
- `index.js` re-exports all core functions for backwards compatibility
- Command modules export single command handler functions
