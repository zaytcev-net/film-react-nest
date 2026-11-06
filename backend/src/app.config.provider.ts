import { ConfigService } from '@nestjs/config';

export const configProvider = {
  provide: 'CONFIG',

  inject: [ConfigService],

  useFactory: (configService: ConfigService): AppConfig => ({
    port: Number(configService.get<string>('PORT') ?? 3000),
    database: {
      driver: configService.get<string>('DATABASE_DRIVER') ?? 'postgres',
      url: configService.get<string>('DATABASE_URL') ?? 'localhost',
      username: configService.get<string>('DATABASE_USERNAME') ?? '',
      password: configService.get<string>('DATABASE_PASSWORD') ?? '',
      name: configService.get<string>('DATABASE_NAME') ?? 'films',
      port: Number(configService.get<string>('DATABASE_PORT') ?? 5432),
    },
  }),
};

export interface AppConfig {
  port: number;
  database: AppConfigDatabase;
}

export interface AppConfigDatabase {
  driver: string;
  url: string;
  username: string;
  password: string;
  name: string;
  port: number;
}
