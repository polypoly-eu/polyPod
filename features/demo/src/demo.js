window.addEventListener("DOMContentLoaded", () => {
    document.querySelector(".unhandled-error").addEventListener("click", () => {
        const error = new Error("An error has been provoked");
        error.cause = new Error("This is the cause");
        throw error;
    });

    document
        .querySelector(".unhandled-async-errors")
        .addEventListener("click", () => {
            const error1 = new Error("An error has been provoked");
            error1.cause = new Error("This is the cause");
            const error2 = new Error("Another error happened async");
            error2.cause = new Error("This is the cause");
            setTimeout(() => {
                throw error2;
            }, 0);
            throw error1;
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
