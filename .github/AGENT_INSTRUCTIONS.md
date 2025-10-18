# Copilot Agent Instructions
- Use feature branches with prefix `feature/`
- Run all tests before opening a PR
- Follow conventional commits
- PRs must include changelog updates
- Code style: Prettier + ESLint rules
- For all PRs that change UI, rebuild and redeploy the GitHub Pages preview.
- Run `npm ci && npm run build` to generate static files in `dist`.
- The workflow `.github/workflows/deploy.yml` handles automatic deployment.
