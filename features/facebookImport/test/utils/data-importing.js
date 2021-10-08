import MessagesImporter from "../../src/model/importers/messages-importer.js";
import NameImporter from "../../src/model/importers/name-importer.js";
import FacebookAccount from "../../src/model/entities/facebook-account.js";
import { runImporter } from "../../src/model/importer.js";
import RecentlyViewedAdsImporter from "../../src/model/importers/recently-viewed-ads-importer.js";
import OffFacebookEventsImporter from "../../src/model/importers/off-facebook-events-importer.js";

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

export async function runRecentlyViewedAdsImporter(zipFile) {
    return runSingleImporter(RecentlyViewedAdsImporter, zipFile);
}

export async function runOffFacebookEventsImporter(zipFile) {
    return runSingleImporter(OffFacebookEventsImporter, zipFile);
}
