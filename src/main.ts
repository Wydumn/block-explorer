import { NestFactory } from '@nestjs/core';

import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

import { useContainer } from 'class-validator';

import { AppModule } from './app.module';
import { AppLoggerService } from './modules/logger/logger.service';

async function bootstrap() {
    // fastify
    const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(), {
        cors: true,
        bufferLogs: true,
    });
    app.setGlobalPrefix('api');
    // enable container for constraints in validation
    useContainer(app.select(AppModule), {
        fallbackOnErrors: true,
    });
    app.useLogger(app.get(AppLoggerService))
    await app.listen(3100, () => {
        console.log('api: http://localhost:3100');
    });
}
bootstrap();
