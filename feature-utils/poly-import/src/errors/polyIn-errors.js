class PolyImportError extends Error {
    constructor(type, cause) {
        super(`Failed to ${type} file`);
        this.cause = cause;
    }
}

/** Indicates an error where an archive could not be extracted. */
export class FileImportError extends PolyImportError {
    constructor(cause) {
        super("import", cause);
        this.name = "FileImportError";
    }
}

/** Indicates an error where the user selected an invalid file. */
export class FileSelectionError extends PolyImportError {
    constructor(cause) {
        super("select", cause);
        this.name = "FileSelectionError";
    }
}

/** Indicates an error where {@link ZipFile#refreshFiles} failed. */
export class RefreshFilesError extends PolyImportError {
    constructor(cause) {
        super("refresh", cause);
        this.name = "RefreshFilesError";
    }
}
