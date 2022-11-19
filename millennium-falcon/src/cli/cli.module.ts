import { Module } from '@nestjs/common';
import { R2d2Command } from 'cli/r2d2.command';
import { OddMissionService } from 'services/odd-mission/odd-mission.service';
import { ConfigModule } from '@nestjs/config';
import { ServicesModule } from 'services/services.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [R2d2Command.falconConfig],
      isGlobal: true,
    }),
    ServicesModule,
  ],
  providers: [OddMissionService, R2d2Command],
})
export class CliModule {}
