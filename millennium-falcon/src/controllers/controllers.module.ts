import { Module } from "@nestjs/common";
import { ServicesModule } from "services/services.module";
import { MissionOddController } from "controllers/mission-odd/mission-odd.controller";
import { OddMissionService } from "services/odd-mission/odd-mission.service";

@Module({
  imports: [ServicesModule],
  providers: [OddMissionService],
  controllers: [MissionOddController]
})
export class ControllersModule {
}
