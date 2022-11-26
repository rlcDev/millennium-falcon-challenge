import { Command, CommandRunner } from "nest-commander";
import { OddMissionService } from "services/odd-mission/odd-mission.service";
import { readFileSync } from "fs";
import _ from "lodash";
import { EmpireDto } from "controllers/dto/empire.dto";
import {
  ERROR,
  INVALID_MILLENNIUM_FILE,
  MISSING_PATHS,
  TOO_MUCH_ARGUMENTS
} from "cli/constants/command.constants";
import path from "path";
import { setRelativePathDynamically } from "utils/path.utils";

@Command({
  name: "give-me-the-odds",
  description: "Compute the mission's odd",
  arguments: "<falcon-path> <empire-path>",
  argsDescription: {
    "falcon-path": "path to the falcon json file",
    "empire-path": "path to the empire json file"
  }
})
export class R2d2Command extends CommandRunner {
  constructor(private readonly oddMissionService: OddMissionService) {
    super();
  }

  static falconConfig = () => {
    let value;
    try {
      // Hack: Nest commander expected the command to have a name
      // At execution: ./give-me-the-odds give-me-the-odds falcon.json empire.json
      // This is not what is expected from the requirement
      process.argv.splice(2, 0, "give-me-the-odds");
      let args: string[] = _.cloneDeep(process.argv);
      args = args.splice(3);
      if (args.length === 0) {
        console.log(MISSING_PATHS);
        process.exit(1);
      }
      if (args && !args.includes("-h") && args.length >= 1) {
        let falconPath: string = args[0];
        if (!falconPath.startsWith("/")) {
          falconPath = path.join("./", falconPath);
        }
        const falcon: string = readFileSync(falconPath, { encoding: "utf-8" });
        value = JSON.parse(falcon);
      } else {
        value = { autonomy: 0, departure: "", arrival: "", routes_db: "" }; // Faking a config to load
      }
    } catch (error) {
      console.log(INVALID_MILLENNIUM_FILE);
      process.exit(1);
    }
    return value;
  };

  /**
   * Running the command
   * @param passedParams {Array>} Parameters passed from the CLI
   * @param options {Record} Options
   */
  async run(
    passedParams: string[],
    options?: Record<string, any>
  ): Promise<void> {
    if (passedParams.length > 2) {
      console.log(TOO_MUCH_ARGUMENTS);
      process.exit(1);
    } else {
      try {
        const empireDto: EmpireDto = JSON.parse(
          readFileSync(setRelativePathDynamically(passedParams[1]), {
            encoding: "utf-8"
          })
        );
        console.log(await this.oddMissionService.tellMeTheOdds(empireDto));
        process.exit(0);
      } catch (error) {
        console.log(`${ERROR}: ${error.message}`);
        process.exit(1);
      }
    }
  }
}
