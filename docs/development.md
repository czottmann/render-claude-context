<!-- Generated: 2025-07-21T19:27:18+02:00 -->

# Development

The codebase follows Node.js conventions with a modular architecture built around Commander.js CLI framework. The system emphasizes separation of concerns through dedicated modules for file collection, import resolution, file processing, and command handling. Development workflow centers around functional programming patterns with comprehensive error handling and robust input validation across all operations.

The architecture supports hierarchical configuration management where CLAUDE.md files are collected from current directory up to home directory, processed for @-imports, and output in various modes. Core processing handles tilde expansion, circular dependency protection, and YAML front matter stripping to ensure clean context generation for AI tools.

## Code Style

**Module Organization** - Clear separation in `src/` directory with dedicated modules for specific concerns:
- File collection: `src/fileCollector.js`
- Import resolution: `src/importResolver.js`  
- File processing: `src/fileProcessor.js`
- Command implementations: `src/commands/*.js`
- Utility functions: `src/utils/*.js`

**JSDoc Documentation** - Comprehensive function documentation with parameters, returns, and examples (`src/fileProcessor.js` lines 12-17):
```javascript
/**
 * Processes an array of CLAUDE.md file paths, reading and resolving imports for each.
 * 
 * @param {string[]} files - Array of absolute file paths to CLAUDE.md files
 * @returns {Array<{content: string, path: string}>} Array of processed file objects
 */
function processFiles(files) {
```

**Error Handling Pattern** - Try-catch blocks with graceful degradation (`src/commands/create.js` lines 25-56):
```javascript
function createCommand(options) {
  try {
    // Validate mutual exclusion of --target and --global-folder
    if (options.target && options.globalFolder !== "~/.gemini/") {
      console.error("Error: --target and --global-folder options are mutually exclusive");
      process.exit(1);
    }
    // Rest of command logic...
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}
```

**Function Naming** - Descriptive camelCase with clear verb-noun patterns:
- `collectClaudeFiles()` - File discovery operations
- `resolveImports()` - Import processing operations  
- `generateContextContent()` - Content generation operations
- `validateFilename()` - Input validation operations

## Common Patterns

**Commander.js CLI Structure** - Consistent option definition and validation (`index.js` lines 45-85):
```javascript
program
  .command("create")
  .description(
    "Collect CLAUDE.md files from current directory up to ~/, resolve @-imports recursively, and write a context output file to specified location"
  )
  .option(
    "--output-folder <mode>",
    "Where to write output:\n- global (global folder (see below), one collated file)\n- project (cwd, one collated file)\n- origin (single files, next to each found CLAUDE.md file)",
    "origin"
  )
  .option(
    "--target <name>",
    "Target AI tool (crush, gemini, opencode) - sets global folder automatically",
    validateTarget,
    "gemini"
  )
  .option(
    "--filename <name>",
    "Name of output file",
    validateFilename,
    "CLAUDE-derived.md"
  )
  .option(
    "--no-add-commands",
    "Skip appending commands from ~/.claude/commands/ directory"
  )
  .action(createCommand);
```

**Import Resolution with Regex** - Pattern matching for @-imports with tilde expansion (`src/importResolver.js` lines 48-93):
```javascript
function resolveImports(content, fileDir) {
  const importRegex = /@([^\s\n]+)/g;
  let result = content;
  const resolved = new Set(); // Prevent circular imports

  function processImports(text, currentDir) {
    return text.replace(importRegex, (match, importPath) => {
      let fullPath;

      // Handle tilde expansion for home directory (~/)
      if (importPath.startsWith("~/")) {
        fullPath = path.join(os.homedir(), importPath.slice(2));
      } else {
        // Resolve relative paths against current directory
        fullPath = path.resolve(currentDir, importPath);
      }

      // Skip if file doesn't exist or already processed (circular import protection)
      if (!fs.existsSync(fullPath) || resolved.has(fullPath)) {
        return match; // Keep original @path if file doesn't exist or already processed
      }

      try {
        resolved.add(fullPath);
        const importedContent = fs.readFileSync(fullPath, "utf8");
        const importedDir = path.dirname(fullPath);

        // Strip front matter and recursively process imports in the imported file
        const strippedContent = stripFrontMatter(importedContent);
        return processImports(strippedContent, importedDir);
      } catch (error) {
        return match; // Keep original @path if read fails
      }
    });
  }

  return processImports(result, fileDir);
}
```

