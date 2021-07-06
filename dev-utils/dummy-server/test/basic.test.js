const request = require("supertest");
import { app } from "../src/dummy-server.js";

describe( "Root route works", () => {
    it("Should return message", done => {
      request(app)
        .get("/")
        .then( response => {
            expect(response.statusCode).toBe(200);
            expect(response.res.text).toEqual(expect.stringContaining("GET HTTP"));
            done();
        });
    } );
});