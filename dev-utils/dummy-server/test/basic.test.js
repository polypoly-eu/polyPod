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

describe("GET routes work", () => {
    it("returns correct robots.txt", (done) => {
        request(app)
            .get("/robots.txt")
            .then((response) => {
                expect(response.statusCode).toBe(200);
                expect(response.res.text).toEqual(
                    expect.stringContaining("Disallow")
                );
                done();
            });
    });
    it("returns JSON", (done) => {
        request(app)
            .get("/json")
            .then((response) => {
                expect(response.statusCode).toBe(200);
                expect(response.body).toStrictEqual({ slideshow: {} });
                done();
            });
    });
    it("does redirect", (done) => {
        const redirectUrl = "https://polypoly.coop";
        request(app)
            .get(`/redirect-to?url=${redirectUrl}`)
            .then((response) => {
                expect(response.statusCode).toBe(302);
                expect(response.header.location).toBe(redirectUrl);
                done();
            });
    });
    it("returns correct status", (done) => {
        request(app)
            .get("/status/201")
            .then((response) => {
                expect(response.statusCode).toBe(201);
                expect(response.res.statusMessage).toBe("CREATED");
                done();
            });
    });
});
