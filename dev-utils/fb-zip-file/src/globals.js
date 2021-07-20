import { readFileSync } from "fs";

export const dataFileName = "data/commonKeys.json";

export function commonKeys() {
    return JSON.parse(readFileSync(dataFileName));
}

export function hasCommonKeys() {

}
