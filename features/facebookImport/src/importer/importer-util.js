import {
    InvalidContentImportException,
    MissingContentImportException,
    MissingFileImportException,
} from "./failed-import-exception";

async function relevantZipEntries(zipFile) {
    const entries = await zipFile.getEntries();
    return entries.filter(
        (each) => !each.includes(".DS_Store") && !each.includes("__MACOSX")
    );
}

async function readJSONFile(dataFileName, zipFile, zipId = null) {
    const fullEntryName = zipId ? zipId + "/" + dataFileName : dataFileName;
    const entries = await zipFile.getEntries();
    const dataZipEntry = entries.find(
        (entryName) => entryName === fullEntryName
    );

    if (!dataZipEntry) {
        throw new MissingFileImportException(dataFileName);
    }
    const rawContent = await zipFile.getContent(dataZipEntry);
    const fileContent = new TextDecoder("utf-8").decode(rawContent);

    if (!fileContent) {
        throw new MissingContentImportException(dataFileName);
    }

    return JSON.parse(fileContent, (key, value) => {
        if (typeof value === "string") {
            return decodeURIComponent(escape(value));
        }
        return value;
    });
}

async function readJSONDataArray(dataFileName, dataKey, zipFile, zipId = null) {
    const rawData = await readJSONFile(dataFileName, zipFile, zipId);

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
        (/^[a-zA-Z0-9]+_[_a-zA-Z0-9-]{9,12}$/.test(pathSegment) ||
            /^[_a-zA-Z0-9-]{9,12}$/.test(pathSegment))
    ) {
        return "uniqueid_hash";
    }
    return pathSegment;
}

function anonymizeJsonEntityPath(fileName) {
    const nameParts = fileName.split("/");

    const anonymizedParts = nameParts.map((each) =>
        anonymizePathSegment(each, fileName)
    );
    return anonymizedParts.join("/");
}

async function jsonDataEntities(zipFile) {
    const entries = await relevantZipEntries(zipFile);
    const relevantJsonEntries = entries.filter(
        (each) =>
            !each.includes("/files/") && // Remove user files
            each.endsWith(".json")
    );
    return relevantJsonEntries;
}

function removeEntryPrefix(entryName) {
    if (
        /^polypod:\/\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\/$/.test(
            entryName
        )
    ) {
        return "";
    }
    const entryNameMatch = entryName.match(
        /^polypod:\/\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\/(.*)$/
    );
    if (entryNameMatch && entryNameMatch.length === 2 && entryNameMatch[1]) {
        return entryNameMatch[1];
    }
    return entryName;
}

export {
    readJSONFile,
    readJSONDataArray,
    anonymizeJsonEntityPath,
    relevantZipEntries,
    jsonDataEntities,
    removeEntryPrefix,
};
