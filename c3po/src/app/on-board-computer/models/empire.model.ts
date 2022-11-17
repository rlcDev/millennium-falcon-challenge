import {HunterLocalization} from "./hunter-localization.model";

export interface Empire {
  countdown: number;
  bounty_hunters: HunterLocalization[];
}

export const SUCCESSFULLY_IMPORTED = "Successfully imported"
export const FORMAT_ISSUE = "Format issue";
export const IMPORT_ISSUE = "An error occurs while importing the file";
export const DATA_INTEGRITY_ISSUE = "Data integrity issue";
