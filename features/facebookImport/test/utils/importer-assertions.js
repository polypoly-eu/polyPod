import {
    InvalidContentImportException,
    MissingFileImportException,
} from "../../src/model/importers/utils/failed-import-exception";
import {
    IMPORT_ERROR,
    IMPORT_SUCCESS,
    IMPORT_WARNING,
} from "../../src/model/importers/utils/importer-status";

export function expectError(result, errorClass) {
    expect(result.status).toBe(IMPORT_ERROR);
    expect(result.message).toBe(errorClass.name);
    expect(result.error.name).toBe(errorClass.name);
}

export function expectMissingFileError(result, importerClass) {
    expectError(result, MissingFileImportException);
    expect(result.importerClass).toBe(importerClass);
}

export function expectInvalidContentError(result, importerClass) {
    expectError(result, InvalidContentImportException);
    expect(result.importerClass).toBe(importerClass);
}

export function expectImportSuccess(result) {
    expect(result.status).toBe(IMPORT_SUCCESS);
}

export function expectAllResultsSuccess(results) {
    expect(results.length).toBeGreaterThan(0);
    results.forEach((result) => expect(result.status).toBe(IMPORT_SUCCESS));
}

export function expectImportWarning(result, warningMessage) {
    expect(result.status).toBe(IMPORT_WARNING);
    expect(result.message).toBe(warningMessage);
}
