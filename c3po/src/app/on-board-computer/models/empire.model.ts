import {HunterLocalization} from "./hunter-localization.model";

export interface Empire {
  countdown: number;
  bountyHuntersLocalization: HunterLocalization[];
}

export const FORMAT_ISSUE = "Format issue";
export const IMPORT_ISSUE = "An error occurs while importing the file";
export const SENDING_ISSUE = "An error occurs while sending the data"
export const DATA_INTEGRITY_ISSUE = "Data integrity issue";

export const BOUNTY_HUNTERS_CODE_KEY = "bountyHuntersLocalization";
export const BOUNTY_HUNTERS_INSTRUCTION_KEY = "bounty_hunters";
