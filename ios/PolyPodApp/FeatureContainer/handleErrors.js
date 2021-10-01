window.onerror = (message, url, line, column, error) => {
    window.webkit.messageHandlers.error.postMessage({
        message,
        url,
        line,
        column,
        error: JSON.stringify(error)
    });
};
