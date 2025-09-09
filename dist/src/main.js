"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const microservices_1 = require("@nestjs/microservices");
const app_module_1 = require("./app.module");
const config_1 = require("@nestjs/config");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
    }));
    app.enableCors({
        origin: configService.get('cors.allowedOrigins'),
        credentials: true,
    });
    app.setGlobalPrefix('api/v1');
    if (configService.get('NODE_ENV') !== 'production') {
        const config = new swagger_1.DocumentBuilder()
            .setTitle('Visual Canvas Brainstorm API')
            .setDescription('Microservices API for collaborative canvas brainstorming')
            .setVersion('1.0')
            .addBearerAuth()
            .addTag('auth', 'Authentication endpoints')
            .addTag('canvas', 'Canvas management')
            .addTag('users', 'User management')
            .addTag('rooms', 'Room management')
            .addTag('chat', 'Chat functionality')
            .build();
        const document = swagger_1.SwaggerModule.createDocument(app, config);
        swagger_1.SwaggerModule.setup('api/docs', app, document);
    }
    const rmqUrl = configService.get('rabbitmq.url');
    app.connectMicroservice({
        transport: microservices_1.Transport.RMQ,
        options: {
            urls: [rmqUrl],
            queue: 'main_queue',
            queueOptions: {
                durable: true,
            },
        },
    });
    await app.startAllMicroservices();
    const port = configService.get('port') || 3000;
    await app.listen(port);
    console.log(`🚀 API Gateway running on: http://localhost:${port}`);
    console.log(`📚 Swagger docs: http://localhost:${port}/api/docs`);
}
bootstrap();
//# sourceMappingURL=main.js.map