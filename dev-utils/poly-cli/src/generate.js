import { resolve } from "path";
import { readFileSync } from "fs";

export function metaGenerate(file, dirName, featureName) {
    let templatePath = "";
    if (featureName != "empty") {
        templatePath = `${featureName}/`;
    }
    return () =>
        readFileSync(
            resolve(dirName, `./src/static/templates/${templatePath}${file}`)
        );
}
