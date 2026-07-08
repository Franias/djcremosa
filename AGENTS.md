<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Project Identity

- **Owner / primary author:** francielli (machine user `franciellidias`).
- **Repo:** `github.com/Franias/djcremosa` — forked/copied under the personal `Franias` GitHub account.
- **Git author identity (intentional):**
  - `user.name = franciellidias`
  - `user.email = franciellipdias@gmail.com`
  - Configured globally at `~/.gitconfig`. Do NOT change it to another account without explicit user approval — commits on this repo must attribute to francielli's personal GitHub.
- **Auth:**
  - SSH key already authenticates as `Franias` on `git@github.com` (use `ssh://git@github.com/...` or HTTPS — both work).
  - `gh` CLI on this machine is logged in as a different account (`marceloprates`). If a `gh` command needs to act on this repo on francielli's behalf, run `gh auth switch --user Franias` first, or pass `--user Franias` to the command. Revert afterwards if other work depends on the marceloprates session.
- **Remote setup:**
  - `origin` → `git@github.com:Franias/djcremosa.git` (SSH)
  - No `upstream` remote is configured. If syncing from the original source, add it explicitly and ask before rebasing/merging.

## Reference

See `SPEC.md` for the full product spec, brand identity, and stack notes.