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

### Rules

Rules are self-contained markdown blocks that Automatic composes into an agent's instruction file (`CLAUDE.md`, `AGENTS.md`, `.cursorrules`, or the equivalent). Each rule is one file; a pack is a directory of related rules.

**`automatic` pack** — the default rule set Automatic installs into every managed project.

These are the most useful part of this repository. These rules are tested and proven to work well together across coding agents, and will significantly improve your results.

| Rule | What it says |
|---|---|
| [`general`](rules/automatic/general.md) | The Constitution for AI coding agents. Twenty rules preventing common failure modes (no aimless loops, confirm before creation, respect local context, report state truthfully), concrete do/don't guidance for a session, and the voice the agent should bring to substantive work. |
| [`code`](rules/automatic/code.md) | Named stopping-points where a bad pattern is about to be written, paired with the pattern that should take its place. Explicit typing, composition over inheritance, dependency injection, error handling with context, idempotency, security-aware defaults, and more. |
| [`process`](rules/automatic/process.md) | A seven-phase problem-solving process: understand, context, plan, communicate, implement, verify, summarise. Includes a mandatory stop before the first mutating tool call. |
| [`prose`](rules/automatic/prose.md) | Rules for writing prose that humans read, including chat replies: short sentences, one idea each, no em-dashes, no meta-narration, plain words. |
| [`gitignore`](rules/automatic/gitignore.md) | The block Automatic writes into a project's `.gitignore` to keep managed agent config out of version control. |


### Skills

Skills teach an agent how to approach a category of work. Each one is a self-contained markdown file with a description in its frontmatter that agents use to decide when to activate it.

| Skill | What it covers |
|---|---|
| [`automatic-api-design`](skills/automatic-api-design/) | REST API design conventions, error shapes, versioning, and pagination patterns. |
| [`automatic-code-review`](skills/automatic-code-review/) | How to conduct and receive effective code reviews. |
| [`automatic-database-design`](skills/automatic-database-design/) | Schema design, normalisation, indexing, and migration practice for relational databases. |
| [`automatic-debugging`](skills/automatic-debugging/) | A systematic process for diagnosing and resolving defects. |
| [`automatic-documentation`](skills/automatic-documentation/) | Principles for writing READMEs, API docs, ADRs, code comments, and changelogs. |
| [`automatic-llms-txt`](skills/automatic-llms-txt/) | Creating and maintaining `llms.txt` files following the llmstxt.org standard. |
| [`automatic-performance`](skills/automatic-performance/) | A data-driven approach to identifying and resolving performance bottlenecks. |
| [`automatic-refactoring`](skills/automatic-refactoring/) | Techniques for improving code structure without changing behaviour. |
| [`automatic-security-review`](skills/automatic-security-review/) | Security review checklist and threat mindset for any codebase. |
| [`automatic-testing`](skills/automatic-testing/) | Principles and patterns for writing effective unit, integration, and end-to-end tests. |
| [`automatic-remote-source-authoring`](skills/automatic-remote-source-authoring/) | How to publish resources through Automatic's remote-source system. `automatic.json` manifests, `skill.json` references, collections, badges, and directory structure. |

Third-party skills that the Automatic app also installs by default (Laravel, PHP, Python, Tailwind CSS, Terraform, Vercel/React, Laravel Pennant) are shipped by the app itself, not by this repository.

### Instructions

Project instruction templates. A user copies one into a new project as its `CLAUDE.md` or equivalent and fills in the placeholders.

| Instruction | Purpose |
|---|---|
| [`Agent Project Brief`](instructions/Agent%20Project%20Brief.md) | The long-lived brief. Overview, tech stack, build and run commands, architecture, coding conventions, and agent do/don't lists. |
| [`Session Context`](instructions/Session%20Context.md) | The short-lived brief. What are we working on right now, what has changed, what is blocking. |

### Subagents

Subagents are focused agents an orchestrating agent can delegate to. Automatic installs these into any agent tool that supports the subagent pattern (Claude Code is the main one today).

**`automatic` pack.**

| Subagent | Role |
|---|---|
| [`code-reviewer`](subagents/automatic/code-reviewer.md) | Senior code reviewer for correctness, quality, and security. Called immediately after writing or modifying code. Read-only tools. |
| [`debugger`](subagents/automatic/debugger.md) | Debugging specialist that can also apply fixes. Called when investigating failures, errors, or unexpected behaviour. |
| [`planner`](subagents/automatic/planner.md) | Software architect focused on planning and design decisions. Called when scoping a feature, refactoring, or making structural changes. Runs in plan mode with read-only tools. |

### Hooks

Event-triggered handlers scoped to a specific agent and event (session start, before a tool call, and so on). The initial release ships with zero hooks. See [`hooks/README.md`](hooks/README.md) for the format and the security policy that applies to every hook contribution.

### Machine-readable indexes

| File | Purpose |
|---|---|
| [`manifest.json`](manifest.json) | Inventory of every asset in the library, keyed by kind and id, with a sha256 for each file. Consumers read this instead of walking the tree. |
| [`retired.json`](retired.json) | Assets that have been removed from the library, so consumers can detach a retired asset from projects that still reference it. |
| [`VERSION`](VERSION) | Semantic version of the library. Drives release tags. |

## Contributing

See `CLAUDE.md` for the contributor guide. In short: edit or add files, run the manifest generator, bump `VERSION` if the change should ship as a release, and open a pull request. Hooks and removals are reviewed by a human before merge.

## License

MIT. See `LICENSE`.
