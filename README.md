<!-- Generated: 2025-07-13 11:30:00 UTC -->

# claude-context-render

CLI tool that processes CLAUDE.md files with hierarchical collection and recursive import resolution. Features multiple output modes, Gemini integration, and comprehensive file management commands.

## Quick Start

```bash
# Create context file in current directory (default)
claude-context-render create

# Create with custom filename and location
claude-context-render create --output-folder global --filename my-context.md

# Add to Gemini settings for automatic context loading
claude-context-render setup

# Remove generated files
claude-context-render cleanup
```

## Installation

```bash
# Global installation
npm install -g .
claude-context-render --help

# Direct execution
node index.js --help
```

## Commands

### create (default)
Creates context files from CLAUDE.md hierarchy with import resolution.

```bash
claude-context-render create [options]

Options:
  --output-folder <mode>  global|project|origin (default: "project")
  --filename <name>       Output filename (default: "CLAUDE-derived.md")
```

**Output Modes:**
- `global`: Single file in `~/.gemini/`
- `project`: Single file in current directory  
- `origin`: Individual files next to each CLAUDE.md

### setup
Adds output file path to Gemini settings contextFileName array.

```bash
claude-context-render setup [options]
```

### cleanup  
Removes generated context files.

```bash
claude-context-render cleanup [options]
```

## Key Files

**Main Implementation** - `index.js`: CLI tool with Commander.js integration and all processing logic  
**Configuration** - `package.json`: NPM package with claude-context-render binary  
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