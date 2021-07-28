import {
    anonymizerRegex,
    anonymizerPrefixRegex,
    readAndProcessZipFile,
} from "../src/globals.js";

async function APIMappings(zip) {
    let mapping = {};
    const files = zip.file(/\.json$/);
    for (let thisFile of files) {
        const str = await thisFile.async("string");
        const data = JSON.parse(str);
        if (Object.keys(data).length == 1) {
            const api = Object.keys(data)[0];
            mapping[thisFile.name] = {};
            if (
                data[api].constructor !== Array &&
                Object.keys(data[api]).length == 1
            ) {
                const thisKey = Object.keys(data)[0];
                const mappingKey = `${api}/${thisKey}`;
                const mappedKeys = mapKeys(data[api]);
                mapping[thisFile.name][mappingKey] = mappedKeys;
            } else {
                if (api === "group_badges_v2") {
                    mapping[thisFile.name][api] = ["🔤"];
                } else {
                    mapping[thisFile.name][api] = mapKeys(data);
                }
            }
        } else {
            let anonymizedFileName = thisFile.name.replace(
                anonymizerPrefixRegex,
                "uniqueid"
            );
            anonymizedFileName = anonymizedFileName.replace(
                anonymizerRegex,
                "uniqueid_hash"
            );
            anonymizedFileName = anonymizedFileName.replace(
                /\d+(?=\.json$)/,
                "#"
            );
            let description;
            if (data.constructor.name === "Object") {
                description = { object: Object.keys(data) };
            } else {
                description = "Array";
            }
            mapping[anonymizedFileName] = description;
        }
    }
    console.log(JSON.stringify(mapping));
}

function mapKeys(data) {
    const thisKey = Object.keys(data)[0];
    return [
        ...new Set(
            Object.keys(data[thisKey]).map((aKey) => {
                return aKey
                    .replace(/\d+$/, "🔢")
                    .replace(/^[-A-Za-z0-9]{4}\*{20}/, "🍪");
            })
        ),
    ];
}

readAndProcessZipFile(APIMappings);
