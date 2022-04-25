const MagicString = require("magic-string");
const fs = require("fs");

const yargs = require("yargs");

const manifestJsonPath = yargs.argv("manifestJsonPath");
const podjs = yargs.argv(podjs);
const dest = yargs.argv(dest);

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

    const result = {
        code: magicString.toString(),
    };
    return result;
}

function executeReplacement(podJs, manifestJsonPath, dest) {
    try {
        const manifestData = fs.readFileSync(manifestJsonPath, "utf8");
        const podJsCode = fs.readFileSync(podJs, "utf8");

        const replacedCode = replaceManifestData(podJsCode, manifestData);

        fs.appendFileSync(dest, replacedCode);
    } catch (err) {
        console.error(err);
    }
}

/**
 * @param options
 * @param options.manifestJsonPath
 */
function loadManifest() {
    console.log("Loading", manifestJsonPath);
    console.log("Loading into...", podjs);
    console.log("Generating into... ", dest);

    return executeReplacement(podjs, manifestJsonPath, dest);
    // name: "loadManifest",
    // async buildStart() {
    //     if (!options.manifestJsonPath) {
    //         throw new Error(`Must have "manifestJsonPath" property`);
    //     }
    // },
    // async transform(code) {
    // return
    // },
}

loadManifest();
