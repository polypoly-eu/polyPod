import {Pod} from "../api";
import fc from "fast-check";
import {gens} from "@polypoly-eu/rdf-spec";
import chai, {assert} from "chai";
import chaiAsPromised from "chai-as-promised";
import {resolve} from "path";
import {promises as _fs} from "fs";
import {DataFactorySpec} from "@polypoly-eu/rdf-spec";
import {Server} from "http";
import express from "express";
import {once} from "events";
import {raw} from "body-parser";
import {AddressInfo} from "net";

chai.use(chaiAsPromised);

export type PodUnderTest = Pod & {
    readonly fs: typeof _fs;
}

export class PodSpec {

    constructor(
        private readonly podFactory: () => PodUnderTest,
        private readonly path: string
    ) {}

    polyIn(): void {
        describe("polyIn", () => {

            describe("factory", () => {
                new DataFactorySpec(this.podFactory().polyIn.factory).run();
            });

            it("add only allows default graph", async () => {
                const {polyIn} = this.podFactory();
                const quad = polyIn.factory.quad(
                    polyIn.factory.namedNode("http://example.org/s"),
                    polyIn.factory.namedNode("http://example.org/p"),
                    polyIn.factory.namedNode("http://example.org/o"),
                    polyIn.factory.namedNode("http://example.org/g")
                );
                await assert.isRejected(polyIn.add(quad), /default/);
            });

            it("add/select", async () => {
                const {triple} = gens(this.podFactory().polyIn.factory);
                await fc.assert(fc.asyncProperty(fc.array(triple), async quads => {
                    const {polyIn} = this.podFactory();
                    await polyIn.add(...quads);
                    const actual = await polyIn.select({});
                    assert.sameDeepMembers(actual, quads);
                }));
            });

            it("add/select with matcher", async () => {
                const {triple} = gens(this.podFactory().polyIn.factory);
                const gen = fc.integer(1, 20).chain(len =>
                    fc.tuple(
                        fc.array(triple, len, len),
                        fc.integer(0, len - 1)
                    )
                );
                await fc.assert(fc.asyncProperty(gen, async ([quads, index]) => {
                    const {polyIn} = this.podFactory();
                    await polyIn.add(...quads);
                    const actual = await polyIn.select(quads[index]);
                    assert.sameDeepMembers(actual, [quads[index]]);
                }));
            });

        });
    }

    polyOut(): void {
        describe("polyOut", () => {

            it("Filesystem operation", async () => {
                const {fs, polyOut} = this.podFactory();
                const pathExisting = resolve(this.path, "existing");
                const pathNotExisting = resolve(this.path, "not-existing");
                await assert.isRejected(fs.stat(pathExisting));
                await assert.isRejected(fs.stat(pathNotExisting));
                const content = "abc";

                await fs.writeFile(pathExisting, content, { encoding: "utf-8" });

                await assert.equal(await polyOut.readFile(pathExisting, { encoding: "utf-8" }), content);

                await assert.isRejected(polyOut.readFile(pathNotExisting, { encoding: "utf-8" }));
            });

            describe("HTTP requests", () => {

                const getResponse = `{ "hello": "world" }`;
                const postResponse = `{ "ping": "pong" }`;

                let server: Server;
                let port: number;

                beforeEach(async () => {
                    const app = express();
                    app.get("/test", (request, response) => {
                        response.contentType("application/json");
                        response.send(getResponse);
                    });
                    app.use(raw({
                        type: () => true
                    }));
                    app.post("/pong", (request, response) => {
                        response.contentType(request.header("Content-Type")!);
                        response.send(request.body);
                    });
                    server = app.listen(0);
                    await once(server, "listening");
                    port = (server.address() as AddressInfo).port;
                });

                it("Successful GET", async () => {
                    const {polyOut} = this.podFactory();
                    const response = await polyOut.httpRequest(`http://localhost:${port}/test`, "get");
                    assert.equal(response, getResponse);
                });

                it("Successful POST", async () => {
                    const {polyOut} = this.podFactory();
                    const response = await polyOut.httpRequest(
                        `http://localhost:${port}/pong`,
                        "post",
                        postResponse,
                        {
                            "Content-Type": "application/json"
                        }
                    );
                    assert.equal(response, postResponse);
                });

                it("404", async () => {
                    const {polyOut} = this.podFactory();
                    const response = polyOut.httpRequest(`http://localhost:${port}/404`, "get");
                    await assert.isRejected(response, /404/);
                });

                afterEach(async () => {
                    server.close();
                    await once(server, "close");
                });

            });

        });
    }

    run(): void {
        this.polyIn();
        this.polyOut();
    }

}

export function podSpec(podFactory: () => PodUnderTest, path = "/"): void {
    return new PodSpec(podFactory, path).run();
}