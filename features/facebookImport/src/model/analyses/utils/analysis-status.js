export function createSuccessStatus(analysisClass) {
    return {
        analysisClass,
        name: "SUCCESS",
        isSuccess: true,
    };
}

export function createErrorStatus(analysisClass, error) {
    return {
        analysisClass,
        name: "ERROR",
        error,
        message: error.name,
        isError: true,
    };
}
