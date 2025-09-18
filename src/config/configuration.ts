export default () => ({
  port: parseInt(process.env.PORT, 10) || 3002,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Database configurations
  database: {
    mongodb: {
      uri: (process.env.MONGODB_URI && process.env.MONGODB_URI !== 'undefined') ? process.env.MONGODB_URI : 'mongodb://localhost:27017/visual-canvas-main',
    },
    redis: {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT, 10) || 6379,
      password: process.env.REDIS_PASSWORD,
    },
  },

  // Message queue configuration
  rabbitmq: {
    url: process.env.RABBITMQ_URL || 'amqp://localhost:5672',
    exchanges: {
      canvas: 'canvas.events',
      user: 'user.events',
      chat: 'chat.events',
      auth: 'auth.events',
    },
  },

  // Microservices configuration
  services: {
    auth: {
      url: process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
      queue: 'auth-service',
    },
    canvas: {
      url: process.env.CANVAS_SERVICE_URL || 'http://localhost:3002',
      queue: 'canvas-service',
    },
    user: {
      url: process.env.USER_SERVICE_URL || 'http://localhost:3003',
      queue: 'user-service',
    },
    chat: {
      url: process.env.CHAT_SERVICE_URL || 'http://localhost:3004',
      queue: 'chat-service',
    },
    shapes: {
      url: process.env.SHAPES_SERVICE_URL || 'http://localhost:3005',
      queue: 'shapes-service',
    },
  },

  // JWT configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  },

  // CORS configuration
  cors: {
    allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || [
      'http://localhost:3000',
      'http://localhost:3001',
    ],
  },

  // Rate limiting
  rateLimit: {
    ttl: parseInt(process.env.RATE_LIMIT_TTL, 10) || 60,
    limit: parseInt(process.env.RATE_LIMIT_MAX, 10) || 10,
  },
});
