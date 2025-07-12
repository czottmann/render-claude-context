<!-- Generated: 2025-07-12 20:30:00 UTC -->

# Deployment

The CLI tool supports multiple deployment methods including direct execution, local npm installation, and global CLI distribution. Packaging leverages npm's binary configuration for cross-platform CLI distribution.

## Package Types

**Direct Execution** - No installation required
- Execute with `node index.js` or `./index.js` (requires shebang permissions)
- Useful for development and testing scenarios

**Local NPM Package** - `npm install` in project directory
- Installs dependencies (none required) and sets up local scripts
- Access via `npm run build` or `npm run test`

**Global CLI Tool** - `npm install -g .` from project directory
- Installs as `claude-static-context-dump` command globally
- Binary configuration in `package.json` (lines 6-8) enables global access

## Platform Deployment

**Unix/Linux/macOS**:
- Shebang execution: `chmod +x index.js` then `./index.js`
- Global install: `npm install -g .` creates symlink to `index.js`
- Command available as `claude-static-context-dump`

**Windows**:
- Node execution: `node index.js` (shebang ignored)
- Global install: `npm install -g .` creates batch wrapper
- Command available as `claude-static-context-dump.cmd`

**NPM Registry Distribution**:
- Package ready for `npm publish` with proper metadata (`package.json`)
- Binary field ensures CLI installation on all platforms
- No build step required - source code distributed directly

## Reference

**Deployment Scripts**:
- No custom deployment scripts required
- Standard npm install/publish workflow
- Binary configuration handles CLI setup automatically

**Output Locations**:
- Global install: Platform-specific npm global directory
- Local execution: Current working directory output to stdout
- No file outputs - tool writes to stdout only

**Server Configurations**:
- No server deployment required
- CLI tool for local file processing
- Can be integrated into CI/CD pipelines via npm scripts

**Distribution Checklist**:
1. Verify `package.json` metadata (name, version, description)
2. Test global installation: `npm install -g .`
3. Verify CLI command works: `claude-static-context-dump`
4. Test on target platforms (Windows, macOS, Linux)
5. Optional: Publish to npm registry with `npm publish`

**Version Management**:
- Update version in `package.json` line 3
- Use semantic versioning for releases
- Tag releases for distribution tracking