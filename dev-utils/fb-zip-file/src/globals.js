import { readFileSync, createReadStream } from "fs";
import JSZip from "jszip";

export const dataFileName = "data/commonStructure.json";
export const allDataFileName = "data/allStructure.json";
export const allDataFileNameJs = "data/allStructure.js";
export const noDataFileName = "no-data.txt";
export const anonymizerRegex = /(?<=\/)[a-zA-Z0-9]+_[_a-zA-Z0-9-]{9,12}(?=\/)/;
export const anonymizerPrefixRegex = /(?<=\/)[_a-zA-Z0-9-]{10}(?=\/)/;
export const uniqueFolderIDRegex = /^[a-zA-Z0-9]+_[_a-zA-Z0-9-]{9,12}$/;
export const uniqueMsgFolderRegex = /^[_a-zA-Z0-9-]{10}$/;

export function commonStructure() {
    return JSON.parse(readFileSync(dataFileName));
}

export function hasCommonKeys() {}

export function readAndProcessZipFile(
    callback,
    path = process.env.FB_ZIP_LOCATION
) {
    let data = Buffer.from([]);
    let readStream = createReadStream(path);
    readStream.on("data", (chunk) => {
        data = Buffer.concat([data, chunk]);
    });
    readStream.on("end", () => {
        JSZip.loadAsync(data).then(callback);
    });
}
