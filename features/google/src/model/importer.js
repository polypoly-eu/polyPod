import { ZipFile } from "@polypoly-eu/feature-storage";

export async function importData(zipData) {
    const zipFile = await ZipFile.createWithCache(zipData, window.pod);
    console.log(zipFile);
    // return importZip(zipFile, window.pod);
}
