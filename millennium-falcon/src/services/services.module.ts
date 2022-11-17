import { Module } from '@nestjs/common';
import { EmpireService } from 'services/empire/empire.service';
import { OddMissionService } from 'services/odd-mission/odd-mission.service';
import { RepositoryModule } from 'repositories/repositoryModule';
import { RoutesService } from 'services/routes/routes.service';
import {UniverseService} from "services/universe/universe.service";

@Module({
  imports: [RepositoryModule],
  providers: [EmpireService, RoutesService, OddMissionService, UniverseService],
  exports: [EmpireService, UniverseService],
})
export class ServicesModule {}
