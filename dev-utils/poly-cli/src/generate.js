import { resolve } from "path";
import { readFileSync } from "fs";

export function metaGenerate(file, dirName, featureName) {
    let templatePath = "";
    if (featureName != "empty") {
        templatePath = `${featureName}/`;
    }
    console.log(
        resolve(dirName, `./src/static/templates/${templatePath}${file}`)
    );
    return () =>
        readFileSync(
            resolve(dirName, `./src/static/templates/${templatePath}${file}`)
        );
}