**Directory Walking Pattern** - Hierarchical traversal with boundary checks (`src/fileCollector.js` lines 23-48):
```javascript
function collectClaudeFiles(startDir, homeDir) {
  const files = [];
  let currentDir = startDir;

  // Walk up directory tree from startDir to root
  while (currentDir !== path.dirname(currentDir)) {
    const claudeFile = path.join(currentDir, "CLAUDE.md");
    if (fs.existsSync(claudeFile)) {
      files.push(claudeFile);
    }

    // Stop when we reach the home directory
    if (currentDir === homeDir) {
      break;
    }
    currentDir = path.dirname(currentDir);
  }

  // Add global CLAUDE.md from ~/.claude/ if it exists
  const globalClaudeFile = path.join(homeDir, ".claude", "CLAUDE.md");
  if (fs.existsSync(globalClaudeFile)) {
    files.push(globalClaudeFile);
  }

  return files;
}
```

**Circular Import Prevention** - Set-based tracking with early return (`src/importResolver.js` lines 51, 104-110):
```javascript
const resolved = new Set(); // Prevent circular imports

// Inside processImports function:
if (!fs.existsSync(fullPath) || resolved.has(fullPath)) {
  return match; // Keep original @path if file doesn't exist or already processed
}

try {
  resolved.add(fullPath);
  const importedContent = fs.readFileSync(fullPath, "utf8");
  // ... process content
} catch (error) {
  return match; // Keep original @path if read fails
}
```

**Front Matter Stripping** - YAML front matter removal with regex (`src/importResolver.js` lines 28-33):
```javascript
function stripFrontMatter(content) {
  // Match YAML front matter at the start of the file
  const yamlFrontMatterRegex = /^---.+?---\n/gs;
  
  return content.replace(yamlFrontMatterRegex, "");
}
```

**Output Mode Handling** - Path resolution based on output folder mode (`src/fileProcessor.js` lines 181-199):
```javascript
function getOutputPath(outputFolder, filename, startDir = process.cwd(), globalFolder = "~/.gemini/") {
  const homeDir = os.homedir();
  
  // Handle tilde expansion for globalFolder
  const expandedGlobalFolder = globalFolder.startsWith("~/") 
    ? path.join(homeDir, globalFolder.slice(2))
    : globalFolder;

  switch (outputFolder) {
    case "global":
      return path.join(expandedGlobalFolder, filename);
    case "project":
      return path.join(startDir, filename);
    case "origin":
      // For origin mode, we'll handle multiple files differently
      return null;
    default:
      throw new Error(`Unknown output folder mode: ${outputFolder}`);
  }
}
```

**Target Configuration System** - Centralized configuration for different AI tools (`src/utils/targets.js` lines 13-33):
```javascript
const TARGET_CONFIGS = {
  gemini: {
    name: "Gemini",
    settingsPath: path.join(os.homedir(), ".gemini", "settings.json"),
    contextKey: "contextFileName",
    description: "Google Gemini CLI",
    globalFolder: "~/.gemini/",
  },
  opencode: {
    name: "opencode",
    settingsPath: path.join(
      os.homedir(),
      ".config",
      "opencode",
      "opencode.json",
    ),
    contextKey: "instructions",
    description: "opencode AI",
    globalFolder: "~/.config/opencode/",
  },
};
```

**Command File Processing** - Special handling for command directory files (`src/fileProcessor.js` lines 42-103):
```javascript
function collectCommands() {
  const homeDir = os.homedir();
  const commandsDir = path.join(homeDir, ".claude", "commands");
  
  try {
    // Check if commands directory exists (could be symlink)
    if (!fs.existsSync(commandsDir)) {
      return null;
    }
    
    // Read directory contents
    const files = fs.readdirSync(commandsDir);
    const commandFiles = files
      .filter(file => file.endsWith('.md'))
      .sort()
      .map(file => {
        const filePath = path.join(commandsDir, file);
        try {
          const content = fs.readFileSync(filePath, 'utf8');
          // Strip front matter and resolve imports relative to the command file's directory
          const strippedContent = stripFrontMatter(content);
          const processedContent = resolveImports(strippedContent, path.dirname(filePath));
          return { content: processedContent, path: filePath };
        } catch (error) {
          // Skip files that can't be read
          return null;
        }
      })
      .filter(Boolean);
    
    // Build commands section content with HTML comment separators
    let commandsContent = "\n\n# Commands\n\n";
    
    for (let i = 0; i < commandFiles.length; i++) {
      const { content, path: filePath } = commandFiles[i];
      
      // Add HTML comment with file path before content
      if (i > 0) {
        commandsContent += `\n\n<!-- ${filePath} -->\n\n`;
      } else {
        commandsContent += `<!-- ${filePath} -->\n\n`;
      }
      
      commandsContent += content;
    }
    
    return commandsContent;
  } catch (error) {
    return null;
  }
}
```

