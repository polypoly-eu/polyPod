import {
    InvalidContentImportException,
    MissingContentImportException,
    MissingFileImportException,
} from "./failed-import-exception";

async function relevantZipEntries(zipFile) {
    const entries = await zipFile.getEntries();
    return entries.filter(
        (each) =>
            !each._id.includes(".DS_Store") && !each._id.includes("__MACOSX")
    );
}

async function readJSONFile(relativeFileName, zipFile) {
    if (!(await zipFile.hasFilePath(relativeFileName))) {
        throw new MissingFileImportException(relativeFileName);
    }
    const fileEntry = await zipFile.fileEntryForPath(relativeFileName);
    return readFullPathJSONFile(fileEntry);
}

async function readFullPathJSONFile(fileEntry) {
    const rawContent = await fileEntry.getContent();
    const fileContent = new TextDecoder("utf-8").decode(rawContent);

    if (!fileContent) {
        throw new MissingContentImportException(fileEntry);
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
            !each._id.includes("/files/") && // Remove user files
            each._id.endsWith(".json")
    );
    return relevantJsonEntries;
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
    sliceIntoChunks,
};
