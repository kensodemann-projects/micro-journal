# Ruler — Agent Rule Management

This project uses [Ruler](https://github.com/intellectronica/ruler) to distribute AI agent instructions from a single source of truth.

## Source of Truth

- **Edit rules here**: `.ruler/*.md` (this directory)
- **Do not edit generated files**: `AGENTS.md`, `.cursor/mcp.json`, `CLAUDE.md`, and other Ruler output files are auto-generated and gitignored

## Workflow

1. Edit or add Markdown rule files in `.ruler/`
2. Run `pnpm mcp` (alias for `ruler apply`) to propagate rules to all configured agents
3. To undo generated files: `pnpm mcp:revert`

## Configuration

- Agent and MCP settings: `.ruler/ruler.toml`
- Vuetify MCP server is configured under `[mcp_servers.vuetify]`

## Difference from Native Cursor Rules

Unlike projects that maintain separate `.cursor/rules/*.mdc` files with per-file `globs` and `alwaysApply` settings, Ruler concatenates all `.ruler/*.md` files alphabetically into one rule set per agent. With `@intellectronica/ruler` 0.3.x, Cursor reads rules from the generated `AGENTS.md` at the project root (not separate `.mdc` files).

Compensate by keeping rule files focused and using clear section headers. Apply contextually — e.g., follow testing conventions when editing `*.spec.ts` files even though all rules are bundled together.

## Committing

Commit changes to `.ruler/` and `.ruler/ruler.toml`. Do not commit generated agent config files.
