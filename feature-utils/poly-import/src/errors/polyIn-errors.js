class PolyImportError extends Error {
    constructor(type, cause) {
        super(`Failed to ${type} file`);
        this.cause = cause;
    }
}

export class FileImportError extends PolyImportError {
    constructor(cause) {
        super("import", cause);
        this.name = "FileImportError";
    }
}

export class FileSelectionError extends PolyImportError {
    constructor(cause) {
        super("select", cause);
        this.name = "FileSelectionError";
    }
}

export class RefreshFilesError extends PolyImportError {
    constructor(cause) {
        super("refresh", cause);
        this.name = "RefreshFilesError";
    }
}
