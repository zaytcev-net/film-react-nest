import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigAppModule } from './app.config.module';
import * as path from 'node:path';

import { AppConfig } from './app.config.provider';

import { FilmsModule } from './films/films.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigAppModule],
      inject: ['CONFIG'],
      useFactory: (config: AppConfig) => ({
        type: 'postgres',
        host: config.database.url,
        port: config.database.port,
        username: config.database.username,
        password: config.database.password,
        database: config.database.name,
        autoLoadEntities: true,
        synchronize: false,
      }),
    }),

    FilmsModule,
    OrderModule,

    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, '../public/content/afisha'),
      serveRoot: '/content/afisha',
    }),
  ],
})
export class AppModule {}
