export function createSuccessStatus() {
    return {
        name: "SUCCESS",
        isSuccess: true,
    };
}

export function createErrorStatus(error) {
    return {
        name: "ERROR",
        error,
        message: error.name,
        isError: true,
    };
}
