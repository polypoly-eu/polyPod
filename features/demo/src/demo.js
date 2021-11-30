window.addEventListener("DOMContentLoaded", () => {
    document.querySelector(".unhandled-error").addEventListener("click", () => {
        const error = new Error("An error has been provoked");
        error.cause = new Error("This is the cause");
        throw error;
    });

    document
        .querySelector(".unhandled-rejection")
        .addEventListener("click", () => {
            new Promise((_, reject) => {
                const error = new Error("A rejection has been provoked");
                error.cause = new Error("This is the cause");
                reject(error);
            });
        });
});
