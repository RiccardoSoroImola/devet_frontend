# Devet Web (Frontend)

Next.js frontend application for Devet, deployed on GitHub Pages.

## Getting Started

### Prerequisites

- Node.js 18+ or 20+
- pnpm (recommended for monorepo management)

### Installation

From the repository root:

```bash
pnpm install
```

Or from this directory:

```bash
cd apps/web
pnpm install
```

### Configuration

1. Copy the example environment file:
   ```bash
   cp ../../.env.example .env.local
   ```

2. Edit `.env.local` and add your Hasura credentials:
   - `NEXT_PUBLIC_HASURA_URL`: Your Hasura GraphQL endpoint
   - `NEXT_PUBLIC_HASURA_ADMIN_SECRET`: Your Hasura admin secret

### Development

Start the development server:

```bash
pnpm dev
```

Or from the repository root:

```bash
pnpm dev:web
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### Building

Build for production:

```bash
pnpm build
```

This will create an optimized production build and export static files to the `out/` directory.

### Production

Start the production server:

```bash
pnpm start
```

Or from the repository root:

```bash
pnpm start:web
```

### Linting

Check code style:

```bash
pnpm lint
```

## Project Structure

```
apps/web/
├── app/
│   ├── checkout/       # Checkout page
│   ├── components/     # Reusable components
│   ├── demo/           # Demo page
│   ├── hooks/          # Custom React hooks
│   ├── menu/           # Menu page
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page
├── public/             # Static assets
├── next.config.js      # Next.js configuration
├── tailwind.config.ts  # Tailwind CSS configuration
├── postcss.config.mjs  # PostCSS configuration
└── package.json
```

## Features

- ⚡ Next.js 15 with App Router
- 🎨 Tailwind CSS for styling
- 📱 Responsive design
- 🔄 Integration with Hasura GraphQL
- 📦 Static site generation for GitHub Pages

## Deployment

### GitHub Pages

The frontend is automatically deployed to GitHub Pages when pushing to the `main` branch.

Configuration in `next.config.js`:
- `output: 'export'` - Enable static export
- `basePath: '/devet_frontend'` - Base path for GitHub Project Pages
- `assetPrefix: '/devet_frontend/'` - Asset prefix for correct loading

See the root [README.md](../../README.md#deploying-to-github-pages) for detailed deployment instructions.

## Environment Variables

- `NEXT_PUBLIC_HASURA_URL` - Hasura GraphQL endpoint URL
- `NEXT_PUBLIC_HASURA_ADMIN_SECRET` - Hasura admin secret

⚠️ Never commit `.env.local` to git - it's already in `.gitignore`

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Documentation](https://react.dev)

## License

See root repository LICENSE file.
