<!-- Generated: 2025-07-12 20:30:00 UTC -->

# Architecture

The CLI tool implements a three-phase processing pipeline: hierarchical file collection, recursive import resolution, and ordered output generation. The architecture prioritizes simplicity and reliability using only Node.js built-in modules, with robust error handling for file system operations.

The system processes files in collection order but outputs in reverse order, ensuring that the global `~/.claude/CLAUDE.md` appears first in output. Import resolution supports both relative paths and tilde expansion for home directory references, with circular import prevention through a resolved file set.

## Component Map

**File Collection System** - `collectClaudeFiles()` in `index.js` (lines 7-30)
- Directory traversal from current to home directory
- Special handling for `~/.claude/CLAUDE.md` global file

**Import Resolution Engine** - `resolveImports()` in `index.js` (lines 32-67)
- Recursive `@` import processing with regex matching
- Circular import prevention via Set tracking (line 35)
- Nested import support through recursive calls (line 59)

**File Processing Pipeline** - `processFiles()` in `index.js` (lines 69-85)
- Content reading with error handling
- Import resolution coordination per file

**Output Generator** - `main()` in `index.js` (lines 87-111)
- Reverse order processing (line 95)
- HTML comment separators between files (lines 101-102)

## Key Files

**Core Implementation** - `index.js`: Complete CLI tool in single file
**Module Exports** - `index.js` (line 113): Exports core functions for testing
**Entry Configuration** - `package.json` (lines 6-8): Binary and script definitions

## Data Flow

1. **Collection Phase**: `main()` → `collectClaudeFiles()` → Array of file paths
2. **Processing Phase**: `processFiles()` → `resolveImports()` per file → Processed content objects
3. **Import Resolution**: `@import` → `fs.readFileSync()` → Recursive `processImports()` calls
4. **Output Phase**: Reverse array → HTML comments + content → `process.stdout.write()`

**Error Handling** - Non-existent files preserved as literal text (`index.js` lines 49-50, 60-62)
**Circular Prevention** - Resolved Set prevents infinite recursion (`index.js` lines 35, 49, 54)