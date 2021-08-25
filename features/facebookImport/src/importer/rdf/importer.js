import { ZipFile } from "../../model/storage.js";
import FacebookAccount from "../facebook-account.js";
import OffFacebookEventsRdfImporter from "./data-importers/off-facebook-events-importer-rdf.js";
import { loadModel } from "./model-loader.js";

const importers = [OffFacebookEventsRdfImporter];

export async function importData(file) {
    const zipFile = new ZipFile(file, window.pod);
    const enrichedFile = { ...file, zipFile };
    const facebookAccount = new FacebookAccount(window.pod);
    await Promise.all(
        importers.map(async (importerClass) => {
            const importer = new importerClass();
            await importer.import(enrichedFile, facebookAccount, window.pod);
            return importer;
        })
    );

    await loadModel(window.pod, facebookAccount);
    return facebookAccount;
}
