const MagicString = require("magic-string");
const fs = require("fs");

const yargs = require("yargs");

const argv = yargs
    .option("podjs", {
        alias: "podjs",
        description: "Tell the path of podjs file",
        type: "string",
    })
    .option("manifestJson", {
        alias: "manifestJson",
        description: "Tell the path to manifest json file",
        type: "string",
    }).argv;

const podjs = argv.podjs;
const manifestJsonPath = argv.manifestJson;

function replaceManifestData(code, manifestData) {
    const magicString = new MagicString(code);
    const pattern = new RegExp("window.manifestData", "g");

    let hasReplacements = false;
    let match;
    let start;
    let end;
    let replacement;

    while ((match = pattern.exec(code))) {
        hasReplacements = true;

        start = match.index;
        end = start + match[0].length;

        replacement = String(manifestData);

        magicString.overwrite(start, end, replacement);
    }

    if (!hasReplacements) {
        return null;
    }

    return magicString.toString();
}

function executeReplacement(podJs, manifestJsonPath) {
    try {
        const manifestData = fs.readFileSync(manifestJsonPath, "utf8");
        const podJsCode = fs.readFileSync(podJs, "utf8");

        const replacedCode = replaceManifestData(podJsCode, manifestData);

        fs.writeFileSync(podJs, replacedCode);
    } catch (err) {
        console.error(err);
    }
}

/**
 * @param options
 * @param options.manifestJsonPath
 */
function loadManifest() {
    if (!manifestJsonPath || !podjs) {
        throw new Error(`Must have "manifestJsonPath" and "podjs" properties!`);
    }
    console.log("Loading", manifestJsonPath, "into", podjs);

    return executeReplacement(podjs, manifestJsonPath);
}

loadManifest();
