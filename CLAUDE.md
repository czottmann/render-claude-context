# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Node.js CLI tool that processes CLAUDE.md files with a hierarchical collection system. The tool walks up the directory tree from the current working directory to the user's home folder, collecting all `CLAUDE.md` files and processing them with file import resolution.

## Key Files

- **Main Entry Point**: `index.js` - CLI tool implementation with shebang for direct execution
- **Configuration**: `package.json` - Package configuration with bin entry for global installation
- **Specification**: `SPEC.md` - Complete project requirements and behavior specification
- **Documentation**: `docs/` - Comprehensive documentation for development and usage

## Core Architecture

### File Processing System (index.js:7-30)
- **File Discovery**: `collectClaudeFiles()` walks up directory tree from current location to `~`
- **Import Resolution**: `resolveImports()` processes `@` imports with tilde expansion support
- **Recursive Processing**: Imported files can contain their own imports, creating dependency chains
- **Output Generation**: Outputs processed content in reverse order with HTML comment separators

### Import Syntax (index.js:32-67)
- Format: `@` followed immediately by a file path
- Tilde expansion: `~/path` resolves to home directory (index.js:42-46)
- Path resolution: Relative to the file containing the import statement
- Non-file paths after `@` are left unchanged
- Circular import protection via Set tracking (index.js:35)

### Output Format (index.js:87-107)
- Files processed in reverse collection order
- Each file separated by HTML comments containing file paths: `<!-- /path/to/file -->`
- No duplicate file names in output
- `~/.claude/CLAUDE.md` appears first in output

## Development Commands

**Run the tool**: `node index.js`
**Install globally**: `npm install -g .` then use `claude-static-context-dump`
**Test import resolution**: Check output for resolved `@` imports vs literal text

## Key Implementation Details

**File Location**: `SPEC.md` contains the complete project specification

**Processing Rules**:
1. Start from current directory, walk up to home directory
2. Collect all `CLAUDE.md` files found  
3. Process each file to resolve `@` imports recursively
4. Output in reverse order with HTML comment separators

**Import Resolution (index.js:38-63)**:
- `@path/to/file.md` → contents of file.md replace the import
- `@~/config/file.md` → tilde expanded to home directory  
- `@invalid-path` → remains as literal text if path doesn't exist
- Imports resolved relative to containing file's directory
- Circular imports prevented with Set tracking

This tool is designed for hierarchical configuration management where higher-level directories can override or extend lower-level configurations through the CLAUDE.md file system.