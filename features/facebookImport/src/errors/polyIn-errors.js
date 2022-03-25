export class FileImportError extends Error {
    constructor(cause) {
        super("Failed to import file");
        this.name = "FileImportError";
        this.cause = cause;
    }
}

export class FileSelectionError extends Error {
    constructor(cause) {
        super("Failed to select file");
        this.name = "FileSelectionError";
        this.cause = cause;
    }
}

export class RefreshFilesError extends Error {
    constructor(cause) {
        super("Failed to refresh files");
        this.name = "RefreshFilesError";
        this.cause = cause;
    }
}
