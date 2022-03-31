//should move to analysis-util only as it is only used within analysis files
export async function jsonDataEntities(zipFile) {
    const entries = await relevantZipEntries(zipFile);
    const relevantJsonEntries = entries.filter(
        (entry) =>
            !entry.path.includes("/files/") && // Remove user files
            entry.path.endsWith(".json")
    );
    return relevantJsonEntries;
}
//repeated in import-utils, used in both importer & analysis package
export async function relevantZipEntries(zipFile) {
    const entries = await zipFile.getEntries();
    return entries.filter(
        (entry) =>
            !entry.path.includes(".DS_Store") &&
            !entry.path.includes("__MACOSX")
    );
}
