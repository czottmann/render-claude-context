<!-- Generated: 2025-07-12 20:30:00 UTC -->

# claude-static-context-dump

Node.js CLI tool that processes CLAUDE.md files with hierarchical collection and recursive import resolution. Walks up directory tree from current location to home folder, collecting all CLAUDE.md files and processing `@` imports.

## Quick Start

```bash
# Direct execution
node index.js

# Global installation
npm install -g .
claude-static-context-dump

# NPM scripts  
npm run build
```

## Key Files

**Main Implementation** - `index.js`: Complete CLI tool with file collection, import resolution, and output generation  
**Configuration** - `package.json`: NPM package and binary setup for global CLI installation  
**Specification** - `SPEC.md`: Complete functional requirements and processing rules

## Documentation

- **[Project Overview](docs/project-overview.md)** - Purpose, key files, and technology stack
- **[Architecture](docs/architecture.md)** - Component organization and data flow patterns  
- **[Build System](docs/build-system.md)** - Build workflows and platform setup
- **[Testing](docs/testing.md)** - Test execution and module exports for unit testing
- **[Development](docs/development.md)** - Code patterns, workflows, and debugging guidance
- **[Deployment](docs/deployment.md)** - Installation methods and distribution packaging
- **[Files Catalog](docs/files.md)** - Complete file organization and dependency relationships

LLMs will find concrete file references, line numbers for key functions, and practical code examples throughout the documentation.