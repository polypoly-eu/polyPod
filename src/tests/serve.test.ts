import { Server } from "http";
import { serve } from "../serve";
import { DefaultPod } from "@polypoly-eu/poly-api";
import { parse, Range } from "semver";
import { once } from "events";
import fetch from "node-fetch";

describe("Serve", () => {
    const port = 12345;
    let pod: DefaultPod;
    let server: Server;

    beforeAll(async () => {
        server = await serve(port, pod, __dirname, {
            name: "test",
            version: parse("0.0.0")!,
            api: new Range("0.0.0"),
            root: "data",
        });
    });

    afterAll(async () => {
        server.close();
        await once(server, "close");
    });

    it("RPC", async () => {
        const response = await fetch(`http://localhost:${port}/rpc`, {
            method: "post",
        });
        expect(response.status).toBe(200);
    });

    it("404 on unknown routes", async () => {
        const response = await fetch(`http://localhost:${port}/whatever`);
        expect(response.status).toBe(404);
    });
});
