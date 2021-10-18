import { ZipFileMock } from "../mocks/zipfile-mock";

export function createMockedZip(datasets) {
    let zipFile = new ZipFileMock();
    datasets.forEach(([path, dataset]) => zipFile.addJsonEntry(path, dataset));
    return zipFile;
}

export function zipWithWrongDatasetKey(filePath) {
    return createMockedZip([filePath, []]);
}
