import {
    InvalidContentImportException,
    MissingFileImportException,
} from "../../src/model/importers/utils/failed-import-exception";

export function expectErrorStatus(status, errorClass) {
    expect(status.isSuccess).toBe(false);
    expect(status.message.name).toBe(errorClass.name);
}

export function expectError(report, errorClass, importerClass) {
    expectErrorStatus(report.status, errorClass);
    expect(report.importer.constructor).toBe(importerClass);
}

export function expectMissingFileError(report, importerClass) {
    expectError(report, MissingFileImportException, importerClass);
}

export function expectInvalidContentError(report, importerClass) {
    expectError(report, InvalidContentImportException, importerClass);
}

export function expectSyntaxError(report, importerClass) {
    expectError(report, SyntaxError, importerClass);
}

export function expectImportSuccess(report) {
    expect(report.status.isSuccess).toBe(true);
}

export function expectAllReportsSuccess(reports) {
    expect(reports.length).toBeGreaterThan(0);
    reports.forEach((report) => expect(report.status.isSuccess).toBe(true));
}

export function expectImportWarning(report, warningMessage, importerClass) {
    expect(report.status.isSuccess).toBe(true);
    expect(report.status.message).toBe(warningMessage);
    expect(report.importer.constructor).toBe(importerClass);
}
