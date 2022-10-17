import { ZipFileMock } from "@polypoly-eu/poly-import";

export function createMockedZip(datasets) {
    let zipFile = new ZipFileMock();
    datasets.forEach(([path, dataset]) => zipFile.addJsonEntry(path, dataset));
    return zipFile;
}

export function zipWithWrongDatasetKey(filePath) {
    return createMockedZip([[filePath, { wrong_key: [] }]]);
}
