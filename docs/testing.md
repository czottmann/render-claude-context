<!-- Generated: 2025-07-12 20:30:00 UTC -->

# Testing

The CLI tool provides module exports for testing core functions and uses npm scripts for end-to-end testing. Testing approach focuses on validating file collection, import resolution, and output generation with real file system operations.

## Test Types

**Unit Testing** - Core functions exported in `index.js` (line 113):
```javascript
module.exports = { collectClaudeFiles, resolveImports, processFiles };
```

**Integration Testing** - End-to-end CLI testing via npm script
**Manual Testing** - Direct execution to verify output format and import resolution

## Running Tests

**NPM Test Command** - `npm run test` (`package.json` line 11)
- Executes `node index.js` for end-to-end testing
- Tests actual file system traversal and processing

**Direct Testing** - `node index.js` or `./index.js`
- Tests from current working directory
- Validates complete pipeline with real CLAUDE.md files

**Module Testing** - Import functions for unit testing:
```javascript
const { collectClaudeFiles, resolveImports, processFiles } = require('./index.js');
```

**Expected Output Format**:
- Processed content in reverse collection order
- HTML comments as separators: `<!-- filepath -->`
- No file names in main content output
- `~/.claude/CLAUDE.md` content appears first

## Reference

**Test File Organization**:
- Core functions available via module.exports (`index.js` line 113)
- No separate test directory - testing via direct execution
- Manual validation using sample CLAUDE.md files

**Build System Test Targets**:
- `npm run test` - Primary test execution
- `npm run build` - Alternative test method (same command)

**Testing Scenarios**:
- File collection from nested directories
- Import resolution with relative and absolute paths
- Circular import prevention
- Non-existent file handling
- Tilde expansion for home directory paths
- Error handling for unreadable files