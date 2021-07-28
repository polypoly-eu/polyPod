import { readFileSync } from "fs";

export const dataFileName = "data/commonStructure.json";
export const allDataFileName = "data/allStructure.json";
export const noDataFileName = "no-data.txt";
export const anonymizerRegex = /(?<=\/)[a-zA-Z0-9]+_[_a-zA-Z0-9-]{9,12}(?=\/)/;
export const anonymizerPrefixRegex = /(?<=\/)[_a-zA-Z0-9-]{10}(?=\/)/;
export const uniqueFolderIDRegex = /^[a-zA-Z0-9]+_[_a-zA-Z0-9-]{9,12}$/;
export const uniqueMsgFolderRegex = /^[_a-zA-Z0-9-]{10}$/;

export function commonStructure() {
    return JSON.parse(readFileSync(dataFileName));
}

export function hasCommonKeys() {}
