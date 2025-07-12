<!-- Generated: 2025-07-12 20:30:00 UTC -->

# Files Catalog

This project maintains a minimal file structure with a single-file CLI implementation and essential configuration files. The architecture prioritizes simplicity and maintainability with all core functionality contained in `index.js` and supporting metadata in standard npm configuration files.

The file organization follows Node.js CLI conventions with package.json for npm integration, a shebang-enabled main script, and documentation files for specification and usage context. No external dependencies or complex build processes are required.

## Core Source Files

**index.js** - Complete CLI implementation with file collection, import resolution, and output generation
- Lines 7-30: Directory traversal and CLAUDE.md file collection
- Lines 32-67: Recursive import resolution with `@` syntax processing
- Lines 69-85: File processing pipeline with error handling
- Lines 87-111: Main execution function and CLI entry point
- Line 113: Module exports for testing (collectClaudeFiles, resolveImports, processFiles)

## Platform Implementation

**package.json** - NPM package configuration and CLI binary setup
- Lines 6-8: Binary configuration for global CLI installation
- Lines 9-12: NPM scripts for build and test operations
- Lines 1-5, 13-16: Package metadata and configuration

**Shebang Integration** - Cross-platform execution via Node.js shebang (`index.js` line 1)

## Build System

**package.json** - Primary build configuration with npm scripts
- Line 10: Build script executing main tool
- Line 11: Test script (same as build for this tool)
- No external build tools or dependencies required

## Configuration

**SPEC.md** - Complete project specification and functional requirements
- Processing rules for file collection and import resolution
- Output format specifications and error handling requirements

**CLAUDE.md** - Project context and instructions for Claude Code
- Architecture overview and key specification details
- Import syntax documentation and processing rules

**docs/*.md** - Generated documentation files (this catalog and others)
- Comprehensive reference for LLM optimization and development

## Reference

**File Organization Patterns**:
- Single-file CLI architecture for simplicity
- Standard npm package structure with package.json
- Documentation separated from implementation code

**Naming Conventions**:
- Main script: `index.js` (npm convention)
- Package config: `package.json` (npm standard)
- Documentation: UPPERCASE.md for root files, lowercase for docs/

**Dependency Relationships**:
- `index.js` → Node.js built-in modules only (fs, path, os)
- `package.json` → references `index.js` as main and binary
- Documentation files → reference implementation in `index.js`
- No external npm dependencies or complex build chains