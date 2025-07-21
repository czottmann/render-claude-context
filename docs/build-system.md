<!-- Generated: 2025-07-21T10:24:41Z -->

# Build System

This Node.js CLI tool uses a minimal build system based on Commander.js with direct execution capabilities. The project requires no compilation step and runs directly from source code. The main configuration is in `package.json` with binary setup for global installation and npm scripts for common operations.

The tool is structured as a modular CLI application with separate command modules in `src/commands/` and core functionality in `src/` modules. The build system focuses on dependency management and distribution rather than compilation, as JavaScript runs directly in Node.js.

## Build Workflows

**Development Testing**:
```bash
# Run from source directory
node index.js help
node index.js create --output-folder project
./index.js create  # Direct execution via shebang
```

**Dependency Installation** - `npm install` installs Commander.js dependency (`package.json` lines 20-22):
```bash
npm install  # Installs commander@14.0.0
```

**NPM Scripts** (`package.json` lines 9-12):
```bash
npm run build   # Executes: node index.js (for testing)
npm run test    # Executes: node index.js (same as build)
```

**Global Installation** - `npm install -g .` installs as `render-claude-context` command:
```bash
npm install -g .  # Makes CLI available globally
render-claude-context help  # Run from anywhere
```

**Package Distribution** - Standard npm package structure for publishing:
```bash
npm pack  # Creates tarball for distribution
npm publish  # Publishes to npm registry
```

## Platform Setup

**Node.js Requirements** - Requires Node.js >= 20 (`package-lock.json` line 24):
- Commander.js dependency requires Node.js 20+
- Tool uses ES modules and modern JavaScript features

**Development Setup**:
```bash
git clone <repository>
cd claude-static-context-dump
npm install  # Install commander dependency
chmod +x index.js  # Make executable (Unix/macOS)
```

**Binary Configuration** (`package.json` lines 6-8):
```json
"bin": {
  "render-claude-context": "./index.js"
}
```

**Cross-Platform Execution**:
- **Unix/macOS**: Direct execution via shebang (`index.js` line 1): `#!/usr/bin/env node`
- **Windows**: Run via `node index.js` or use npm global install
- **All Platforms**: `npm install -g .` provides consistent CLI experience

**Module Structure** (`index.js` lines 4-8):
- Commands: `src/commands/` - Individual command implementations
- Core: `src/fileCollector.js`, `src/importResolver.js`, `src/fileProcessor.js`
- Utils: `src/utils/validation.js` - Input validation helpers

## Reference

**Build Targets**:
- `npm install` - Install dependencies (Commander.js)
- `npm run build` - Test execution (runs `node index.js`)
- `npm run test` - Test execution (same as build)
- `npm install -g .` - Global installation
- `npm pack` - Create distribution package

**Key Configuration Files**:
- `package.json` - Package metadata, dependencies, binary setup, scripts
- `package-lock.json` - Locked dependency versions for reproducible installs
- `index.js` - Main entry point with shebang and Commander.js setup

**Dependencies** (`package.json` lines 20-22):
- `commander@14.0.0` - CLI framework for argument parsing and command structure
- No build-time dependencies - uses only runtime dependencies

**Distribution Methods**:
- **Source**: Direct git clone and `npm install`
- **Global NPM**: `npm install -g .` from project directory
- **Package**: `npm pack` creates distributable tarball
- **Registry**: Standard npm publish workflow

**Troubleshooting**:
- **Permission issues**: `chmod +x index.js` for direct execution on Unix systems
- **Global install issues**: Ensure npm global directory is in PATH
- **Node version**: Verify Node.js >= 20 for Commander.js compatibility
- **Module errors**: Run `npm install` to ensure Commander.js dependency is installed
- **Binary not found**: Check npm global bin directory: `npm bin -g`
