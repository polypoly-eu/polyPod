import {
    InvalidContentImportException,
    MissingFileImportException,
} from "../../src/importer/failed-import-exception";
import {
    IMPORT_ERROR,
    IMPORT_SUCCESS,
} from "../../src/importer/importer-status";

export function expectError(result, errorClass) {
    expect(result.status).toBe(IMPORT_ERROR);
    expect(result.message).toBe(errorClass.name);
    expect(result.error.name).toBe(errorClass.name);
}

export function expectMissingFileError(result) {
    expectError(result, MissingFileImportException);
}

export function expectInvalidContentError(result) {
    expectError(result, InvalidContentImportException);
}

export function expectImportSuccess(result) {
    expect(result.status).toBe(IMPORT_SUCCESS);
}
