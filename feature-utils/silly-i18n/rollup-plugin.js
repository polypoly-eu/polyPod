import fs from "fs";
import path from "path";
import util from "util";
import glob from "glob";

const DIRNAME = "locales";
const FILEEXT = ".json";
const PLUGIN = "silly-i18n";
const SUFFIX = `?${PLUGIN}`;

function symmetricDifference(setPair) {
    let _difference = new Set(setPair[0]);
    let diffs = [];
    for (let elem of setPair[1]) {
        if (_difference.has(elem)) {
            _difference.delete(elem);
        } else {
            (diffs[1] ||= []).push(elem);
        }
    }
    if (_difference) {
        diffs[0] = _difference;
    }
    return diffs;
}

export default function (options) {
    return {
        name: PLUGIN,

        async resolveId(source, importer) {
            if (source != `!${PLUGIN}`) return null;

            for (let dir = importer; dir != (dir = path.dirname(dir)); ) {
                const subdir = path.join(dir, DIRNAME);
                const exists = await fs.promises.stat(subdir).then(
                    (stat) => stat.isDirectory(),
                    () => false
                );
                if (exists) return `${subdir}${SUFFIX}`;
            }

            throw new Error(`No "${DIRNAME}" directory found for ${importer}`);
        },

        async load(id) {
            if (id.endsWith(SUFFIX)) {
                const translations = {};
                const dir = id.slice(0, -SUFFIX.length);
                const pattern = path.join(dir, "*", "**", `*${FILEEXT}`);
                const langRegex = new RegExp(`${DIRNAME}/(\\w+)/`);
                for (const file of await util.promisify(glob)(pattern)) {
                    const lang = langRegex.exec(file)[1];
                    const section = path.basename(file, FILEEXT);
                    (translations[lang] ||= {})[section] = JSON.parse(
                        await fs.promises.readFile(file, { encoding: "utf-8" })
                    );
                }
                const allLanguages = Object.keys(translations);
                let sectionSets = {};
                allLanguages.forEach(
                    (key) =>
                        (sectionSets[key] = new Set(
                            Object.keys(translations[key])
                        ))
                );
                let languageCombos = [];
                for (let i = 0; i < allLanguages.length; i++) {
                    for (let j = i + 1; j < allLanguages.length; j++) {
                        languageCombos.push([allLanguages[i], allLanguages[j]]);
                    }
                }
                languageCombos.forEach((pair) => {
                    const difference = symmetricDifference([
                        sectionSets[pair[0]],
                        sectionSets[pair[1]],
                    ]);
                    if (difference.length > 0) {
                        [0, 1].forEach((element) => {
                            if (
                                element in difference &&
                                difference[element].length > 0
                            ) {
                                difference[element].forEach((section) => {
                                    this.warn(
                                        `⚠️  ${section} is included only in language «${pair[element]}»`
                                    );
                                });
                            }
                        });
                    }
                });
                const { language } = options || {};
                const [importExtra, languageArg] = language
                    ? ["", JSON.stringify(language)]
                    : [", determineLanguage", "determineLanguage()"];
                const translationsArg = JSON.stringify(translations);
                const fallbackLanguage = options?.fallbackLanguage || "en";
                const fallbackLanguageArg = JSON.stringify(fallbackLanguage);

                return (
                    `import { I18n${importExtra} } from "@polypoly-eu/silly-i18n"\n` +
                    `export default new I18n(${languageArg}, ${translationsArg}, ${fallbackLanguageArg});`
                );
            }
        },
    };
}
