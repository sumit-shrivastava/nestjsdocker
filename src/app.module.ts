import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
//import {TypeOrmModule} from '@nestjs/typeorm';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
//import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from './config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: configService.get('DB_TYPE'),
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_DATABASE'),
          entities: [__dirname + './../**/**.entity{.ts,.js}'],
          synchronize: configService.get('DB_SYNC') === 'true',
          ssl: configService.get('DB_SSL') === 'true'
        } as TypeOrmModuleAsyncOptions;
      },
    }),
    ConfigModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
