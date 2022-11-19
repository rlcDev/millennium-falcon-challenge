import { Module } from '@nestjs/common';
import { ControllersModule } from 'controllers/controllers.module';
import { ConfigModule } from '@nestjs/config';
import universeJson from './config/configuration';
import { ServicesModule } from './services/services.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [universeJson],
      isGlobal: true,
    }),
    ServicesModule,
    ControllersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
