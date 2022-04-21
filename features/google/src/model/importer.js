import { ZipFile } from "@polypoly-eu/poly-import";
import ActivitiesImporter from "./importers/activities-importer";
import SemanticLocationsImporter from "./importers/semantic-locations-importer";

export async function importData(zipData) {
    const zipFile = await ZipFile.createWithCache(zipData, window.pod);
    return await importZip(zipFile);
}

//googleAccount is not an equivalent to Facebook account yet
export async function importZip(zipFile) {
    const googleAccount = {};

    googleAccount.pathNames = await zipFile.getEntries();
    await new ActivitiesImporter().import({ zipFile, googleAccount });
    await new SemanticLocationsImporter().import({ zipFile, googleAccount });

    return googleAccount;
}