**Input Validation Pattern** - Filename sanitization with process exit (`src/utils/validation.js` lines 18-24):
```javascript
function validateFilename(filename) {
  if (filename === "CLAUDE.md") {
    console.error("Error: Cannot use 'CLAUDE.md' as output filename");
    process.exit(1);
  }
  return filename;
}
```

**Option Mutual Exclusion** - Preventing conflicting CLI options (`src/commands/create.js` lines 27-31):
```javascript
// Validate mutual exclusion of --target and --global-folder
if (options.target && options.globalFolder !== "~/.gemini/") {
  console.error("Error: --target and --global-folder options are mutually exclusive");
  process.exit(1);
}

// Determine the global folder to use
const globalFolder = options.target 
  ? getTargetGlobalFolder(options.target)
  : options.globalFolder;
```

## Workflows

**Adding New Commands**:
1. Create command file in `src/commands/` following standard pattern with try-catch wrapper and JSDoc documentation
2. Import command function in `index.js` (lines 9-12) alongside existing command imports  
3. Register command with program using `.command()`, `.description()`, and `.action()` (example at lines 45-85)
4. Add command-specific options with validation functions where needed, including detailed help text
5. Test command functionality with various option combinations, target validation, and error scenarios

**Modifying Core Processing Logic**:
1. **File Discovery**: Modify `src/fileCollector.js` - `collectClaudeFiles()` function at lines 23-48
2. **Import Resolution**: Update `src/importResolver.js` - regex pattern at line 49, tilde expansion at lines 66-67, recursive processing at lines 48-93
3. **Content Generation**: Modify `src/fileProcessor.js` - `generateContextContent()` at lines 114-143
4. **Output Handling**: Update output modes in `getOutputPath()` function at lines 181-200
5. **Command Processing**: Modify command file collection in `collectCommands()` at lines 42-103
6. **Origin Mode Handling**: Update special handling for ~/.claude/CLAUDE.md in `handleOriginMode()` at lines 213-251

**Debugging Import Resolution Issues**:
1. Check regex pattern matching in `src/importResolver.js` at line 49: `/@([^\s\n]+)/g`
2. Verify tilde expansion logic at lines 66-67 for home directory paths
3. Test circular import detection using Set tracking at lines 51, 104-110
4. Check front matter stripping at lines 28-33 for YAML front matter removal
5. Verify recursive import processing in `processImports()` function at lines 61-90
6. Test error handling for missing files and permission issues in try-catch blocks

**Adding New Target AI Tools**:
1. Extend `TARGET_CONFIGS` object in `src/utils/targets.js` (lines 13-33)
2. Add target name, settings path, context key, description, and global folder configuration
3. Update `validateTarget()` function in `src/utils/targetValidator.js` to include new target
4. Test setup/teardown commands with new target configuration and JSON settings handling
5. Verify global folder path resolution and tilde expansion works correctly
6. Test mutual exclusion validation with --target and --global-folder options

**Testing Command Functionality**:
1. **Origin Mode**: Test individual file creation next to each CLAUDE.md file
2. **Global Mode**: Verify single file creation in configured global folder
3. **Project Mode**: Check single file creation in current working directory  
4. **Special Cases**: Test ~/.claude/CLAUDE.md routing to global folder in origin mode
5. **Command Integration**: Verify commands from ~/.claude/commands/ are properly appended with HTML separators
6. **No-Add-Commands**: Test --no-add-commands flag functionality
7. **Target Integration**: Test --target option with different AI tools and global folder resolution

## Reference

