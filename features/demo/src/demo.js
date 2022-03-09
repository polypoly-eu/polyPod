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

    document
        .querySelector(".endpoint-post")
        .addEventListener("click", async () => {
            const featureIdToken = "demo";
            const endpointId = "demoTestEndpoint";
            const response = await window.pod.endpoint.send(endpointId, "abc");
            console.log(
                "Payload: ",
                response.payload,
                "Response Code: ",
                response.responseCode
            );
        });

    (function () {
        let wastedMemory = "";

        function wasteMemory(mb) {
            let oneMbString = "";
            for (let i = 0; i < 1024 * 1024; i++)
                oneMbString += Math.floor(Math.random() * 10);
            for (let i = 0; i < mb; i++) wastedMemory += oneMbString;
        }

        function updateWastedMemory() {
            document.querySelector(".wasted-memory").innerText =
                wastedMemory.length / 1024 / 1024;
        }

        document
            .querySelector(".reserve-10-mb")
            .addEventListener("click", function () {
                this.disabled = true;
                wasteMemory(10);
                updateWastedMemory();
                this.disabled = false;
            });

        document
            .querySelector(".reserve-100-mb")
            .addEventListener("click", function () {
                this.disabled = true;
                wasteMemory(100);
                updateWastedMemory();
                this.disabled = false;
            });
    })();
});
