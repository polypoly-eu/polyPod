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

async function readJSONFile(relativeFileName, zipFile) {
    const fullEntryName = `${zipFile.id}/${relativeFileName}`;
    return readFullPathJSONFile(fullEntryName, zipFile);
}

async function readFullPathJSONFile(fullEntryName, zipFile) {
    const entries = await zipFile.getEntries();
    const dataZipEntry = entries.find((entryName) =>
        entryName.endsWith(fullEntryName)
    );

    if (!dataZipEntry) {
        throw new MissingFileImportException(fullEntryName);
    }

    // TODO: We should not need the lines above
    //if (!(await zipFile.hasEntry(fullEntryName))) {
    //    throw new MissingFileImportException(fullEntryName);
    //}

    const rawContent = await zipFile.getContent(fullEntryName);
    const fileContent = new TextDecoder("utf-8").decode(rawContent);

    if (!fileContent) {
        throw new MissingContentImportException(fullEntryName);
    }

    return JSON.parse(fileContent, (key, value) => {
        if (typeof value === "string") {
            return decodeURIComponent(escape(value));
        }
        return value;
    });
}

async function readJSONDataObject(dataFileName, dataKey, zipFile) {
    const rawData = await readJSONFile(dataFileName, zipFile);

    if (!(dataKey in rawData)) {
        throw new InvalidContentImportException(
            dataFileName,
            `Missing ${dataKey} key`
        );
    }

    return rawData[dataKey];
}

async function readJSONDataArray(dataFileName, dataKey, zipFile) {
    const arrayData = await readJSONDataObject(dataFileName, dataKey, zipFile);

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
    // There is no polyPod API at this time that gives us the relative paths we
    // want to show, so we have to make assumptions about the URL formats used
    // by the polyPod.
    const removalPatterns = [
        /^polypod:\/\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\//i,
        /^FeatureFiles\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\//i,
    ];
    let cleanedEntry = entryName;
    for (let pattern of removalPatterns)
        cleanedEntry = cleanedEntry.replace(pattern, "");
    return cleanedEntry;
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
    readFullPathJSONFile,
    readJSONDataObject,
    readJSONDataArray,
    anonymizeJsonEntityPath,
    relevantZipEntries,
    jsonDataEntities,
    removeEntryPrefix,
    sliceIntoChunks,
};
