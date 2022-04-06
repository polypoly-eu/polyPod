export function createSuccessStatus() {
    return {
        name: "SUCCESS",
        isSuccess: true,
    };
}

export function createWarningStatus(message) {
    return {
        name: "WARNING",
        isSuccess: false,
        message,
    };
}

export function createErrorStatus(error) {
    return {
        name: "ERROR",
        isSuccess: false,
        message: error,
    };
}
