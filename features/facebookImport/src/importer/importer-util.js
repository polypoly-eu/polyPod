async function readJSONFile(dataFileName, zipFile) {
    const entries = await zipFile.getEntries();
    const offFacebookEventsFile = entries.find((entryName) =>
        entryName.includes(dataFileName)
    );
    if (!offFacebookEventsFile) {
        return { status: "Missing File" };
    }
    const fileContent = new TextDecoder("utf-8").decode(
        await zipFile.getContent(offFacebookEventsFile)
    );

    if (!fileContent) {
        return { status: "Missing Content" };
    }
    try {
        return { status: "ok", data: JSON.parse(fileContent) };
    } catch (exception) {
        //TODO: better error handling + error reporting
        console.log(exception);
        return { status: "JSON parsing error" };
    }
}

async function readJSONDataArray(dataFileName, dataKey, zipFile) {
    const rawData = await readJSONFile(dataFileName, zipFile);
    if (!(rawData.status === "ok")) {
        return rawData;
    }
    const readData = rawData.data;
    if (!(dataKey in readData)) {
        return { status: `Missing ${dataKey} key` };
    }

    const arrayData = readData[dataKey];
    if (!Array.isArray(arrayData)) {
        return { status: `Wrong data format for ${dataKey} key` };
    }
    return { status: "ok", data: arrayData };
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

async function jsonDataEntities(id, zipFile) {
    const entries = await zipFile.getEntries();
    const relevantEntries = entries
        .map((each) => each.replace(`${id}/`, ""))
        .filter(
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
