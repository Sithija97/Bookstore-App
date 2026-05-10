# Bookstore App API

A Node.js application built with TypeScript and Express.

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
```

2. Build the TypeScript:

```bash
npm run build
```

### Development

Run the app in development mode with hot-reload:

```bash
npm run dev
```

### Production

Build and start the application:

```bash
npm run build
npm start
```

## Project Structure

```
src/
  └── index.ts          # Application entry point
dist/                   # Compiled JavaScript output
package.json           # Project dependencies and scripts
tsconfig.json          # TypeScript configuration
.gitignore            # Git ignore rules
```

## Scripts

- `npm run dev` - Start development server with ts-node
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run the compiled application
- `npm run clean` - Remove dist directory
