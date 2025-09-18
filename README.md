# Visual Canvas Brainstorm Backend

A collaborative visual brainstorming platform backend built with NestJS microservices architecture.

## 🏗️ Architecture

This project consists of 6 microservices:

- **🔐 Auth Service** - Authentication and authorization
- **👥 User Service** - User management and profiles
- **🎨 Canvas Service** - Canvas CRUD operations and real-time collaboration
- **💬 Chat Service** - Real-time messaging and comments
- **🔷 Shapes Service** - Shape management and transformations
- **🚪 Gateway Service** - API Gateway and routing

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PNPM 8+
- Docker & Docker Compose
- MongoDB
- RabbitMQ

### Installation

```bash
# Clone the repository
git clone https://github.com/chelsynew72/visual-canva-brainstorm-backend.git
cd visual-canva-brainstorm-backend

# Install dependencies for all services
pnpm install

# Start infrastructure (MongoDB, RabbitMQ)
docker-compose up -d mongodb rabbitmq

# Start all services in development mode
pnpm services:start
```

### Individual Service Development

```bash
# Start specific service
pnpm --filter canvas-service start:dev
pnpm --filter auth-service start:dev
pnpm --filter user-service start:dev

# Build specific service
pnpm --filter canvas-service build

# Test specific service
pnpm --filter canvas-service test
```

## 📦 Services Overview

### Canvas Service (Port: 3001)
- Canvas CRUD operations
- Real-time collaboration via WebSocket
- Shape management integration
- Export functionality

### Auth Service (Port: 3002)
- JWT authentication
- User registration/login
- Role-based access control
- Token management

### User Service (Port: 3003)
- User profile management
- User preferences
- Account settings

### Chat Service (Port: 3004)
- Real-time messaging
- Canvas comments
- Message history

### Shapes Service (Port: 3005)
- Shape creation and manipulation
- Shape templates
- Geometric transformations

### Gateway Service (Port: 3000)
- API routing and aggregation
- Load balancing
- Rate limiting
- CORS handling

## 🔧 Development

### Scripts

```bash
# Development
pnpm start:dev          # Start all services in dev mode
pnpm services:start     # Start services with concurrently

# Building
pnpm build             # Build all services
pnpm services:build    # Build services sequentially

# Testing
pnpm test              # Run all tests
pnpm test:e2e          # Run e2e tests
pnpm test:cov          # Run tests with coverage

# Code Quality
pnpm lint              # Lint all services
pnpm lint:fix          # Fix linting issues
pnpm format            # Format code with Prettier

# Docker
pnpm docker:build      # Build all Docker images
pnpm docker:up         # Start all services with Docker
pnpm docker:down       # Stop Docker services
```

### Environment Variables

Each service requires its own `.env` file. Copy `.env.example` to `.env` in each service directory and configure:

```bash
# Example for canvas-service
cp canvas-service/.env.example canvas-service/.env
```

## 🐳 Docker Deployment

### Development

```bash
# Start infrastructure only
docker-compose up -d mongodb rabbitmq

# Or start everything
docker-compose up -d
```

### Production

```bash
# Build and start production containers
docker-compose -f docker-compose.prod.yml up -d
```

## 🔌 Inter-Service Communication

Services communicate via:
- **HTTP REST APIs** - Synchronous communication
- **RabbitMQ** - Asynchronous messaging
- **WebSocket** - Real-time features

### RabbitMQ Queues
- `auth-service` - Authentication events
- `user-service` - User management events ; 
GET /api/v1/users → should return all users.

GET /api/v1/users/{id} → fetch a single user.

PUT /api/v1/users/{id} → update name or password.

DELETE /api/v1/users/{id} → remove a user.
 
- `canvas-service` - Canvas updates
- `chat-service` - Message routing
- `shapes-service` - Shape events

## 📊 Monitoring & Logging

- Health checks on `/health` endpoint for each service
- Structured logging with Winston
- Metrics collection ready

## 🧪 Testing

```bash
# Unit test
pnpm test

# E2E tests
pnpm test:e2e

# Test coverage
pnpm test:cov

# Test specific service
pnpm --filter canvas-service test
```

## 📁 Project Structure

```
visual-canva-brainstorm-backend/
├── auth-service/           # Authentication microservice
├── canvas-service/         # Canvas management microservice  
├── chat-service/           # Real-time chat microservice
├── gateway-service/        # API Gateway
├── shapes-service/         # Shape management microservice
├── user-service/           # User management microservice
├── docker-compose.yml      # Development containers
├── docker-compose.prod.yml # Production containers
├── package.json           # Root package.json
├── pnpm-workspace.yaml    # PNPM workspace config
└── README.md             # This file
```

## 🚀 Deployment

### Environment Setup

1. **Development**: Local services with Docker infrastructure
2. **Staging**: Docker containers with external databases
3. **Production**: Kubernetes or Docker Swarm with managed services

### Service Ports

- Gateway: 3000
- Canvas: 3001  
- Auth: 3002
- User: 3003
- Chat: 3004
- Shapes: 3005

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Related Projects

- [Visual Canvas Brainstorm Frontend](https://github.com/username/visual-canva-brainstorm-frontend) - React/Next.js frontend

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Contact the development team

---

Built with ❤️ using NestJS and TypeScript
