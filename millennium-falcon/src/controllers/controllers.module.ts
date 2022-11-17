import {Module} from '@nestjs/common';
import {ServicesModule} from 'services/services.module';
import {EmpireController} from 'controllers/empire/empire.controller';
import {OddMissionService} from "services/odd-mission/odd-mission.service";
import {EmpireService} from "services/empire/empire.service";

@Module({
    imports: [ServicesModule],
    providers: [EmpireService, OddMissionService],
    controllers: [EmpireController],
})
export class ControllersModule {
}
