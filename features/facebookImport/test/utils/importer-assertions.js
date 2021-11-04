import {
    InvalidContentImportException,
    MissingFileImportException,
} from "../../src/model/importers/utils/failed-import-exception";

export function expectError(result, errorClass) {
    expect(result.status.isError).toBe(true);
    expect(result.status.message).toBe(errorClass.name);
    expect(result.status.error.name).toBe(errorClass.name);
}

export function expectMissingFileError(result) {
    expectError(result, MissingFileImportException);
}

export function expectInvalidContentError(result) {
    expectError(result, InvalidContentImportException);
}

export function expectImportSuccess(result) {
    expect(result.status.isSuccess).toBe(true);
}

export function expectAllResultsSuccess(results) {
    expect(results.length).toBeGreaterThan(0);
    results.forEach((result) => expect(result.status.isSuccess).toBe(true));
}

export function expectImportWarning(result, warningMessage) {
    expect(result.status.isWarning).toBe(true);
    expect(result.status.message).toBe(warningMessage);
}
