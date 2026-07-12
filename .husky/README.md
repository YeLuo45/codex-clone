# Local git hooks

This folder contains hooks wired via `git config core.hooksPath .husky`.

| File            | Trigger       | Action                                       |
| --------------- | ------------- | -------------------------------------------- |
| `pre-commit`    | `git commit`  | Runs `npm run verify` inside `web/`          |

## One-time setup

After cloning the repo (or pulling this commit for the first time):

```bash
git config core.hooksPath .husky
chmod +x .husky/pre-commit
```

`core.hooksPath` lives in your local `.git/config`, so it doesn't pollute
the repo. To enable the gate repo-wide for everyone, add to `.gitconfig`:

```ini
[core]
    hooksPath = .husky
```

## Why no Husky?

Husky adds ~20 deps and an install step. For a single pre-commit hook
that just shells out to `npm run verify`, the standard `core.hooksPath`
mechanism is leaner and works even on a fresh clone.

## Skip when needed

Emergency bypass: `git commit --no-verify -m "..."`
