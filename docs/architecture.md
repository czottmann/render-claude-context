<!-- Generated: 2025-07-21T19:27:18+02:00 -->

# Architecture

This system implements a modular hierarchical file processing pipeline for collecting and processing CLAUDE.md files with import resolution. The architecture follows a command pattern with specialized processors for different output modes and recursive content resolution.

The core data flow walks up the directory tree from the current working directory to the home directory, collecting CLAUDE.md files, recursively resolving @path import statements, and generating context files with resolved content. The system supports multiple output modes (origin, global, project) and integrates with AI tool configuration systems for automated context loading. Commands from ~/.claude/commands/ are automatically collected and inserted after the global configuration file.

## Component Map

**CLI Entry Point** - index.js (lines 21-180)
- Commander.js program setup with name, description, version, and help text (24-43)
- Command registration with options and validation: create (45-85), cleanup (87-121), setup (123-149), teardown (151-177)
- Module re-exports for backwards compatibility via require() spreading (190-195)

**File Collection System** - src/fileCollector.js (lines 23-48)
- `collectClaudeFiles()` walks up directory tree using path.dirname() iteration (28-39)
- CLAUDE.md detection with fs.existsSync() and file path collection (29-32)
- Home directory boundary check to prevent infinite traversal (35-37)
- Global ~/.claude/CLAUDE.md inclusion as final step (41-45)

**Import Resolution Engine** - src/importResolver.js (lines 48-93)
- `resolveImports()` uses regex `/@([^\s\n]+)/g` for @path pattern matching (49)
- Internal `processImports()` function with recursive import resolution (61-90)
- Tilde expansion with os.homedir() for ~/ paths (66-67)
- Relative path resolution using path.resolve() against current directory (69-71)
- Circular dependency protection via Set tracking (51, 74-76, 79)
- `stripFrontMatter()` removes YAML front matter with regex `/^---.+?---\n/gs` (28-32)

**File Processing Pipeline** - src/fileProcessor.js (lines 114-251)
- `generateContextContent()` orchestrates collection, processing, and content assembly (114-143)
- `processFiles()` reads files with fs.readFileSync() and resolves imports (18-34)
- `collectCommands()` scans ~/.claude/commands/ directory for .md files with symlink detection (42-103)
- Command reordering logic: commands inserted after first file (global ~/.claude/CLAUDE.md) at line 137-139
- Output path resolution: `getOutputPath()` with mode switching and tilde expansion (181-200)
- Origin mode handling: `handleOriginMode()` creates individual files with special global routing (213-251)

**Command Implementations** - src/commands/*.js
- create.js (25-50): Context file generation with mutual exclusion validation for --target and --global-folder options
- cleanup.js: Generated file removal across all output modes (origin, global, project)
- setup.js: AI tool configuration file integration for auto-loading context files
- teardown.js: Configuration removal from AI tool settings

**Utility Modules** - src/utils/*.js
- validation.js: `validateFilename()` with security checks for filesystem safety
- targetValidator.js: `validateTarget()` for supported AI tool names (gemini, opencode)
- targets.js: `getTargetGlobalFolder()` and `getDefaultTarget()` for AI tool configuration mapping

## Key Files

**Main CLI Setup** - index.js:21-43
- Commander.js program initialization with name "render-claude-context" (25)
- Program description explaining hierarchical file collection and import resolution (26-27)
- Version setting and help text with usage examples (43, 29-41)

**Directory Traversal** - src/fileCollector.js:28-39
- While loop condition `currentDir !== path.dirname(currentDir)` prevents infinite traversal (28)
- CLAUDE.md detection using `path.join(currentDir, "CLAUDE.md")` and `fs.existsSync()` (29-31)
- Home directory boundary check with explicit comparison `currentDir === homeDir` (35-37)
- Directory advancement with `currentDir = path.dirname(currentDir)` (38)

**Import Processing** - src/importResolver.js:61-90
- Import pattern matching with `/@([^\s\n]+)/g` regex capturing non-whitespace paths (49)
- Tilde expansion logic: `importPath.startsWith("~/")` → `path.join(os.homedir(), importPath.slice(2))` (66-67)
- Relative path resolution: `path.resolve(currentDir, importPath)` against file directory (70)
- File existence and circular import checks before processing (74-75)
- Recursive processing with directory context: `processImports(strippedContent, importedDir)` (85)

**Content Generation** - src/fileProcessor.js:114-143
- File collection using `collectClaudeFiles(startDir, homeDir)` (116)
- Content processing with `processFiles(claudeFiles)` (117)
- Reverse order processing: `processedContents.reverse()` for higher-level priority (120)
- Commands collection: `collectCommands()` called once and cached (124)
- HTML comment insertion logic: `i > 0` check prevents comment before first file (130-132)
- Command insertion after first file: `i === 0 && commandsContent` (137-139)

**Command File Processing** - src/fileProcessor.js:42-103
- Commands directory detection with symlink support using `fs.lstatSync()` (52-55)
- File filtering: `.filter(file => file.endsWith('.md')).sort()` (60-61)
- Per-file processing: `stripFrontMatter()` → `resolveImports()` → content object creation (67-68)
- Content assembly with "# Commands" header and HTML comments (82, 87-94)
- Error handling: null returns for missing directory or processing failures (49, 77-78, 100-102)

**Output Path Resolution** - src/fileProcessor.js:181-200
- Mode switching with cases: global, project, origin (189-196)
- Tilde expansion: `globalFolder.startsWith("~/")` → `path.join(homeDir, globalFolder.slice(2))` (185-187)
- Global mode: `path.join(expandedGlobalFolder, filename)` (191)
- Project mode: `path.join(startDir, filename)` (193)
- Origin mode: returns null for special handling (195)
- Error throwing for unknown modes (198)

## Data Flow

**Collection Phase**: `collectClaudeFiles()` starts from `process.cwd()`, walks up directory tree using `path.dirname()` iteration until reaching home directory boundary, collecting CLAUDE.md file paths into array, then appends `~/.claude/CLAUDE.md` if exists

**Processing Phase**: `processFiles()` iterates through collected files, reads each with `fs.readFileSync(file, "utf8")`, calls `resolveImports(content, fileDir)` with containing directory for relative path resolution, returns array of `{content, path}` objects

**Import Resolution**: `resolveImports()` uses `/@([^\s\n]+)/g` regex to find @path patterns, expands `~/` to `os.homedir()`, resolves relative paths with `path.resolve(currentDir, importPath)`, recursively processes imported files with `Set` tracking for circular dependency protection, strips YAML front matter before processing

**Content Assembly**: Files processed in reverse order via `processedContents.reverse()` (line 120) to prioritize higher-level configurations, HTML comments `<!-- /path/to/file -->` inserted between files except before first file (lines 130-132)

**Command Integration**: `collectCommands()` scans `~/.claude/commands/` for .md files, sorts alphabetically, processes each through `stripFrontMatter()` → `resolveImports()` pipeline, builds unified commands section with "# Commands" header, inserted after first file (global ~/.claude/CLAUDE.md) at lines 137-139

**Output Generation**: Mode-based routing - origin mode creates individual files via `handleOriginMode()` with special ~/.claude/CLAUDE.md routing to global folder, global/project modes use `getOutputPath()` for single file output. Commands only appended to files destined for global folder (lines 237-240).