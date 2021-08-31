export const IMPORT_SUCCESS = "success";
export const IMPORT_ERROR = "error";
export const IMPORT_WARNING = "warning";

export function createErrorResult(importerClass, error) {
    return {
        status: IMPORT_ERROR,
        importerClass,
        error,
        message: error.name,
    };
}
