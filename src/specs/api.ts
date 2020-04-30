/**
 * Executable specification of the [[Pod]] API, comprising a set of tests. The main class is [[PodSpec]].
 *
 * All Pod implementations should be able to run these tests successfully.
 *
 * The tests use [Chai](https://www.chaijs.com/) for assertions that are independent from any one test framework. Tests
 * are written using the standard functions `describe`, `it`, and `beforeEach`. This allows them to run under different
 * frameworks, such as:
 *
 * - [Mocha](https://mochajs.org/)
 * - [Jest](https://jestjs.io/)
 *
 * @packageDocumentation
 */

import {Pod} from "../api";
import fc from "fast-check";
import {gens} from "@polypoly-eu/rdf-spec";
import chai, {assert} from "chai";
import chaiAsPromised from "chai-as-promised";
import {resolve} from "path";
import {DataFactorySpec} from "@polypoly-eu/rdf-spec";
import {Server} from "http";
import express from "express";
import {once} from "events";
import {raw} from "body-parser";
import {AddressInfo} from "net";
import {FS} from "../fs";

chai.use(chaiAsPromised);

/**
 * An extension of the [[Pod]] interface that provides access to the underlying filesystem.
 */
export type PodUnderTest = Pod & {
    readonly fs: FS;
}

/**
 * The specification of the [[Pod]] API. All tests are executed by calling [[podSpec]].
 *
 * It assumes that Pods can be cheaply created and expose access to the underlying filesystem (via [[PodUnderTest]]).
 * The specification manipulates files only under a path that is provided in the constructor. Callers should ensure
 * that the path exists, is empty, and not used for other purposes.
 *
 * Note that the tests create and tear down HTTP servers to exercise [[PolyOut]].
 */
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
                    app.get("/test-plain", (request, response) => {
                        response.contentType("text/plain");
                        response.send("plaintext");
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

                it("Successful GET (text)", async () => {
                    const {polyOut} = this.podFactory();
                    const response = await polyOut.fetch(`http://localhost:${port}/test`);
                    await assert.eventually.equal(response.text(), getResponse);
                });

                it("Successful GET (json)", async () => {
                    const {polyOut} = this.podFactory();
                    const response = await polyOut.fetch(`http://localhost:${port}/test`);
                    await assert.eventually.deepEqual(response.json(), JSON.parse(getResponse));
                });

                it("Successful GET (plaintext)", async () => {
                    const {polyOut} = this.podFactory();
                    const response = await polyOut.fetch(`http://localhost:${port}/test-plain`);
                    await assert.isRejected(response.json(), /json/i);
                });

                it("Successful POST", async () => {
                    const {polyOut} = this.podFactory();
                    const response = await polyOut.fetch(
                        `http://localhost:${port}/pong`,
                        {
                            method: "post",
                            body: postResponse,
                            headers: {
                                "Content-Type": "application/json"
                            }
                        }
                    );

                    await assert.eventually.equal(response.text(), postResponse);
                });

                it("404", async () => {
                    const {polyOut} = this.podFactory();
                    const response = polyOut.fetch(`http://localhost:${port}/404`);
                    await assert.eventually.propertyVal(response, "status", 404);
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

/**
 * Convenience function to instantiate the [[PodSpec]] and run it immediately afterwards.
 */
export function podSpec(podFactory: () => PodUnderTest, path = "/"): void {
    return new PodSpec(podFactory, path).run();
}