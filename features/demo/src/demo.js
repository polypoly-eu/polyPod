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
            //This endpoint is not registered by default! Add your personal test server URL to polyPod/platform/utils/endpoint-generator/endpoints.js
            const endpointId = "demoTest";
            try {
                const response = await window.pod.endpoint.get(
                    endpointId,
                    "abc"
                );
                console.log(response);
            } catch (e) {
                console.error(e);
            }
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

    (function () {});

    document
        .querySelector(".submit-rdf-form")
        .addEventListener("click", async function () {
            const personData = {
                firstname: document.querySelector(".firstname").value,
                lastname: document.querySelector(".lastname").value,
                street: document.querySelector(".street").value,
                number: document.querySelector(".number").value,
                city: document.querySelector(".city").value,
                birthday: document.querySelector(".birthday").value,
            };
            for (let [key, value] of Object.entries(personData)) {
                const { triplestore } = await window.pod;
                console.log(value, key);
                try {
                    await triplestore.update(
                        "prefix example: <https://example.org/> insert data {example:a example:b 1}"
                    );
                    await triplestore.update(`
                        prefix example: <https://example.org/>
                        delete {
                            example:person1 example:${key} ?o
                        }
                        insert { 
                            example:person1 example:${key} "${value}" .
                        }
                        where {}
                        `);
                    console.log(
                        await triplestore.query("select * where {?s ?p ?o}")
                    );
                } catch (e) {
                    console.error(e);
                }
            }
        });
});
