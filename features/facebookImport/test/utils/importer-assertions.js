import {
    InvalidContentImportException,
    MissingFileImportException,
} from "../../src/model/importers/utils/failed-import-exception";

export function expectErrorStatus(status, errorClass) {
    expect(status.isError).toBe(true);
    expect(status.message).toBe(errorClass.name);
    expect(status.error.name).toBe(errorClass.name);
}

export function expectError(result, errorClass, importerClass) {
    expectErrorStatus(result.status, errorClass);
    expect(result.importer.constructor).toBe(importerClass);
}

export function expectMissingFileError(result, importerClass) {
    expectError(result, MissingFileImportException, importerClass);
}

export function expectInvalidContentError(result, importerClass) {
    expectError(result, InvalidContentImportException, importerClass);
}

export function expectSyntaxError(result, importerClass) {
    expectError(result, SyntaxError, importerClass);
}

export function expectImportSuccess(result) {
    expect(result.status.isSuccess).toBe(true);
}

export function expectAllResultsSuccess(results) {
    expect(results.length).toBeGreaterThan(0);
    results.forEach((result) => expect(result.status.isSuccess).toBe(true));
}

export function expectImportWarning(result, warningMessage, importerClass) {
    expect(result.status.isWarning).toBe(true);
    expect(result.status.message).toBe(warningMessage);
    expect(result.importer.constructor).toBe(importerClass);
}
