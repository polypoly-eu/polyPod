function errorToString(error) {
    if (typeof error === "object") {
        let message = `${error.name || "Unknown error"}: `;
        if (error.message) message += error.message;
        if (error.stack) message += `\n${error.stack}`;
        if (error.cause) message += `\n\nCause:\n${errorToString(error.cause)}`;
        return message;
    }
    return error;
}

window.addEventListener("error", ({ error }) => {
    window.webkit.messageHandlers.error.postMessage({
        message: "Unhandled error:\n\n" + errorToString(error)
    });
    return true;
});

window.addEventListener("unhandledrejection", (event) => {
    window.webkit.messageHandlers.error.postMessage({
        message: "Unhandled rejection:\n\n" + errorToString(event.reason)
    });
    event.preventDefault();
});
