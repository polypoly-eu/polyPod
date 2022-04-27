const MagicString = require("magic-string");
const fs = require("fs");

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
        if (!replacedCode) {
            console.log("Nothing to replace into ", podJs);
            return;
        }

        fs.writeFileSync(podJs, replacedCode);
    } catch (err) {
        console.error("Error during replacing code", err);
    }
}

function copyPodJs(dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest);

        fs.copyFileSync(
            "node_modules/@polypoly-eu/podjs/dist/pod.js",
            `${dest}/pod.js`
        );
        console.log("Copied pod.js into", dest);
    }
}

/**
 * @param options
 * @param options.build_dir - path to build_dir where pod.js exists
 * @param options.manifestPath - path to json file
 */
function loadManifest(options = {}) {
    if (!options.build_dir || !options.manifestPath) {
        throw new Error("manifestPath or build_dir not specified");
    }
    const podJsPath = `${options.build_dir}/pod.js`;
    console.log("Loading", options.manifestPath, "into", podJsPath);

    copyPodJs(options.build_dir);

    executeReplacement(podJsPath, options.manifestPath);
}

exports.default = loadManifest;
