const request = require("supertest");
import { app } from "../src/dummy-server.js";

describe( "Root route works", () => {
    it("Should return message", done => {
        ["get","put", "delete"].forEach( verb => {
            request(app)
                .[verb]("/")
                .then( response => {
                    expect(response.statusCode).toBe(200);
                    expect(response.res.text).toEqual(
                        expect.stringContaining(`${verb.toUpperCase()} HTTP`)
                    );
                    done();
                });
        })
    } );
});