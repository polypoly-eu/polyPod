import { readFileSync } from "fs";

export const dataFileName = "data/commonStructure.json";

export function commonStructure() {
    return JSON.parse(readFileSync(dataFileName));
}

export function hasCommonKeys() {}
