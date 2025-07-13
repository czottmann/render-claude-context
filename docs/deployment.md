<!-- Generated: 2025-07-13 12:45:00 UTC -->

# Deployment

This Node.js CLI tool provides flexible deployment options from direct execution to npm registry distribution. The tool generates context files in multiple output locations and integrates with external systems like Gemini through configuration management. Packaging leverages npm's binary configuration for cross-platform CLI distribution with seamless command-line access.

The deployment system supports three distinct output modes: origin mode (creates files next to source CLAUDE.md files), project mode (single file in current directory), and global mode (centralized ~/.gemini/ location). Integration commands handle setup and teardown of external system configurations, enabling automated workflow integration.

## Package Types

**Direct Execution** - Zero-install development workflow
- Shebang execution: `./index.js` (requires `chmod +x index.js`)
- Node execution: `node index.js` (cross-platform compatible)
- Full CLI functionality without installation dependencies
- Primary source: `index.js` (lines 1-76) with Commander.js integration

**Local NPM Package** - Development installation
- Install dependencies: `npm install` (installs Commander.js dependency from `package.json` line 21)
- Local script execution: `npm run build` and `npm run test` both execute `node index.js`
- Output locations configured in `src/fileProcessor.js` (lines 62-76)
- Development workflow with local command access

**Global CLI Distribution** - System-wide command availability
- Global installation: `npm install -g .` from project directory
- Command name: `claude-context-render` (configured in `package.json` lines 6-8)
- Binary field maps to `./index.js` for cross-platform CLI wrapper generation
- System PATH integration with platform-specific execution wrappers

**NPM Registry Package** - Public distribution ready
- Package metadata in `package.json`: name, version, description, keywords (lines 2-16)
- MIT license and author information for registry compliance (lines 18-19)
- Publication ready with `npm publish` (requires npm login and version management)
- Dependency specification includes Commander.js ^14.0.0 (lines 20-22)

## Platform Deployment

**Unix/Linux/macOS Deployment**:
- Shebang execution: `#!/usr/bin/env node` in `index.js` line 1 enables direct execution
- Permission setup: `chmod +x index.js` for executable access
- Global symlink: `npm install -g .` creates symbolic link to project `index.js`
- Command name: `claude-context-render` (binary name from `package.json` line 7)
- Output file locations: `~/.gemini/` (global), project directory (project), or origin directories (origin mode)

**Windows Deployment**:
- Node execution: `node index.js` (shebang line ignored on Windows)
- Global wrapper: `npm install -g .` generates `claude-context-render.cmd` batch file
- PowerShell wrapper: Additional `claude-context-render.ps1` script for PowerShell environments
- Command resolution: Windows PATH integration through npm global directory
- File operations: Cross-platform path handling in `src/fileProcessor.js` (lines 78-101)

**Container/Docker Deployment**:
- Base image: Node.js runtime required for execution environment
- Installation: `npm install -g claude-context-render` for container-wide access
- Volume mounts: Map host directories containing CLAUDE.md files to container paths
- Output persistence: Mount `~/.gemini/` directory for global output mode persistence

**CI/CD Pipeline Integration**:
- Installation: `npm install claude-context-render` in build steps
- Execution: `npx claude-context-render create --output-folder project` for build artifacts
- Configuration: Setup command for Gemini integration: `npx claude-context-render setup`
- Cleanup: Teardown and cleanup commands for pipeline cleanup phases

## Reference

**Installation Commands**:
- Development: `npm install` (installs Commander.js dependency)
- Global: `npm install -g .` (creates system-wide command)
- Registry: `npm install -g claude-context-render` (after publication)
- Container: `docker run -v $(pwd):/workspace node:latest npm install -g claude-context-render`

**Output Location Configuration**:
- **Global mode**: `~/.gemini/CLAUDE-derived.md` (configured in `src/fileProcessor.js` line 67)
- **Project mode**: `./CLAUDE-derived.md` in current directory (line 69)
- **Origin mode**: Files created next to each source CLAUDE.md file (lines 78-101)
- **Special case**: `~/.claude/CLAUDE.md` outputs to `~/.gemini/` instead of origin directory (lines 88-94)

**External System Integration**:
- **Setup command**: Adds filename to `~/.gemini/settings.json` contextFileName array (`src/commands/setup.js` lines 22-23)
- **Teardown command**: Removes filename from Gemini configuration (`src/commands/teardown.js` lines 37-44)
- **Cleanup command**: Deletes generated context files from filesystem (`src/commands/cleanup.js`)
- **Configuration path**: `~/.gemini/settings.json` for Gemini integration (setup.js line 7)

**Build System Integration**:
- **NPM scripts**: `build` and `test` both execute `node index.js` (`package.json` lines 10-11)
- **Binary configuration**: Maps `claude-context-render` to `./index.js` (lines 6-8)
- **Module exports**: Backwards compatibility through re-exports in `index.js` (lines 70-75)
- **Validation**: Input validation in `src/utils/validation.js` for filename safety

**Distribution Checklist**:
1. **Metadata verification**: Update `package.json` version, description, keywords (lines 3, 4, 13-16)
2. **Dependency check**: Verify Commander.js version compatibility (line 21)
3. **Global testing**: `npm install -g .` and test `claude-context-render --help`
4. **Platform testing**: Verify Windows batch wrapper and Unix symlink creation
5. **Registry preparation**: `npm login` and `npm publish` for public distribution
6. **Integration testing**: Test setup/teardown commands with Gemini configuration
7. **Output verification**: Test all three output modes (global, project, origin)

**Registry Distribution Workflow**:
- **Version bump**: Update `package.json` version field (line 3) following semantic versioning
- **Authentication**: `npm login` to authenticate with registry.npmjs.org
- **Publication**: `npm publish` to upload package to npm registry
- **Verification**: `npm info claude-context-render` to verify published package metadata
- **Installation test**: `npm install -g claude-context-render` from registry

**File Path References**:
- **Main executable**: `/index.js` (CLI entry point with shebang)
- **Package config**: `/package.json` (npm configuration and binary mapping)
- **Command implementations**: `/src/commands/` (create, setup, teardown, cleanup, help)
- **Core processing**: `/src/fileProcessor.js` (output generation and file operations)
- **Utility functions**: `/src/utils/validation.js` (input validation and safety checks)