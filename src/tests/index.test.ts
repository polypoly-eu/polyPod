import {JSDOM} from "jsdom";
import {makeClient, makeServer, Windows} from "../index";
import {Volume} from "memfs";

interface TestServer {
    ping(x: string): string;
}

describe("Client/Server", () => {

    let parent: JSDOM;
    let child: JSDOM;
    let windows: Windows;

    beforeEach(() => {
        parent = new JSDOM();
        child = new JSDOM();
        windows = {
            // @ts-ignore
            server: parent.window,
            // @ts-ignore
            client: child.window
        };
    });

    it("Exchange messages", async () => {
        const testServer = {
            ping: jest.fn((x: string) => `Hello ${x}`)
        };

        const server = makeServer(testServer, windows);
        const client = makeClient<TestServer>(windows);

        await expect(client.call.ping("world")).resolves.toEqual("Hello world");

        expect(testServer.ping).toHaveBeenCalledTimes(1);

        server.terminate();
    });

    it("Nontrivial example (fs access)", async () => {
        const volume = Volume.fromJSON({
            "/test": "Hello fs"
        });

        const server = makeServer(volume.promises, windows);
        const client = makeClient<typeof volume.promises>(windows);

        await expect(client.call.readFile("/test", { encoding: "utf8" })).resolves.toEqual("Hello fs");

        const contentBuffer = Object.fromEntries(Object.entries(Buffer.from("Hello fs")));

        await expect(client.call.readFile("/test")).resolves.toEqual(contentBuffer);

        server.terminate();
    });

});