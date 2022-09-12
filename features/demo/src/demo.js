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

    async function initializeVarsArray(arr) {
        let tripleString = `
                prefix example: <https://example.org/>
                insert data { example:person1
            `;
        const attrStrings = [];
        for (let attrToAdd of arr) {
            attrStrings.push(` example:${attrToAdd} "" `);
        }
        tripleString += attrStrings.join(";") + "}";
        await window.pod.triplestore.update(tripleString);
    }

    (async function () {
        const { triplestore } = await window.pod;

        const personAttr = [
            "firstname",
            "lastname",
            "street",
            "number",
            "city",
            "birthday",
        ];

        const personData = () => {
            return Object.fromEntries(
                personAttr.map((attr) => [
                    attr,
                    document.querySelector(`.${attr}`).value,
                ])
            );
        };
        const results = await triplestore.query(`
                prefix example: <https://example.org/>
                select ?p ?o where {
                    example:person1 ?p ?o .
                }
            `);

        let personAttrToAddToStore = personAttr;
        for (let result of results) {
            const pred = result.get("p").value;
            const predSplitArr = pred.split("/");
            const predAttr = predSplitArr[predSplitArr.length - 1];
            if (!personAttr.includes(predAttr)) continue;
            const obj = result.get("o").value;
            document.querySelector(`.${predAttr}`).value = obj;
            personAttrToAddToStore = personAttrToAddToStore.filter(
                (e) => e !== predAttr
            );
        }
        if (personAttrToAddToStore.length > 0) {
            initializeVarsArray(personAttrToAddToStore);
        }

        document
            .querySelector(".submit-rdf-form")
            .addEventListener("click", async function () {
                for (let [key, value] of Object.entries(personData())) {
                    console.log(value, key);
                    try {
                        await triplestore.update(`
                        prefix example: <https://example.org/>
                        delete {
                            example:person1 example:${key} ?o .
                        }
                        insert { 
                            example:person1 example:${key} "${value}" .
                        }
                        where {
                            example:person1 example:${key} ?o .
                        }
                        `);
                        console.log(
                            await triplestore.query("select * where {?s ?p ?o}")
                        );
                    } catch (e) {
                        console.error(e);
                    }
                }
            });
    })();
});
