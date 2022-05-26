import fs from "fs";
import path from "path";
import util from "util";
import glob from "glob";

const DIRNAME = "locales";
const FILEEXT = ".json";
const PLUGIN = "silly-i18n";
const SUFFIX = `?${PLUGIN}`;

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
                console.log("Pattern ", pattern);
                for (const file of await util.promisify(glob)(pattern)) {
                    const lang = file.substring(dir.length).split("/")[1];
                    const section = path.basename(file, FILEEXT);

                    (translations[lang] ||= {})[section] = JSON.parse(
                        await fs.promises.readFile(file, { encoding: "utf-8" })
                    );
                }

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
