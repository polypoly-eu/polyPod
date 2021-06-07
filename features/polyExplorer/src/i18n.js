import fs from "fs";
import { FileNotFoundError, I18n } from "@polypoly-eu/silly-i18n";

const localesDirName = "locales";
let localesDir;

if (fs.existsSync( localesDirName )) {
    localesDir = localesDirName;
} else if ( fs.existsSync( "src/" + localesDirName) ) {
    localesDir = "src/" + localesDirName;
} else {
    throw new FileNotFoundError( "Can't find translations dir " + localesDir );
}

const i18n = I18n.fromFiles( localesDir );
export default { i18n };
