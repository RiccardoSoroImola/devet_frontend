# Devet API

Backend API for the Devet application built with Node.js, Express, and TypeScript.

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
cd apps/api
pnpm install
```

### Configuration

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and configure your settings:
   - `PORT`: Server port (default: 4000)
   - `NODE_ENV`: Environment mode (development/production)

### Development

Start the development server with hot reload:

```bash
pnpm dev
```

The API will be available at `http://localhost:4000`

### Building

Build the TypeScript code:

```bash
pnpm build
```

### Production

Run the built application:

```bash
pnpm start
```

### Testing

Run tests:

```bash
pnpm test
```

### Linting

Check code style:

```bash
pnpm lint
```

## Project Structure

```
apps/api/
├── src/
│   ├── controllers/    # Request handlers
│   ├── routes/         # API route definitions
│   ├── services/       # Business logic
│   ├── models/         # Data models and types
│   ├── __tests__/      # Test files
│   └── index.ts        # Application entry point
├── dist/               # Compiled JavaScript (generated)
├── package.json
├── tsconfig.json
└── README.md
```

## API Endpoints

### Health Check

- **GET** `/health` - Check if the API is running
  ```json
  {
    "status": "OK",
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
  ```

### Example Endpoints

- **GET** `/api/example` - Get example data
- **POST** `/api/example` - Create example data

## Deployment

This API is designed to be deployed on Render or similar platforms.

### Render Configuration

1. Create a new Web Service on Render
2. Connect your repository
3. Configure build and start commands:
   - Build Command: `cd apps/api && pnpm install && pnpm build`
   - Start Command: `cd apps/api && pnpm start`
4. Set environment variables in Render dashboard
5. Deploy

## Development Notes

- The API uses Express.js as the web framework
- TypeScript for type safety
- CORS enabled for cross-origin requests
- JSON body parsing enabled
- Hot reload in development mode with ts-node-dev

## Contributing

When adding new features:

1. Create controllers in `src/controllers/`
2. Define routes in `src/routes/`
3. Implement business logic in `src/services/`
4. Define data models in `src/models/`
5. Add tests in `src/__tests__/`
6. Update this README with new endpoints

## License

See root repository LICENSE file.
