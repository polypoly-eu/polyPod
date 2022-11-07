class PolyImportError extends Error {
    constructor(type, cause) {
        super(`Failed to ${type} file`);
        this.cause = cause;
        this.name = this.constructor.name;
    }
}

export class FileImportError extends PolyImportError {
    constructor(cause) {
        super("import", cause);
    }
}

export class FileSelectionError extends PolyImportError {
    constructor(cause) {
        super("select", cause);
    }
}

export class RefreshFilesError extends PolyImportError {
    constructor(cause) {
        super("refresh", cause);
    }
}