**File Organization**:
- **CLI Entry Point**: `index.js` - Commander.js setup, command registration with detailed help text, module re-exports (lines 190-195)
- **Core Processing**: `src/fileProcessor.js` - Content generation, output handling, command collection with symlink support
- **File Discovery**: `src/fileCollector.js` - Directory traversal from current directory to ~/.claude/ for CLAUDE.md files  
- **Import Resolution**: `src/importResolver.js` - @-import processing with tilde expansion, circular protection, front matter stripping
- **Command Modules**: `src/commands/create.js`, `cleanup.js`, `setup.js`, `teardown.js` - Individual command implementations
- **Validation Utils**: `src/utils/validation.js`, `targetValidator.js` - Input sanitization and target validation
- **Configuration**: `src/utils/targets.js` - Centralized target AI tool configuration with settings paths and keys

**Key Functions and Their Locations**:
- `collectClaudeFiles()` - `src/fileCollector.js:23-48` - Directory tree walking with ~/.claude/ inclusion
- `resolveImports()` - `src/importResolver.js:48-93` - Recursive import processing with circular protection
- `stripFrontMatter()` - `src/importResolver.js:28-33` - YAML front matter removal with regex
- `generateContextContent()` - `src/fileProcessor.js:114-143` - Complete context generation with command integration
- `handleOriginMode()` - `src/fileProcessor.js:213-251` - Individual file output with special ~/.claude/ handling
- `collectCommands()` - `src/fileProcessor.js:42-103` - Command directory processing with symlink support
- `getOutputPath()` - `src/fileProcessor.js:181-200` - Output path resolution for different modes
- `getTargetConfig()` - `src/utils/targets.js:42-51` - Target configuration lookup with error handling

**Module Dependencies**:
- `src/fileProcessor.js` imports from `fileCollector.js` (line 9) and `importResolver.js` (line 10)
- All command modules import required functions from `fileProcessor.js` and utility modules
- `index.js` imports all command functions (lines 9-12) and validation utilities (lines 13-15)
- `index.js` re-exports core functions for backwards compatibility (lines 190-195)
- Target validation uses centralized configuration from `targets.js` through `targetValidator.js`
- Commands use target configuration for global folder resolution through `getTargetGlobalFolder()`

**Error Handling Strategies**:
- **File Operations**: Try-catch with continue or graceful fallback (`src/fileProcessor.js` lines 22-30, 64-73)
- **Import Resolution**: File existence checks before processing (`src/importResolver.js` lines 104-110)
- **Command Execution**: Error logging with process.exit(1) pattern in all command modules (e.g., `src/commands/create.js` lines 52-55)
- **JSON Operations**: Explicit parsing with error handling in setup/teardown commands for settings files
- **Path Resolution**: Built-in Node.js path handling with tilde expansion for cross-platform compatibility
- **Validation Errors**: Immediate process exit with descriptive error messages (`src/utils/validation.js` lines 19-22)

**Naming Conventions**:
- **Files**: camelCase for multi-word module names (`fileCollector.js`, `importResolver.js`, `targetValidator.js`)
- **Functions**: camelCase with clear verb-noun patterns (`collectClaudeFiles`, `generateContextContent`, `validateFilename`)
- **Variables**: camelCase descriptive names (`processedContents`, `expandedGlobalFolder`, `commandsContent`)
- **Constants**: UPPER_SNAKE_CASE for configuration objects (`TARGET_CONFIGS`), camelCase for regex patterns (`importRegex`)
- **Command Options**: kebab-case for CLI flags (`--output-folder`, `--no-add-commands`, `--global-folder`)

**Testing and Debugging**:
- **Manual Testing**: Test all commands with different option combinations and target configurations
- **Path Resolution**: Verify tilde expansion and relative path handling work correctly across platforms
- **Import Chains**: Test recursive imports and circular dependency prevention with Set tracking
- **Special Cases**: Verify ~/.claude/CLAUDE.md routing to global folder and command file processing with symlinks
- **Target Integration**: Test --target option mutual exclusion with --global-folder and proper configuration loading
- **Command Integration**: Test --no-add-commands flag and HTML comment separators in command output
- **Cross-Platform**: Test path handling on different operating systems with various path formats
- **Error Scenarios**: Test with missing files, invalid paths, permission issues, and malformed JSON settings