import {
    InvalidContentImportException,
    MissingFileImportException,
} from "../../src/importer/failed-import-exception";
import {
    IMPORT_ERROR,
    IMPORT_SUCCESS,
} from "../../src/importer/importer-status";

export function expectMissingFileError(result) {
    expect(result.status).toBe(IMPORT_ERROR);
    expect(result.message).toBe(MissingFileImportException.name);
    expect(result.error.name).toBe(MissingFileImportException.name);
}

export function expectInvalidContentError(result) {
    expect(result.status).toBe(IMPORT_ERROR);
    expect(result.message).toBe(InvalidContentImportException.name);
    expect(result.error.name).toBe(InvalidContentImportException.name);
}

export function expectImportSuccess(result) {
    expect(result.status).toBe(IMPORT_SUCCESS);
}
