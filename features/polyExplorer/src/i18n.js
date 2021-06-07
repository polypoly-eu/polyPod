import fs from "fs";
import { FileNotFoundError, I18n, determineLanguage } from "@polypoly-eu/silly-i18n";
import { local } from "d3-selection";

const localesDirName = "locales";
let localesDir;

if (fs.existsSync( localesDirName )) {
    localesDir = localesDirName;
} else if ( fs.existsSync( "src/" + localesDirName) ) {
    localesDir = "src/" + localesDirName;
} else {
    throw new FileNotFoundError( "Can't find translations dir " + localesDir );
}

const knownLanguages = ["en","de"];
const localLanguage = determineLanguage();
let language;

if ( localLanguage in knownLanguages ) {
    language = localLanguage;
} else {
    language = "en";
}

const i18n = I18n.fromFiles( localesDir, language );
export default i18n;
