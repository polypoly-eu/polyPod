import { ZipFile } from "@polypoly-eu/feature-storage";

export async function importData(zipData) {
    const zipFile = await ZipFile.createWithCache(zipData, window.pod);
    return await importZip(zipFile);
}

//googleAccount is not an equivalent to Facebook account yet
export async function importZip(zipFile) {
    const googleAccount = {};
    googleAccount.pathNames = await zipFile.getEntries();
    return googleAccount;
}
