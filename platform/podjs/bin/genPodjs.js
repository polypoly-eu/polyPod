const MagicString = require("magic-string");
const fs = require("fs");

const yargs = require("yargs");

const argv = yargs.option("build_dir", {
    alias: "build-dir",
    description: "path where podjs and json file exist",
    type: "string",
}).argv;

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
 * @param build_dir
 */
function loadManifest() {
    const build_dir = argv.build_dir;
    console.log("Loading into", build_dir);

    const podJs = `${build_dir}/pod.js`;
    const manifestJson = `${build_dir}/manifest.json`;
    return executeReplacement(podJs, manifestJson);
}

loadManifest();
