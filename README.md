# Devet Frontend

Next.js application for Devet deployed on GitHub Pages.

---

## Table of Contents

- [Building Locally](#building-locally)
- [Environment Variables](#environment-variables)
- [Deploying to GitHub Pages](#deploying-to-github-pages)
- [Configuration](#configuration)
- [Troubleshooting](#troubleshooting)

---

## Building Locally

To work locally with this project:

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file from the example:
   ```bash
   cp .env.example .env.local
   ```
4. Edit `.env.local` and add your Hasura credentials
5. Run the development server:
   ```bash
   npm run dev
   ```
6. Open [http://localhost:3000](http://localhost:3000) in your browser

Read more at the Next.js [documentation](https://nextjs.org/docs).

## Environment Variables

This application requires the following environment variables:

- **NEXT_PUBLIC_HASURA_URL**: Your Hasura GraphQL endpoint URL
  - Example: `https://your-project.hasura.app/v1/graphql`
  
- **NEXT_PUBLIC_HASURA_ADMIN_SECRET**: Your Hasura admin secret
  - **Important**: Never commit this value to the repository
  - For local development, set it in `.env.local`
  - For GitHub Pages deployment, set it as a GitHub Secret

### Setting up Environment Variables

#### Local Development

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and replace the placeholder values with your actual Hasura credentials

#### GitHub Pages Deployment

To deploy on GitHub Pages with proper Hasura configuration:

1. Go to your GitHub repository → Settings → Secrets and variables → Actions
2. Add the following secrets:
   - `NEXT_PUBLIC_HASURA_URL`: Your Hasura GraphQL endpoint
   - `NEXT_PUBLIC_HASURA_ADMIN_SECRET`: Your Hasura admin secret

## Deploying to GitHub Pages

This project is configured to deploy automatically to GitHub Pages using GitHub Actions.

### Automatic Deployment

The deployment happens automatically when you push to the `main` branch. The workflow:

1. Checks out the code
2. Sets up Node.js
3. Installs dependencies
4. Builds the project with environment variables from GitHub Secrets
5. Deploys the `out/` folder to the `gh-pages` branch

### Manual Deployment

You can also trigger a manual deployment:

1. Go to Actions tab in your GitHub repository
2. Select the "Build and Deploy Static Site" workflow
3. Click "Run workflow"

### Verify Deployment

After deployment, your site will be available at:
```
https://<username>.github.io/devet_frontend/
```

The site is configured with:
- `basePath: '/devet_frontend'` - ensures correct routing
- `assetPrefix: '/devet_frontend/'` - ensures assets load from correct path

## Configuration

The project is configured for GitHub Pages deployment in `next.config.js`:

```javascript
const nextConfig = {
  output: 'export',                    // Enable static export
  basePath: '/devet_frontend',         // Base path for GitHub Project Pages
  assetPrefix: '/devet_frontend/',     // Asset prefix for correct loading
  images: {
    unoptimized: true,                 // Required for static export
  },
};
```

### Why basePath and assetPrefix?

GitHub Pages hosts project pages at `https://username.github.io/repository-name/`, not at the root. The `basePath` and `assetPrefix` settings ensure:

- All internal links work correctly (e.g., `/checkout` becomes `/devet_frontend/checkout`)
- All assets (_next/static/*) are loaded from the correct path
- The application routes work properly without 404 errors

## Troubleshooting

### Assets not loading (404 errors)

If you see 404 errors for `_next/static/*` files:

1. Verify that `basePath` and `assetPrefix` are correctly set in `next.config.js`
2. Ensure the site is deployed to the `gh-pages` branch
3. Check that GitHub Pages is enabled in your repository settings and pointing to the `gh-pages` branch

### Hasura API calls failing

If GraphQL queries are failing:

1. Verify environment variables are set correctly in GitHub Secrets
2. Check that the Hasura endpoint URL is accessible from the browser
3. Verify CORS settings in your Hasura Cloud console allow requests from your GitHub Pages domain
4. Ensure the admin secret is correct and not expired

### CORS errors

If you see CORS errors in the browser console:

1. Go to your Hasura Cloud console
2. Navigate to Settings → Allowed Origins
3. Add your GitHub Pages URL: `https://<username>.github.io`
4. Save the changes

### Build failing in GitHub Actions

1. Check that all required secrets are set in GitHub repository settings
2. Verify the workflow file syntax is correct
3. Check the Actions logs for specific error messages

---
