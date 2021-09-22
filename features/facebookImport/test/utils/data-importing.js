import NameImporter from "../../src/importer/data-importers/name-importer";
import FacebookAccount from "../../src/importer/facebook-account";
import { runImporter } from "../../src/importer/importer";

export async function runSingleImporter(importerClass, zipFile) {
    const facebookAccount = new FacebookAccount();
    const result = await runImporter(
        importerClass,
        zipFile.enrichedData(),
        facebookAccount
    );
    return { facebookAccount, result };
}

export async function runNameImporter(zipFile) {
    return runSingleImporter(NameImporter, zipFile);
}
