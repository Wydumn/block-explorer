import { NestFactory } from '@nestjs/core';

import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

import { useContainer } from 'class-validator';

import { AppModule } from './app.module';

async function bootstrap() {
    // fastify
    const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(), {
        cors: true,
        // only log error warn
        logger: ['error', 'warn', 'log'],
    });
    app.setGlobalPrefix('api');
    // enable container for constraints in validation
    useContainer(app.select(AppModule), {
        fallbackOnErrors: true,
    });
    await app.listen(3100, () => {
        console.log();
        console.log('api: http://localhost:3100');
    });
}
bootstrap();
