<!-- Generated: 2025-07-13 10:45:00 UTC -->

# Development

The codebase follows Node.js conventions with a modular architecture and comprehensive CLI design. The system emphasizes separation of concerns through dedicated modules for file collection, processing, import resolution, and command handling. Development workflow centers around Commander.js CLI structure with functional programming patterns and robust error handling.

## Code Style

**Module Organization** - Clear separation of concerns with dedicated modules in `src/` directory
**Error Handling** - Try-catch blocks with graceful degradation and user-friendly error messages
**Variable Naming** - Descriptive names following camelCase: `collectClaudeFiles`, `resolveImports`, `generateContextContent`
**Function Structure** - Pure functions with single responsibilities and explicit parameter handling

**Commander.js CLI Pattern** - `index.js` (lines 11-64):
```javascript
const program = new Command();
program
  .command("create")
  .description("Generate processed context files with resolved imports")
  .option("--output-folder <mode>", "Output folder mode", "origin")
  .option("--filename <name>", "Output filename", validateFilename, "CLAUDE-derived.md")
  .action(createCommand);
```

**Import Resolution Pattern** - `src/importResolver.js` (lines 5-40):
```javascript
const importRegex = /@([^\s\n]+)/g;
function processImports(text, currentDir) {
  return text.replace(importRegex, (match, importPath) => {
    // Handle tilde expansion for home directory
    if (importPath.startsWith("~/")) {
      fullPath = path.join(os.homedir(), importPath.slice(2));
    } else {
      fullPath = path.resolve(currentDir, importPath);
    }
    // Recursively process imports in the imported file
    return processImports(importedContent, importedDir);
  });
}
```

**Directory Traversal Pattern** - `src/fileCollector.js` (lines 5-28):
```javascript
function collectClaudeFiles(startDir, homeDir) {
  const files = [];
  let currentDir = startDir;
  while (currentDir !== path.dirname(currentDir)) {
    const claudeFile = path.join(currentDir, "CLAUDE.md");
    if (fs.existsSync(claudeFile)) {
      files.push(claudeFile);
    }
    if (currentDir === homeDir) break;
    currentDir = path.dirname(currentDir);
  }
}
```

## Common Patterns

**Command Module Structure** - All commands follow consistent pattern (`src/commands/*.js`):
```javascript
function commandName(options) {
  try {
    // Command logic with options processing
    console.log("Success message with file paths");
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}
module.exports = commandName;
```

**Circular Import Prevention** - Set-based tracking (`src/importResolver.js` lines 8, 22-24, 27):
```javascript
const resolved = new Set();
if (!fs.existsSync(fullPath) || resolved.has(fullPath)) {
  return match; // Keep original if file doesn't exist or already processed
}
resolved.add(fullPath);
```

**JSON Settings Management** - Pattern used in setup/teardown commands (`src/commands/setup.js` lines 14-19):
```javascript
// Ensure contextFileName is always an array
if (!settings.contextFileName) {
  settings.contextFileName = [];
} else if (typeof settings.contextFileName === "string") {
  settings.contextFileName = [settings.contextFileName];
}
```

**Output Path Resolution** - Mode-based path generation (`src/fileProcessor.js` lines 62-76):
```javascript
function getOutputPath(outputFolder, filename, startDir = process.cwd()) {
  switch (outputFolder) {
    case "global": return path.join(homeDir, ".gemini", filename);
    case "project": return path.join(startDir, filename);
    case "origin": return null; // Handled differently
  }
}
```

**Validation Pattern** - Input sanitization (`src/utils/validation.js` lines 1-7):
```javascript
function validateFilename(filename) {
  if (filename === "CLAUDE.md") {
    console.error("Error: Cannot use 'CLAUDE.md' as output filename");
    process.exit(1);
  }
  return filename;
}
```

## Workflows

**Adding New Commands**:
1. Create command file in `src/commands/` following the standard pattern
2. Import and register command in `index.js` (lines 21-61)
3. Add command help text in `src/commands/help.js` (lines 4-79)
4. Test command functionality with various options
5. Update documentation if needed

**Modifying Core Processing**:
1. File collection logic: `src/fileCollector.js`
2. Import resolution: `src/importResolver.js` (regex at line 6)
3. File processing: `src/fileProcessor.js`
4. Output generation: `src/fileProcessor.js` (lines 25-46)

**Debugging File Processing Issues**:
1. Check file collection in `src/fileCollector.js` - verify CLAUDE.md files found
2. Verify import resolution in `src/importResolver.js` - test regex pattern matching
3. Test path resolution with tilde expansion (lines 15-16)
4. Check output mode handling in `src/fileProcessor.js` (lines 78-101)

**Adding New Validation Rules**:
1. Extend `src/utils/validation.js` with new validation functions
2. Import validation in `index.js` and apply to command options
3. Add appropriate error messages and exit codes

## Reference

**File Organization**:
- **Main Entry**: `index.js` - CLI setup with Commander.js and command registration
- **Core Modules**: `src/fileCollector.js`, `src/fileProcessor.js`, `src/importResolver.js`
- **Commands**: `src/commands/*.js` - Individual command implementations
- **Utilities**: `src/utils/validation.js` - Input validation and sanitization
- **Configuration**: `package.json` - Package config with bin entry for global installation

**Module Dependencies**:
- `src/fileProcessor.js` depends on `src/fileCollector.js` and `src/importResolver.js`
- Command files import from `src/fileProcessor.js` and `src/fileCollector.js` as needed
- `index.js` imports all command modules and utilities

**Naming Conventions**:
- **Files**: kebab-case for multi-word names (`file-collector.js` style avoided, camelCase used)
- **Functions**: camelCase (`collectClaudeFiles`, `validateFilename`)
- **Variables**: camelCase (`settingsPath`, `claudeFiles`, `processedContents`)
- **Constants**: camelCase (`importRegex`, `globalClaudeFile`)

**Error Handling Patterns**:
- **File Operations**: Try-catch with graceful fallback (`src/importResolver.js` lines 26-35)
- **JSON Parsing**: Explicit error handling (`src/commands/teardown.js` lines 15-20)
- **Command Failures**: Error logging with process.exit(1) pattern
- **Missing Files**: Existential checks before operations (`fs.existsSync()` usage)

**Common Issues**:
- **Path Resolution**: Cross-platform compatibility handled by Node.js `path` module
- **Circular Imports**: Prevented by Set tracking in `src/importResolver.js` (line 8)
- **File Permissions**: Handled with try-catch blocks in all file operations
- **JSON Corruption**: Explicit parsing with error handling in settings operations
- **Command Options**: Default values and validation applied through Commander.js

**Testing Approach**:
- **Manual Testing**: Run commands with various option combinations
- **Integration Testing**: Test full workflows (create → setup → teardown → cleanup)
- **Path Testing**: Verify cross-platform path handling
- **Edge Case Testing**: Test with missing files, invalid paths, circular imports