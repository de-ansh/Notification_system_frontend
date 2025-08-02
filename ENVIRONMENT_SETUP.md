# Environment Setup

This document explains how to configure API endpoints and environment variables for the notification system frontend.

## Option 1: Using .env file (Recommended)

Create a `.env` file in the root of the frontend directory with the following variables:

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api
NEXT_PUBLIC_API_TIMEOUT=10000

# WebSocket Configuration
NEXT_PUBLIC_WS_URL=http://localhost:3001

# Environment
NODE_ENV=development

# Optional: Authentication (if needed)
# NEXT_PUBLIC_AUTH_ENDPOINT=http://localhost:3001/auth
# NEXT_PUBLIC_REFRESH_TOKEN_ENDPOINT=http://localhost:3001/auth/refresh

# Optional: Feature flags
# NEXT_PUBLIC_ENABLE_NOTIFICATIONS=true
# NEXT_PUBLIC_ENABLE_REAL_TIME_UPDATES=true
```

## Option 2: Using the config file

The project includes a `config/env.config.js` file that provides default values and can be imported directly:

```javascript
import config from '../config/env.config.js';

// Use the API base URL
const apiUrl = config.api.baseUrl;

// Use WebSocket URL
const wsUrl = config.websocket.url;
```

## Environment Variables Explained

### Required Variables

- `NEXT_PUBLIC_API_BASE_URL`: The base URL for your backend API
- `NEXT_PUBLIC_WS_URL`: The WebSocket server URL for real-time updates

### Optional Variables

- `NEXT_PUBLIC_API_TIMEOUT`: API request timeout in milliseconds (default: 10000)
- `NEXT_PUBLIC_AUTH_ENDPOINT`: Authentication endpoint URL
- `NEXT_PUBLIC_REFRESH_TOKEN_ENDPOINT`: Token refresh endpoint URL
- `NEXT_PUBLIC_ENABLE_NOTIFICATIONS`: Enable/disable notifications (default: true)
- `NEXT_PUBLIC_ENABLE_REAL_TIME_UPDATES`: Enable/disable real-time updates (default: true)

## Production Setup

For production, update the URLs to point to your production servers:

```env
NEXT_PUBLIC_API_BASE_URL=https://your-api-domain.com/api
NEXT_PUBLIC_WS_URL=https://your-api-domain.com
NODE_ENV=production
```

## Security Notes

- Only variables prefixed with `NEXT_PUBLIC_` are exposed to the browser
- Sensitive information like API keys should be handled server-side
- The `.env` file should be added to `.gitignore` to prevent committing sensitive data 