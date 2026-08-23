# Signing Key Generation and Distribution

The release pipeline signs every published archive with [minisign](https://jedisct1.github.io/minisign/). The Automatic desktop app verifies that signature at refresh time using a public key baked into the binary. This document is the one-time setup: generating the keypair, storing the private key in this repository's Actions secrets, and delivering the public key to the app.

Do the whole thing **offline on a machine you trust**. The private key must never live in git, in a shared drive, or in an unencrypted note.

## Prerequisites

- `minisign` installed locally (`brew install minisign` on macOS, `apt install minisign` on Debian/Ubuntu).
- Push access to `velvet-tiger/automatic-library`.
- Push access to `velvet-tiger/automatic` (the app repo — the public key goes there).

## Generate the keypair

```bash
minisign -G -p library.pub -s library.sec
```

You will be prompted for a password twice. Two options:

1. **Encrypted key (recommended).** Choose a strong password. Store both the private-key file and the password in the Actions secrets below. Two secrets must leak together for a compromise. This is the default the workflow expects.
2. **Unencrypted key.** Add `-W` to the command above and skip the password prompt. Simpler CI, weaker defence in depth. Do this only if your organisation's Actions secret hygiene is strong enough that a single leak is acceptable.

The generator produces two files in the working directory:

- `library.sec` — the private key. Treat it like a password.
- `library.pub` — the public key. Safe to publish.

## Store the private key as a repository secret

In `velvet-tiger/automatic-library` → Settings → Secrets and variables → Actions → New repository secret:

- Name: `MINISIGN_PRIVATE_KEY`
  Value: the entire contents of `library.sec` (multi-line — paste as is).
- Name: `MINISIGN_PASSWORD` (only if you generated an encrypted key)
  Value: the password you chose.

The workflow at `.github/workflows/release.yml` reads both secrets. If the private key secret is missing, the workflow fails fast with a pointer to this file.

## Publish the public key to the app repository

The Automatic app verifies release archives against a public key that is compiled into the binary. Copy `library.pub` into the app repository:

```bash
mkdir -p ../automatic-app/src-tauri/keys
cp library.pub ../automatic-app/src-tauri/keys/library.pub
cd ../automatic-app
git add src-tauri/keys/library.pub
git commit -m "chore(library): pin minisign public key for library releases"
```

Phase 3b of the migration wires the key into `library_refresh` via `include_str!`. Until Phase 3b lands the file is unused, but committing it now unblocks that work.

## Delete the local private key

Once `MINISIGN_PRIVATE_KEY` is set in Actions and you have confirmed a test release signs and publishes, remove the local copy:

```bash
shred -u library.sec   # Linux
# or
rm -P library.sec      # macOS
```

Keep an offline backup somewhere out of git (encrypted USB, password manager attachment). Losing the private key means every subsequent release has to be signed by a new key, which means shipping a new app version to accept the new public key.

## Cutting a release

Everything above is one-off. To ship a release:

1. Bump `VERSION`, run `node scripts/build-manifest.mjs`, commit both.
2. Tag `vX.Y.Z` and push the tag.
3. CI verifies the tag matches `VERSION`, verifies `manifest.json` is up to date, builds `library-vX.Y.Z.zip`, signs it, and publishes the archive plus `.minisig` as a GitHub Release asset.

The tag-to-release path is entirely CI-driven. If any step fails, the release does not go out — no manual cleanup needed.
