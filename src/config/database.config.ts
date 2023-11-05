import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const database = (): TypeOrmModuleOptions => ({
    // mysql
    charset: 'utf8mb4',
    logging: ['error'],
    type: 'mysql',
    host: '127.0.0.1',
    port: 3306,
    username: 'root',
    password: '123456',
    database: 'explorer',
    synchronize: true,  // only in dev environment
    autoLoadEntities: true,
});
