export default () => ({
  port: parseInt(process.env.PORT || '3003', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  
  database: {
    uri: process.env.MONGODB_URI,
    connectionTimeout: 30000,
    maxPoolSize: 10,
  },
  
  rabbitmq: {
    url: process.env.RABBITMQ_URL || 'amqp://localhost:5672',
    queuePrefix: 'canvas',
  },
  
  websocket: {
    port: parseInt(process.env.WS_PORT || '3003', 10),
    allowedOrigins: process.env.CLIENT_URL?.split(',') || ['http://localhost:3000'],
    pingTimeout: 60000,
    pingInterval: 25000,
  },
  
  services: {
    user: {
      url: process.env.USER_SERVICE_URL || 'amqp://localhost:5672',
      queue: 'user-service',
    },
    room: {
      url: process.env.ROOM_SERVICE_URL || 'amqp://localhost:5672', 
      queue: 'room-service',
    },
    auth: {
      url: process.env.RABBITMQ_URL || 'amqp://localhost:5672',
      queue: 'auth-service',
    },
  },
  
  canvas: {
    maxShapesPerCanvas: 1000,
    maxCanvasSize: { width: 5000, height: 5000 },
    autoSaveInterval: 5000, // 5 seconds
    maxHistorySteps: 50,
  },
  
  collaboration: {
    maxUsersPerCanvas: 20,
    cursorUpdateInterval: 100, // milliseconds
    presenceTimeout: 30000, // 30 seconds
  },
  
  export: {
    maxFileSize: 50 * 1024 * 1024, // 50MB
    supportedFormats: ['png', 'jpg', 'svg', 'pdf'],
    quality: {
      png: 0.9,
      jpg: 0.85,
    },
  },
});
