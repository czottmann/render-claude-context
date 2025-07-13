<!-- Generated: 2025-07-13 17:02:15 UTC -->

# Architecture

## Overview

The claude-context-render CLI tool implements a modular hierarchical file processing architecture that walks up directory trees to collect CLAUDE.md configuration files, resolves embedded imports recursively, and generates processed context files. The system is designed around a clear separation of concerns with independent modules handling file discovery, import resolution, content processing, and command execution. The architecture supports multiple output modes (global, project, origin) and integrates with external systems like Gemini CLI through configuration file management.

The core data flow follows a pipeline pattern: file collection → import resolution → content processing → output generation, with each stage handled by specialized modules. The command system provides a clean interface for different operations while sharing the underlying file processing infrastructure.

## Component Map

**CLI Entry Point** - `/Users/czottmann/Code/misc/claude-static-context-dump/index.js` (lines 11-75)
- Main program setup with Commander.js integration
- Command registration and routing to specialized handlers
- Backwards compatibility exports from core modules

**File Collection System** - `/Users/czottmann/Code/misc/claude-static-context-dump/src/fileCollector.js` (lines 5-28)
- Directory tree traversal from current directory to home directory
- CLAUDE.md file discovery with special ~/.claude/CLAUDE.md handling
- Path resolution and file existence validation

**Import Resolution Engine** - `/Users/czottmann/Code/misc/claude-static-context-dump/src/importResolver.js` (lines 5-40)
- Recursive import processing with circular dependency protection
- Tilde expansion for home directory references (lines 15-16)
- Pattern matching and content replacement for @import syntax

**Content Processing Pipeline** - `/Users/czottmann/Code/misc/claude-static-context-dump/src/fileProcessor.js` (lines 7-110)
- File content orchestration with import resolution integration
- Multiple output mode handling (global, project, origin)
- HTML comment separation and reverse-order processing (lines 30-45)

**Command Implementation Layer** - `/Users/czottmann/Code/misc/claude-static-context-dump/src/commands/`
- Specialized command handlers for create, setup, teardown, cleanup operations
- Gemini CLI integration through ~/.gemini/settings.json manipulation
- File system operations with error handling and user feedback

**Validation and Utilities** - `/Users/czottmann/Code/misc/claude-static-context-dump/src/utils/validation.js`
- Input validation and security checks (prevent CLAUDE.md overwrite)
- Shared utility functions for common operations

## Key Files

**Core Processing Functions** - `/Users/czottmann/Code/misc/claude-static-context-dump/src/fileProcessor.js`
- `generateContextContent()` (lines 25-46): Main content generation pipeline
- `processFiles()` (lines 7-23): File reading and import resolution coordination
- `handleOriginMode()` (lines 78-101): Individual file processing for origin output mode
- `getOutputPath()` (lines 62-76): Output path calculation based on mode selection

**Import Resolution Logic** - `/Users/czottmann/Code/misc/claude-static-context-dump/src/importResolver.js`
- `resolveImports()` (lines 5-40): Recursive import processing with regex pattern matching
- `processImports()` (lines 10-37): Internal recursive function with circular dependency tracking
- Import pattern: `/@([^\s\n]+)/g` matches @filepath syntax (line 6)

**File Discovery Algorithm** - `/Users/czottmann/Code/misc/claude-static-context-dump/src/fileCollector.js`
- `collectClaudeFiles()` (lines 5-28): Directory traversal with home directory boundary
- Special case handling for ~/.claude/CLAUDE.md global configuration (lines 21-25)

**Command Implementations** - `/Users/czottmann/Code/misc/claude-static-context-dump/src/commands/`
- `create.js`: Content generation with output mode branching (lines 8-25)
- `setup.js`: Gemini settings.json management with array handling (lines 5-43)
- `teardown.js`: Settings cleanup with array manipulation (lines 5-54)
- `cleanup.js`: File system cleanup with mode-aware path resolution (lines 7-51)

## Data Flow

**File Collection Flow** - `index.js:main()` → `fileCollector.js:collectClaudeFiles()`
1. Start from current working directory (`process.cwd()`)
2. Walk up directory tree using `path.dirname()` (fileCollector.js:18)
3. Check for CLAUDE.md existence at each level (fileCollector.js:10-13)
4. Stop at home directory boundary (fileCollector.js:15-17)
5. Add ~/.claude/CLAUDE.md if present (fileCollector.js:21-25)

**Import Resolution Flow** - `fileProcessor.js:processFiles()` → `importResolver.js:resolveImports()`
1. Read file content with `fs.readFileSync()` (fileProcessor.js:12)
2. Extract file directory for relative path resolution (fileProcessor.js:13)
3. Apply regex pattern matching for @import syntax (importResolver.js:6, 11)
4. Resolve paths with tilde expansion support (importResolver.js:15-19)
5. Recursive processing with circular dependency tracking (importResolver.js:27-32)
6. Content replacement preserving original format (importResolver.js:11-36)

**Content Generation Flow** - `fileProcessor.js:generateContextContent()`
1. Collect files using `collectClaudeFiles()` (fileProcessor.js:27)
2. Process each file through `processFiles()` (fileProcessor.js:28)
3. Reverse order for hierarchical precedence (fileProcessor.js:31)
4. Add HTML comment separators between files (fileProcessor.js:38-40)
5. Concatenate all processed content (fileProcessor.js:42)

**Output Mode Handling** - `commands/create.js:createCommand()`
- **Origin Mode**: Individual file processing via `handleOriginMode()` (create.js:10-13)
  - Process each CLAUDE.md independently (fileProcessor.js:83-98)
  - Special ~/.claude/ → ~/.gemini/ mapping (fileProcessor.js:88-94)
- **Global/Project Mode**: Single collated file via `generateContextContent()` (create.js:15-19)
  - Unified processing pipeline with reverse-order output
  - Single output path calculation (fileProcessor.js:62-76)

**Gemini Integration Flow** - `commands/setup.js` and `commands/teardown.js`
1. Read ~/.gemini/settings.json configuration (setup.js:7-12, teardown.js:7-20)
2. Ensure contextFileName array format (setup.js:14-19, teardown.js:27-35)
3. Add/remove filename from array (setup.js:22-23, teardown.js:37-39)
4. Write updated configuration back to filesystem (setup.js:30, teardown.js:41)