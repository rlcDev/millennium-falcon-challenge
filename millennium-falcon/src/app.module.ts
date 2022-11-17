import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';
import universeJson from 'config/configuration';
import { ControllersModule } from './controllers/controllers.module';
import { ServicesModule } from './services/services.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [universeJson],
      isGlobal: true,
    }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        dialect: 'sqlite',
        logging: false,
        storage: configService.get<string>('routes_db'),
        retryAttempts: 2,
        retryDelay: 5000,
        autoLoadModels: true,
      }),
      inject: [ConfigService],
    }),
    ControllersModule,
    ServicesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
