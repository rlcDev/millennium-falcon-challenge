import { CacheModule, Module } from "@nestjs/common";
import { EmpireService } from "services/empire/empire.service";
import { OddMissionService } from "services/odd-mission/odd-mission.service";
import { RepositoryModule } from "repositories/repositoryModule";
import { RoutesService } from "services/routes/routes.service";
import { UniverseService } from "services/universe/universe.service";

@Module({
  imports: [RepositoryModule, CacheModule.register()],
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
