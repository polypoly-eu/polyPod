import {
    InvalidContentImportException,
    MissingContentImportException,
    MissingFileImportException,
} from "./failed-import-exception";

const FEATURE_FILES = "FeatureFiles";

async function relevantZipEntries(zipFile) {
    const entries = await zipFile.getEntries();
    return entries.filter(
        (each) => !each.includes(".DS_Store") && !each.includes("__MACOSX")
    );
}

async function readJSONFile(dataFileName, zipFile, zipId = null) {
    const fullEntryName = zipId
        ? `${FEATURE_FILES}/${zipId}/${dataFileName}`
        : dataFileName;
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

async function readJSONDataObject(
    dataFileName,
    dataKey,
    zipFile,
    zipId = null
) {
    const rawData = await readJSONFile(dataFileName, zipFile, zipId);

    if (!(dataKey in rawData)) {
        throw new InvalidContentImportException(
            dataFileName,
            `Missing ${dataKey} key`
        );
    }

    return rawData[dataKey];
}

async function readJSONDataArray(dataFileName, dataKey, zipFile, zipId = null) {
    const arrayData = await readJSONDataObject(
        dataFileName,
        dataKey,
        zipFile,
        zipId
    );

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
    // TODO: Making assumptions about the exact URL format used internally by the polyPod is risky,
    //       we already have the case where iOS URLs contain both upper and lower case characters,
    //       while Android URLs don't. A better approach would be to get the archive's root path from
    //       the polyPod, then remove this from the beginning of all URLs.
    if (
        /^poly[pP]od:\/\/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\/$/.test(
            entryName
        )
    ) {
        return "";
    }
    const entryNameMatch = entryName.match(
        /^poly[pP]od:\/\/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\/(.*)$/
    );
    if (entryNameMatch && entryNameMatch.length === 2 && entryNameMatch[1]) {
        return entryNameMatch[1];
    }
    return entryName;
}

function sliceIntoChunks(array, chunkSize) {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        const chunk = array.slice(i, i + chunkSize);
        chunks.push(chunk);
    }
    return chunks;
}

export {
    readJSONFile,
    readJSONDataObject,
    readJSONDataArray,
    anonymizeJsonEntityPath,
    relevantZipEntries,
    jsonDataEntities,
    removeEntryPrefix,
    sliceIntoChunks,
};
