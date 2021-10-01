import MessagesImporter from "../../src/importer/data-importers/messages-importer.js";
import NameImporter from "../../src/importer/data-importers/name-importer.js";
import FacebookAccount from "../../src/importer/facebook-account.js";
import { runImporter } from "../../src/importer/importer.js";

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

export async function runMessagesImporter(zipFile) {
    return runSingleImporter(MessagesImporter, zipFile);
}
