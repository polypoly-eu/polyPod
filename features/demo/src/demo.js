window.addEventListener("DOMContentLoaded", () => {
    document.querySelector(".error-message").addEventListener("click", () => {
        const error = new Error("An error has been provoked");
        error.cause = new Error("This is the cause");
        throw error;
    });
});
