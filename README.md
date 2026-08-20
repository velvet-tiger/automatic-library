# Automatic — Content Library

The built-in skills, rules, instructions, and subagents that ship with [Automatic](https://tryautomatic.app).

Automatic is a desktop hub for AI coding agents. It gives your agent tools (Claude Code, Codex CLI, Cursor, and others) a shared set of skills, rules, and project instructions, keeps them in sync across every project you work on, and updates the content in this repository in the background so you never have to hand-copy files between agents.

Install Automatic: [tryautomatic.app](https://tryautomatic.app).

Source: [github.com/velvet-tiger/automatic](https://github.com/velvet-tiger/automatic).

## Using these files without Automatic

Every file in this repository is plain markdown or JSON. You can drop them into your agent's config directory by hand:

- **Skills** go under your agent's skill directory. For Claude Code, that is `~/.claude/skills/` for global scope or `.claude/skills/` inside a project.
- **Rules** go into the instruction file your agent reads on start (`CLAUDE.md`, `AGENTS.md`, `.cursorrules`, and so on). Each `.md` under `rules/` is a self-contained block you can paste in.
- **Instructions** are project-brief templates you can copy into a project as its `CLAUDE.md` or equivalent.
- **Subagents** go under your agent's subagent directory. For Claude Code, that is `~/.claude/agents/`.
- **Hooks** are event handlers scoped to a specific agent. See `hooks/README.md` for the format.

Automatic manages this for you across every agent you use, keeps everything in sync when this repository updates, and lets you attach an asset to a specific project rather than to your global config. If you have more than one agent installed, or more than one project, Automatic saves you the copying.

## What is in this repository

- **`skills/`** — around 20 skills, from general engineering practice (code review, debugging, documentation, performance, security review, testing) to framework-specific guides (Laravel, Tailwind CSS, Vercel/React, Terraform) and language guides (PHP, Python).
- **`rules/`** — rule packs used by Automatic to compose project instruction files. The `automatic` pack covers process, guardrails, code style, prose style, and general engineering principles.
- **`instructions/`** — project instruction templates (`Agent Project Brief`, `Session Context`).
- **`subagents/`** — subagent definitions Automatic installs into agents that support subagents.
- **`hooks/`** — event-triggered handlers. Empty in this initial release; contributions are welcome and reviewed.
- **`manifest.json`** — machine-readable inventory of every asset with a sha256 for each file.
- **`retired.json`** — record of assets removed from the library over time, so tools consuming this repository can detach them cleanly.

## Contributing

See `CLAUDE.md` for the contributor guide. In short: edit or add files, run the manifest generator, bump `VERSION` if the change should ship as a release, and open a pull request. Hooks and removals are reviewed by a human before merge.

## License

MIT. See `LICENSE`.
