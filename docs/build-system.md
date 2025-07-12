<!-- Generated: 2025-07-12 20:30:00 UTC -->

# Build System

This Node.js CLI tool uses a minimal build system with direct execution capabilities. The main configuration is in `package.json` with binary setup for global installation and npm scripts for common operations.

## Build Workflows

**Direct Execution** - `node index.js` or `./index.js` (shebang in `index.js` line 1)
**NPM Build Script** - `npm run build` executes `node index.js` (`package.json` line 10)
**NPM Test Script** - `npm run test` executes `node index.js` (`package.json` line 11)
**Global Installation** - `npm install -g .` installs as `claude-static-context-dump` command

## Platform Setup

**Node.js Installation** - Requires Node.js runtime (any recent version)
**Direct Usage** - No build step required, runs directly from source
**Global CLI Setup** - Binary configuration in `package.json` (lines 6-8):
```json
"bin": {
  "claude-static-context-dump": "./index.js"
}
```

**Shebang Configuration** - Enables direct execution on Unix systems (`index.js` line 1)

## Reference

**Build Targets**:
- `npm run build` - Execute tool from current directory
- `npm run test` - Execute tool (same as build for testing)
- Direct execution via `node index.js` or `./index.js`

**Configuration Files**:
- `package.json` - NPM package configuration and binary setup
- `index.js` - Self-contained executable with shebang

**No Dependencies** - Tool uses only Node.js built-in modules (`fs`, `path`, `os`)
**No Compilation** - JavaScript source runs directly without transpilation

**Troubleshooting**:
- Permission issues: `chmod +x index.js` for direct execution
- Global install issues: Use `npm install -g .` from project directory
- Path issues: Verify Node.js in PATH for shebang execution