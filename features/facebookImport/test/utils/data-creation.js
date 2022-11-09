import { ZipFileMock } from "@polypoly-eu/poly-import";

export function createMockedZip(datasets) {
    return new ZipFileMock(datasets);
}

export function zipWithWrongDatasetKey(filePath) {
    return createMockedZip([[filePath, { wrong_key: [] }]]);
}
