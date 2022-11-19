import { Command, CommandRunner } from "nest-commander";
import { OddMissionService } from "../services/odd-mission/odd-mission.service";
import { readFileSync } from "fs";
import _ from "lodash";
import { EmpireDto } from "../controllers/dto/empire.dto";

@Command({
  name: "give-me-the-odds",
  description: "Compute the Falcon challenge mission odd"
})
export class R2d2Command extends CommandRunner {
  constructor(private readonly oddMissionService: OddMissionService) {
    super();
  }

  static falconConfig = () => {
    let value;
    let args: string[] = _.cloneDeep(process.argv);
    args = args.splice(3);
    if (args && args.length > 1) {
      const falconPath = args[0];
      const falcon = readFileSync(falconPath, { encoding: "utf-8" });
      value = JSON.parse(falcon);
    }
    return value;
  };

  async run(
    passedParams: string[],
    options?: Record<string, any>
  ): Promise<void> {
    const empireDto: EmpireDto = JSON.parse(readFileSync(passedParams[1], { encoding: "utf-8" }));
    console.log(await this.oddMissionService.tellMeTheOdds(empireDto));
  }
}
