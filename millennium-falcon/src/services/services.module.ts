import { Module } from "@nestjs/common";
import { EmpireService } from "services/empire/empire.service";
import { OddMissionService } from "services/odd-mission/odd-mission.service";
import { RepositoryModule } from "repositories/repositoryModule";
import { RoutesService } from "services/routes/routes.service";
import { UniverseService } from "services/universe/universe.service";
import { CacheModule } from "@nestjs/cache-manager";

@Module({
  imports: [RepositoryModule, CacheModule.register({
    max: 2,
    ttl: 600000 // 10 min
  })],
  providers: [
    EmpireService,
    RoutesService,
    OddMissionService,
    UniverseService
  ],
  exports: [OddMissionService, UniverseService, EmpireService]
})
export class ServicesModule {
}
