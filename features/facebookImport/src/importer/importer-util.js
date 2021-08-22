import {
    InvalidContentImportException,
    MissingContentImportException,
    MissingFileImportException,
} from "./failed-import-exception";

async function readJSONFile(dataFileName, zipFile) {
    const entries = await zipFile.getEntries();
    const offFacebookEventsFile = entries.find((entryName) =>
        entryName.includes(dataFileName)
    );
    if (!offFacebookEventsFile) {
        throw new MissingFileImportException(dataFileName);
    }
    const fileContent = new TextDecoder("utf-8").decode(
        await zipFile.getContent(offFacebookEventsFile)
    );

    if (!fileContent) {
        throw new MissingContentImportException(dataFileName);
    }

    return JSON.parse(fileContent);
}

async function readJSONDataArray(dataFileName, dataKey, zipFile) {
    const rawData = await readJSONFile(dataFileName, zipFile);

    if (!(dataKey in rawData)) {
        throw new InvalidContentImportException(
            dataFileName,
            `Missing ${dataKey} key`
        );
    }

    const arrayData = rawData[dataKey];
    if (!Array.isArray(arrayData)) {
        throw new InvalidContentImportException(
            dataFileName,
            `Wrong data format for ${dataKey} key`
        );
    }
    return arrayData;
}

function anonymizePathSegment(pathSegment, fullPath) {
    if (
        fullPath.includes("messages") &&
        /^[a-zA-Z0-9]+_[_a-zA-Z0-9-]{9,12}$/.test(pathSegment)
    ) {
        return "uniqueid_hash";
    }
    return pathSegment;
}

function anonymizeJsonEntityPath(fileName) {
    const nameParts = fileName.split("/").slice(1);

    const anonymizedParts = nameParts.map((each) =>
        anonymizePathSegment(each, fileName)
    );
    return anonymizedParts.join("/");
}

async function jsonDataEntities(zipFile) {
    const entries = await zipFile.getEntries();
    const relevantEntries = entries.filter(
        (each) =>
            !each.includes(".DS_Store") &&
            !each.includes("__MACOSX") &&
            !each.includes("/files/") && // Remove user files
            each.endsWith(".json")
    );
    return relevantEntries;
}

export {
    readJSONFile,
    readJSONDataArray,
    anonymizeJsonEntityPath,
    jsonDataEntities,
};
