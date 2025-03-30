import { Logger, Module, ValidationPipe } from '@nestjs/common';
import { ChatModule } from './chat/chat.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { ErrorFilter } from './filter/error.filters';


@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      cache: false,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('MYSQL_HOST'),
        port: parseInt(configService.get('MYSQL_PORT')!, 10),
        username: configService.get('MYSQL_USER'),
        password: configService.get('MYSQL_PASSWORD'),
        database: configService.get('MYSQL_DATABASE'),
        extra: {
          ssl: false,
        },
        autoLoadEntities: true,
        synchronize: configService.get('MYSQL_SYNC'),
      }),
    }),

    ChatModule, 
    UserModule,
  ],
  providers: [
    Logger,
    {
      provide: APP_INTERCEPTOR,
      useClass: ErrorInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: ErrorFilter,
    },

    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}

