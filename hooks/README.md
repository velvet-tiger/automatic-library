# Hooks

Event-triggered handlers that the Automatic app installs into agent configurations.

This directory is empty at the initial extract. Hooks were previously created only at runtime through the app. Contributions are welcome, subject to review.

## Format

Each hook is a single JSON file. The filename stem is the hook's machine name.

```json
{
  "name": "Human-readable name",
  "agent": "claude-code",
  "event": "session-start",
  "matcher": "*",
  "handler": "shell command or script path",
  "timeout_ms": 5000
}
```

## Security note

Hooks contain executable content. Every hook merged into this repository is code that will run on end-users' machines. Pull requests that add or modify a hook require a human review, and releases are signed. The Automatic app refuses to load any hook whose sha256 does not match a signed manifest entry.
