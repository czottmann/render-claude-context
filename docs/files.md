<!-- Generated: 2025-07-21T19:27:18+02:00 -->

# Files Catalog

This Node.js CLI tool uses a modular architecture to collect CLAUDE.md files from directory hierarchies, resolve @-imports recursively, and generate processed context files. The codebase separates concerns across logical modules with a Commander.js-based CLI interface.

The project follows standard Node.js conventions with source files in `src/`, commands in `src/commands/`, utilities in `src/utils/`, and documentation in `docs/`. Generated files are created alongside originals or in configured global folders based on output mode selection.

File organization emphasizes separation between CLI orchestration (index.js), core processing modules (src/), and command implementations that handle different workflow scenarios for context file generation and cleanup.

## Core Source Files

**Main Entry Point** - `index.js` (lines 1-196)
- CLI application setup with Commander.js framework (lines 8-14)
- Command registration with options and validation (lines 45-177)  
- Module re-exports for backwards compatibility (lines 190-195)
- Executable with shebang for direct invocation (line 1)

**File Collection** - `src/fileCollector.js` (lines 23-48)
- Directory tree walking from current to home directory (lines 28-39)
- CLAUDE.md file discovery with existence checking (lines 29-31)
- Global ~/.claude/CLAUDE.md inclusion (lines 42-45)

**Import Resolution** - `src/importResolver.js` (lines 48-93)
- @-path import regex processing with tilde expansion (lines 49-92)
- Recursive import resolution with circular dependency protection (lines 51-90)
- Front matter stripping for Markdown files (lines 28-33)

**File Processing** - `src/fileProcessor.js` (lines 18-259)
- Content generation with reversed file order (lines 113-142)
- Command collection from ~/.claude/commands/ (lines 42-103)
- Multiple output modes: origin, global, project (lines 180-250)
- HTML comment separators for file boundaries (lines 125-131)

## Platform Implementation

**Create Command** - `src/commands/create.js` (lines 25-60)
- Context file generation with import resolution
- Output mode handling (origin/global/project)
- Target-specific global folder configuration
- Command inclusion/exclusion control

**Cleanup Command** - `src/commands/cleanup.js`
- Generated file removal from filesystem
- Multiple output mode cleanup support
- Target-aware file location resolution

**Setup/Teardown Commands** - `src/commands/setup.js`, `src/commands/teardown.js`
- AI tool configuration management
- Context file auto-loading registration
- Target-specific configuration handling

**Utility Modules** - `src/utils/`
- `validation.js` - Filename validation and sanitization
- `targetValidator.js` - AI tool target validation (gemini/opencode)
- `targets.js` - Target configuration and global folder mapping

## Build System

**Package Configuration** - `package.json` (lines 1-25)
- CLI binary definition with executable path (lines 6-8)
- Commander.js dependency for CLI framework (lines 22-24)
- Build and test script definitions (lines 9-12)

**Dependencies** - `node_modules/`, `package-lock.json`
- Commander.js v14.0.0 for CLI argument parsing
- Standard Node.js modules (fs, path, os) for file operations

## Configuration

**Project Instructions** - `CLAUDE.md` (lines 1-100)
- AI assistant guidance and project overview
- Core architecture documentation with file references
- Development workflow and command examples

**Generated Files** - `CLAUDE-derived.md`, context files
- Processed output with resolved imports and HTML separators
- Location varies by output mode (origin/global/project)
- Automatic cleanup support through cleanup command

**Settings Files** - `.claude/settings.local.json`
- Local Claude Code configuration overrides
- Git-tracked for project-specific settings

## Documentation

**User Documentation** - `README.md`
- Installation and usage instructions
- Command examples and workflow guidance
- Integration with AI tools (Gemini, OpenCode)

**Architecture Documentation** - `docs/` directory
- `architecture.md` - System design and component relationships
- `build-system.md` - Build configuration and commands  
- `deployment.md` - Package distribution and installation
- `development.md` - Code patterns and development workflow
- `testing.md` - Test approach and validation methods
- `project-overview.md` - High-level project description

**Change History** - `CHANGELOG.md`
- Version history and feature additions
- Breaking changes and upgrade notes

**Legal** - `LICENSE.md`
- MIT license terms and conditions

## Reference

**File Organization Patterns**:
- Commands in `src/commands/` with descriptive names
- Utilities in `src/utils/` for shared functionality  
- Documentation in `docs/` with topic-based organization
- Main logic in `src/` root for core processing modules

**Naming Conventions**:
- camelCase for JavaScript functions and variables
- kebab-case for CLI command names and file names
- Descriptive module names matching their primary function

**Dependency Relationships**:
- `index.js` imports all command modules and utilities
- Commands depend on core modules (fileProcessor, etc.)
- Core modules have minimal dependencies (Node.js built-ins only)
- Utilities provide validation and configuration logic
- Generated files reference originals through HTML comments