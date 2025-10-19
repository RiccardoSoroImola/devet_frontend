# Devet Monorepo

Full-stack monorepo for Devet application with Next.js frontend and Node.js/Express backend.

---

## 📁 Project Structure

```
devet_frontend/
├── apps/
│   ├── web/              # Next.js frontend application
│   └── api/              # Node.js/Express backend API
├── packages/
│   ├── types/            # Shared TypeScript types
│   └── utils/            # Shared utility functions
├── package.json          # Root workspace configuration
├── pnpm-workspace.yaml   # PNPM workspace definition
└── tsconfig.json         # Root TypeScript config with project references
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ or 20+
- pnpm 8+ (install with `npm install -g pnpm`)

### Installation

Install all dependencies for all workspaces:

```bash
pnpm install
```

### Development

Run both frontend and backend in development mode:

```bash
pnpm dev
```

Or run them separately:

```bash
# Frontend only (http://localhost:3000)
pnpm dev:web

# Backend only (http://localhost:4000)
pnpm dev:api
```

### Building

Build all applications:

```bash
pnpm build
```

Or build individually:

```bash
pnpm build:web
pnpm build:api
```

### Production

Start production servers:

```bash
# Frontend
pnpm start:web

# Backend
pnpm start:api
```

---

## Table of Contents

- [Frontend (Web)](#frontend-web)
- [Backend (API)](#backend-api)
- [Environment Variables](#environment-variables)
- [Deploying to GitHub Pages](#deploying-to-github-pages)
- [Deploying to Render](#deploying-to-render)
- [Configuration](#configuration)
- [Troubleshooting](#troubleshooting)

---

## Frontend (Web)

The frontend is a Next.js application located in `apps/web/`.

### Development

```bash
pnpm dev:web
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

See [apps/web/README.md](apps/web/README.md) for more details.

---

## Backend (API)

The backend is a Node.js/Express API located in `apps/api/`.

### Development

```bash
pnpm dev:api
```

API will be available at [http://localhost:4000](http://localhost:4000).

Health check: [http://localhost:4000/health](http://localhost:4000/health)

See [apps/api/README.md](apps/api/README.md) for more details.

---

## Environment Variables

### Frontend (apps/web)

Create `apps/web/.env.local`:

- **NEXT_PUBLIC_HASURA_URL**: Your Hasura GraphQL endpoint URL
  - Example: `https://your-project.hasura.app/v1/graphql`
  
- **NEXT_PUBLIC_HASURA_ADMIN_SECRET**: Your Hasura admin secret
  - **Important**: Never commit this value to the repository
  - For local development, set it in `.env.local`
  - For GitHub Pages deployment, set it as a GitHub Secret

### Backend (apps/api)

Create `apps/api/.env`:

- **PORT**: Server port (default: 4000)
- **NODE_ENV**: Environment mode (development/production)

---

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

---

## Deploying to Render

The backend API can be deployed to Render:

### Backend Deployment on Render

1. Create a new Web Service on [Render](https://render.com)
2. Connect your GitHub repository
3. Configure the service:
   - **Name**: devet-api
   - **Environment**: Node
   - **Build Command**: `cd apps/api && pnpm install && pnpm build`
   - **Start Command**: `cd apps/api && pnpm start`
   - **Root Directory**: Leave empty (or set to repository root)
4. Add environment variables:
   - `PORT`: 4000 (or use Render's default)
   - `NODE_ENV`: production
5. Deploy

The API will be available at your Render service URL.

### Frontend with Backend Integration

To connect the frontend to your deployed backend:

1. Add backend URL to frontend environment variables
2. Update API calls in the frontend to use the Render URL
3. Ensure CORS is properly configured in the backend

---

## Configuration

The project is configured for GitHub Pages deployment in `apps/web/next.config.js`:

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

### Backend not starting

1. Ensure all dependencies are installed: `pnpm install`
2. Check that the PORT is not already in use
3. Verify environment variables are set correctly
4. Check the console logs for specific error messages

---

## Available Scripts

### Root Level

- `pnpm dev` - Run both frontend and backend in development mode
- `pnpm dev:web` - Run frontend only
- `pnpm dev:api` - Run backend only
- `pnpm build` - Build all applications
- `pnpm build:web` - Build frontend only
- `pnpm build:api` - Build backend only
- `pnpm start:web` - Start frontend in production mode
- `pnpm start:api` - Start backend in production mode
- `pnpm lint` - Lint all applications
- `pnpm test` - Run tests for all applications
- `pnpm clean` - Clean all build artifacts and dependencies

### Individual App Scripts

See individual README files:
- Frontend: [apps/web/README.md](apps/web/README.md)
- Backend: [apps/api/README.md](apps/api/README.md)

---

## Shared Packages

### @devet/types

Shared TypeScript types and interfaces used across frontend and backend.

Location: `packages/types/`

### @devet/utils

Shared utility functions used across frontend and backend.

Location: `packages/utils/`

---

## Contributing

When adding new features:

1. Create new components/pages in `apps/web/` for frontend
2. Create controllers/routes in `apps/api/` for backend
3. Add shared types to `packages/types/`
4. Add shared utilities to `packages/utils/`
5. Update relevant README files
6. Test both frontend and backend
7. Update documentation

---
