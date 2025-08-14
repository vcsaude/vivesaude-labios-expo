# GitHub Repository Variables & Secrets

This repo provides a helper script to export your `.env` values to GitHub Repository Variables and Secrets.

## Requirements
- GitHub CLI installed and authenticated: `gh auth login`
- A populated `.env` (recommended) or `.env.example` as fallback

## Export all values
```bash
# From repo root — detects origin owner/name
npm run gh:vars:export

# Or explicitly pass repo
bash .github/scripts/gh-export-env.sh OWNER/REPO
```

- Public-ish config is stored as Repository Variables
- Sensitive values are stored as Repository Secrets
- Missing values are skipped (reported as [skip])

## Notes
- Review `.github/scripts/gh-export-env.sh` to see which keys are treated as secrets vs variables.
- You can override values at call time by exporting shell env vars (they take precedence over .env).
- GitHub Variables/Secrets are consumed by Actions via `${{ vars.MY_KEY }}` and `${{ secrets.MY_SECRET }}`.

## CI usage example
```yaml
# .github/workflows/config-check.yml
name: Config Check
on: [workflow_dispatch]
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - run: |
          test -n "${{ vars.API_BASE_URL }}" || (echo 'API_BASE_URL missing' && exit 1)
          test -n "${{ secrets.EXPO_TOKEN }}" || (echo 'EXPO_TOKEN missing' && exit 1)
```

