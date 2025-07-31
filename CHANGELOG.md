# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.2.0] - 2025-07-31

### Added

- Support for [Crush](https://github.com/charmbracelet/crush).

---

## [1.1.0] - 2025-07-21

### Added
- `setup` and `teardown` commands:
    - new `--target` option for multi-platform AI tool support (gemini, opencode)
- `create` and `cleanup` commands:
    - new `--global-folder` option to configure output directory for global rules (defaults to `~/.gemini/`)
    - new `--target` option with automatic global folder selection and mutual exclusion with `--global-folder`
- `create` command:
    - automatic inclusion of commands from `~/.claude/commands/` directory, can be disabled with `--no-add-commands` flag

### Changed
- **Renamed tool from "claude-context-render" to "render-claude-context".**
- `create` command:
    - front matter stripping from imported files (both .md and .mdc) and command files
- Updated documentation with new option examples and usage patterns

---

## [1.0.0] - 2025-07-13

### Added
- Hierarchical CLAUDE.md file collection from current directory to home
- Recursive `@`-import resolution with circular import protection
- Multiple output modes: origin (next to source files), global, and project
- Gemini CLI integration with setup/teardown commands
- Cross-platform support with Node.js and Commander.js
- Comprehensive documentation and examples
