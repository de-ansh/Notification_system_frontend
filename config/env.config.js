// Environment Configuration for API Endpoints
const config = {
  // API Configuration
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api',
    timeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT) || 10000,
  },
  
  // WebSocket Configuration
  websocket: {
    url: process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3001',
  },
  
  // Environment
  environment: process.env.NODE_ENV || 'development',
  
  // Optional: Authentication endpoints
  auth: {
    login: process.env.NEXT_PUBLIC_AUTH_ENDPOINT || 'http://localhost:3001/auth',
    refresh: process.env.NEXT_PUBLIC_REFRESH_TOKEN_ENDPOINT || 'http://localhost:3001/auth/refresh',
  },
  
  // Optional: Feature flags
  features: {
    notifications: process.env.NEXT_PUBLIC_ENABLE_NOTIFICATIONS !== 'false',
    realTimeUpdates: process.env.NEXT_PUBLIC_ENABLE_REAL_TIME_UPDATES !== 'false',
  },
};

export default config; 