const request = require("supertest");
import { app } from "../src/dummy-server.js";

describe("Root route works", () => {
    it("Should return message", (done) => {
        ["get", "put", "delete"].forEach((verb) => {
            request(app)
                [verb]("/")
                .then((response) => {
                    expect(response.statusCode).toBe(200);
                    expect(response.res.text).toEqual(
                        expect.stringContaining(`${verb.toUpperCase()} HTTP`)
                    );
                    done();
                });
        });
    });
});

describe("Post'ing works", () => {
    const body = "Foo";
    const anObject = {};
    anObject[body] = "";
    it("Should return posted body", (done) => {
        request(app)
            .post("/")
            .send(body)
            .then((response) => {
                expect(response.body).toStrictEqual(anObject);
                done();
            });
    });
    it("Should return posted body in object", (done) => {
        const anotherObject = { method: "POST", data: anObject };
        request(app)
            .post("/anything")
            .send(body)
            .then((response) => {
                expect(response.body).toStrictEqual(anotherObject);
                done();
            });
    });
});
