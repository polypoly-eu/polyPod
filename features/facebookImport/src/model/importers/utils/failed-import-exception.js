export class FailedFileImportException extends Error {
    constructor(dataFile, message) {
        super(message);
        this.dataFile = dataFile;
        this.name = "FailedImportException";
    }
}

export class MissingFileImportException extends FailedFileImportException {
    constructor(dataFile) {
        super(dataFile, `Missing file: ${dataFile}`);
        this.name = "MissingFileImportException";
    }
}

export class MissingContentImportException extends FailedFileImportException {
    constructor(dataFile) {
        super(dataFile, `Missing content in file: ${dataFile}`);
        this.name = "MissingContentImportException";
    }
}

export class InvalidContentImportException extends FailedFileImportException {
    constructor(dataFile, message) {
        super(dataFile, message);
        this.name = "InvalidContentImportException";
    }
}

export class FileTooLargeException extends FailedFileImportException {
    constructor(dataFile, message) {
        super(dataFile, message);
        this.name = "FileTooLargeException";
    }
}

export class MissingFilesException extends Error {
    constructor(message) {
        super(message);
        this.name = "MissingFilesException";
    }
}
