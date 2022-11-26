import { Module } from "@nestjs/common";
import { ServicesModule } from "services/services.module";
import { OddMissionController } from "controllers/odd-mission/odd-mission.controller";
import { OddMissionService } from "services/odd-mission/odd-mission.service";

@Module({
  imports: [ServicesModule],
  providers: [OddMissionService],
  controllers: [OddMissionController]
})
export class ControllersModule {
}
