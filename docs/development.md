<!-- Generated: 2025-07-12 20:30:00 UTC -->

# Development

The codebase follows Node.js conventions with functional programming patterns and comprehensive error handling. Code style emphasizes readability and reliability using built-in modules only. Development workflow centers around the single-file architecture with modular function design.

## Code Style

**Function Organization** - Pure functions with clear single responsibilities
**Error Handling** - Graceful degradation preserving non-existent imports as literal text
**Variable Naming** - Descriptive names: `collectClaudeFiles`, `resolveImports`, `processFiles`

**Import Resolution Pattern** - `index.js` (lines 32-67):
```javascript
const importRegex = /@([^\s\n]+)/g;
return text.replace(importRegex, (match, importPath) => {
  // Path resolution with tilde expansion
  if (importPath.startsWith("~/")) {
    fullPath = path.join(os.homedir(), importPath.slice(2));
  } else {
    fullPath = path.resolve(currentDir, importPath);
  }
});
```

**Directory Traversal Pattern** - `index.js` (lines 7-30):
```javascript
while (currentDir !== path.dirname(currentDir)) {
  const claudeFile = path.join(currentDir, "CLAUDE.md");
  if (fs.existsSync(claudeFile)) {
    files.push(claudeFile);
  }
  if (currentDir === homeDir) break;
  currentDir = path.dirname(currentDir);
}
```

## Common Patterns

**Circular Import Prevention** - Set-based tracking (`index.js` lines 35, 49, 54):
```javascript
const resolved = new Set();
if (!fs.existsSync(fullPath) || resolved.has(fullPath)) {
  return match;
}
resolved.add(fullPath);
```

**Recursive Processing** - Nested import resolution (`index.js` lines 58-59):
```javascript
return processImports(importedContent, importedDir);
```

**Error Handling Strategy** - Continue processing on errors (`index.js` lines 60-62, 78-81):
```javascript
try {
  // File operations
} catch (error) {
  return match; // Preserve original content
}
```

## Workflows

**Adding New Features**:
1. Modify core functions in `index.js`
2. Update module exports if needed (line 113)
3. Test with `npm run test` or direct execution
4. Verify import resolution and output format

**Debugging Import Issues**:
1. Check file paths in `resolveImports()` function (lines 39-46)
2. Verify regex pattern matching (line 33)
3. Test with sample files containing various import patterns
4. Use console.log in development for path resolution debugging

**Code Modification Areas**:
- Import regex pattern (`index.js` line 33)
- Path resolution logic (`index.js` lines 42-46)
- Output formatting (`index.js` lines 97-106)
- File collection rules (`index.js` lines 11-21)

## Reference

**File Organization**:
- Single file architecture: `index.js` contains all functionality
- Configuration: `package.json` for npm and CLI setup
- Documentation: `SPEC.md` for requirements, `CLAUDE.md` for context

**Naming Conventions**:
- Function names use camelCase: `collectClaudeFiles`, `resolveImports`
- Variables descriptive: `startDir`, `homeDir`, `claudeFiles`
- Constants in camelCase: `importRegex`, `globalClaudeFile`

**Common Issues**:
- Path resolution on Windows vs Unix (handled by `path` module)
- Circular imports (prevented by `resolved` Set)
- File permission errors (handled with try-catch blocks)
- Import regex matching edge cases (non-file paths preserved)

**Module Structure**:
- Main execution: `main()` function (`index.js` lines 87-111)
- Core functions: Exported for testing (`index.js` line 113)
- CLI integration: Shebang and module.main check (`index.js` lines 1, 109-111)