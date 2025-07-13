<!-- Generated: 2025-07-13 00:00:00 UTC -->

# Testing

The CLI tool provides comprehensive module exports for unit testing core functions and uses npm scripts for integration testing. Testing approach focuses on validating the hierarchical file collection system, recursive import resolution, and context generation with real file system operations. The modular architecture enables both component-level testing and end-to-end validation.

Testing is primarily manual and functional, leveraging the tool's modular structure where each core module (`src/fileCollector.js`, `src/importResolver.js`, `src/fileProcessor.js`) exports specific functions that can be tested independently. The CLI tool itself serves as the integration test, demonstrating complete workflow functionality from file discovery through processed output generation.

## Test Types

**Unit Testing** - Core modules export functions for isolated testing:

**File Collection** (`src/fileCollector.js` lines 30-32):
```javascript
module.exports = { collectClaudeFiles };
```

**Import Resolution** (`src/importResolver.js` lines 42-44):
```javascript
module.exports = { resolveImports };
```

**File Processing** (`src/fileProcessor.js` lines 103-110):
```javascript
module.exports = {
  processFiles, generateContextContent, generateContextContentForFile,
  writeToFile, getOutputPath, handleOriginMode
};
```

**Main Module Re-exports** (`index.js` lines 70-75):
```javascript
module.exports = {
  // Re-export functions from modules for backwards compatibility
  ...require("./src/fileCollector"),
  ...require("./src/importResolver"), 
  ...require("./src/fileProcessor"),
};
```

**Integration Testing** - CLI command testing via npm scripts and direct execution
**Manual Testing** - Command validation with real CLAUDE.md files and import scenarios

## Running Tests

**NPM Test Command** (`package.json` line 11):
```bash
npm run test
# Executes: node index.js
# Output: CLI help documentation showing all available commands
```

**Direct CLI Testing** - Test individual commands:
```bash
# Test file collection and processing
node index.js create --output-folder project --filename test-output.md

# Test setup/teardown functionality  
node index.js setup --filename CLAUDE-derived.md
node index.js teardown --filename CLAUDE-derived.md

# Test cleanup functionality
node index.js cleanup --output-folder origin --filename CLAUDE-derived.md
```

**Unit Function Testing** - Test core functions directly:
```bash
# Test file collection
node -e "
const { collectClaudeFiles } = require('./index.js');
const files = collectClaudeFiles(process.cwd(), require('os').homedir());
console.log('Files found:', files);
"

# Test import resolution
node -e "
const { resolveImports } = require('./index.js');
const content = '@~/example.md and @./local.md';
const result = resolveImports(content, process.cwd());
console.log('Resolved:', result);
"

# Test file processing
node -e "
const { generateContextContent } = require('./index.js');
const output = generateContextContent();
console.log('Generated content length:', output.length);
"
```

**Expected Output Format**:
- Files processed in reverse collection order (`src/fileProcessor.js` lines 31-32)
- HTML comment separators: `<!-- /absolute/file/path -->` (`src/fileProcessor.js` lines 38-40)
- Content from `~/.claude/CLAUDE.md` appears first in output
- Resolved imports replace `@` syntax with actual file contents
- Circular imports prevented via Set tracking (`src/importResolver.js` lines 8, 22-24)

## Reference

**Test File Organization**:
- No dedicated test directory - manual testing via CLI and Node.js REPL
- Core functions exported from individual modules in `src/` directory
- Backwards compatibility exports in main `index.js` (lines 70-75)
- Validation utilities in `src/utils/validation.js` (lines 9-11)

**Module Exports Available for Testing**:

**File Collection** (`src/fileCollector.js`):
- `collectClaudeFiles(startDir, homeDir)` - Walks directory tree collecting CLAUDE.md files (lines 5-28)

**Import Resolution** (`src/importResolver.js`):
- `resolveImports(content, fileDir)` - Processes `@` imports recursively (lines 5-40)

**File Processing** (`src/fileProcessor.js`):
- `processFiles(files)` - Processes array of file paths (lines 7-23)
- `generateContextContent(startDir)` - Complete pipeline for context generation (lines 25-46)
- `generateContextContentForFile(claudeFile)` - Process single file (lines 48-52)
- `writeToFile(content, outputPath)` - Write content with directory creation (lines 54-60)
- `getOutputPath(outputFolder, filename, startDir)` - Resolve output path (lines 62-76)
- `handleOriginMode(filename, startDir)` - Origin mode processing (lines 78-101)

**Command Modules** (`src/commands/`):
- `create.js` - Context file generation command (exported as function)
- `setup.js` - Gemini integration setup command
- `teardown.js` - Gemini integration removal command
- `cleanup.js` - Generated file cleanup command
- `help.js` - Help documentation command

**Testing Scenarios**:
- Directory traversal from current directory to home directory (`src/fileCollector.js` lines 9-19)
- Import resolution with tilde expansion `~/` (`src/importResolver.js` lines 15-16)
- Relative path resolution (`src/importResolver.js` lines 17-18)
- Circular import prevention (`src/importResolver.js` lines 22-24)
- Non-existent file handling (`src/importResolver.js` lines 22-24, 33-35)
- Error handling for unreadable files (`src/fileProcessor.js` lines 16-19)
- Output folder modes: global, project, origin (`src/fileProcessor.js` lines 65-75)
- Filename validation preventing CLAUDE.md overwrite (`src/utils/validation.js` lines 1-7)