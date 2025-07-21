# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2025-07-21

### Added
- `create` and `cleanup` commands: new `--global-folder` option to configure output directory for global rules (defaults to `~/.gemini/`)

### Changed
- Updated documentation with new option examples and usage patterns

## [1.0.0] - 2025-07-13

### Added
- Hierarchical CLAUDE.md file collection from current directory to home
- Recursive `@`-import resolution with circular import protection
- Multiple output modes: origin (next to source files), global, and project
- Gemini CLI integration with setup/teardown commands
- Cross-platform support with Node.js and Commander.js
- Comprehensive documentation and examples
