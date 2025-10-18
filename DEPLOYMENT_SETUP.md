# GitHub Pages Deployment Setup Guide

This document provides step-by-step instructions for the repository owner to complete the GitHub Pages deployment setup.

## Changes Made

The following changes have been implemented to fix GitHub Pages deployment:

1. ✅ **next.config.js**: Added `basePath` and `assetPrefix` for proper GitHub Pages routing
2. ✅ **Environment Variables**: Created `.env.example` and updated code to use `NEXT_PUBLIC_HASURA_URL` and `NEXT_PUBLIC_HASURA_ADMIN_SECRET`
3. ✅ **GitHub Actions**: Updated workflow to inject environment variables during build
4. ✅ **Documentation**: Complete README with deployment instructions
5. ✅ **.nojekyll**: Added to prevent GitHub Pages from ignoring `_next` directory

## Required Actions by Repository Owner

### 1. Configure GitHub Secrets

You need to add your Hasura credentials as GitHub Secrets:

1. Go to your repository on GitHub
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add these two secrets:

   **Secret 1: NEXT_PUBLIC_HASURA_URL**
   - Name: `NEXT_PUBLIC_HASURA_URL`
   - Value: Your Hasura GraphQL endpoint (e.g., `https://your-project.hasura.app/v1/graphql`)

   **Secret 2: NEXT_PUBLIC_HASURA_ADMIN_SECRET**
   - Name: `NEXT_PUBLIC_HASURA_ADMIN_SECRET`
   - Value: Your Hasura admin secret

### 2. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under **Source**, select:
   - Source: **Deploy from a branch**
   - Branch: **gh-pages** / **(root)**
4. Click **Save**

### 3. Configure Hasura CORS

To allow API calls from your GitHub Pages site:

1. Go to your Hasura Cloud console
2. Navigate to your project settings
3. Find **Allowed Origins** or **CORS Settings**
4. Add these origins:
   - `https://<your-username>.github.io` (replace with your GitHub username)
   - `http://localhost:3000` (for local development)
5. Save the changes

### 4. Trigger the Deployment

Once secrets are configured:

1. Merge this PR to the `main` branch
2. The GitHub Action will automatically trigger and deploy to GitHub Pages
3. Wait a few minutes for the deployment to complete

Alternatively, you can manually trigger the workflow:
1. Go to **Actions** tab
2. Select **Build and Deploy Static Site**
3. Click **Run workflow**
4. Select the `main` branch
5. Click **Run workflow**

### 5. Verify the Deployment

After deployment completes:

1. Visit: `https://<your-username>.github.io/devet_frontend/` (replace with your GitHub username)
2. Open browser DevTools (F12) → Network tab
3. Test the menu functionality to ensure:
   - All assets load correctly (no 404s for `_next/static/*`)
   - GraphQL queries reach Hasura successfully
   - No CORS errors in console

## Testing Locally

To test the configuration locally before deploying:

1. Create `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and add your Hasura credentials:
   ```
   NEXT_PUBLIC_HASURA_URL=https://your-project.hasura.app/v1/graphql
   NEXT_PUBLIC_HASURA_ADMIN_SECRET=your-actual-secret-here
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Test at http://localhost:3000

## Troubleshooting

### If assets don't load (404 errors)
- Check that the site is deployed to the `gh-pages` branch
- Verify GitHub Pages is enabled and pointing to `gh-pages` branch
- Wait a few minutes after deployment for changes to propagate

### If Hasura API calls fail
- Verify GitHub Secrets are set correctly
- Check Hasura CORS settings include your GitHub Pages domain
- Look for CORS errors in browser console
- Verify the admin secret is correct

### If the build fails
- Check the Actions logs for specific errors
- Ensure both secrets are configured
- Verify the workflow syntax is correct

## Security Notes

- ⚠️ **Never commit `.env.local` to git** - it's already in `.gitignore`
- ⚠️ **Never commit Hasura secrets** - use GitHub Secrets instead
- ✅ Environment variables prefixed with `NEXT_PUBLIC_` are embedded in the static build
- ✅ GitHub Secrets are only accessible during the build process

## Next Steps

After successful deployment:

1. Remove any hardcoded secrets from the old codebase (if any remain)
2. Test all functionality on the live site
3. Monitor the site for any console errors
4. Consider adding a custom domain (optional)

---

For more information, see the main [README.md](README.md).
