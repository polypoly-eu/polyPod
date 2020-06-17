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

import {Pod} from "./api";
import fc from "fast-check";
import {DataFactorySpec, gens} from "@polypoly-eu/rdf-spec";
import chai, {assert} from "chai";
import chaiAsPromised from "chai-as-promised";

let httpbinUrl: string | undefined;

export function getHttpbinUrl(): string {
    if (httpbinUrl !== undefined)
        return httpbinUrl;

    if (process.env.HTTPBIN_URL) {
        httpbinUrl = process.env.HTTPBIN_URL;
    }
    else {
        console.warn("Using live httpbin API; set HTTPBIN_URI to use local server ...");
        httpbinUrl = "https://httpbin.org";
    }

    return httpbinUrl;
}

function encodeUtf8(string: string): Uint8Array {
    if (typeof TextEncoder !== "undefined")
        return new TextEncoder().encode(string);
    else
        return Buffer.from(string, "utf-8");
}

/**
 * The specification of the [[Pod]] API. All tests are executed by calling [[podSpec]].
 *
 * It assumes that Pods can be cheaply created.

 * The specification manipulates files only under a path that is provided in the constructor. Callers should ensure
 * that the path exists, is empty, and not used for other purposes.
 *
 * Note that the tests create and tear down HTTP servers to exercise [[PolyOut]].
 */
export class PodSpec {

    constructor(
        private readonly pod: Pod,
        private readonly path: string,
        private readonly httpbinUrl: string
    ) {
        chai.use(chaiAsPromised);
    }

    polyIn(): void {
        const {polyIn} = this.pod;

        describe("polyIn", () => {

            describe("factory", () => {
                new DataFactorySpec(polyIn.factory).run();
            });

            it("add only allows default graph", async () => {
                const quad = polyIn.factory.quad(
                    polyIn.factory.namedNode("http://example.org/s"),
                    polyIn.factory.namedNode("http://example.org/p"),
                    polyIn.factory.namedNode("http://example.org/o"),
                    polyIn.factory.namedNode("http://example.org/g")
                );
                await assert.isRejected(polyIn.add(quad), /default/);
            });

            it("add/select", async () => {
                const {triple} = gens(polyIn.factory);
                await fc.assert(fc.asyncProperty(fc.array(triple), async quads => {
                    await polyIn.add(...quads);
                    for (const quad of quads) {
                        const selected = await polyIn.select(quad);
                        assert.lengthOf(selected, 1);
                        assert.ok(quad.equals(selected[0]));
                    }
                }));
            });

        });
    }

    polyOut(): void {
        const {polyOut} = this.pod;

        describe("polyOut", () => {

            describe("Filesystem", () => {

                const pathGen = fc.hexaString(1, 30).map(path => this.path + "/" + path);

                async function skipIfExists(path: string): Promise<void> {
                    let cont = true;
                    try {
                        // don't overwrite existing files
                        await polyOut.stat(path);
                        cont = false;
                    }
                    catch {
                        // intentionally left blank
                    }
                    fc.pre(cont);
                }

                it("write/read", async () => {
                    await fc.assert(fc.asyncProperty(pathGen, fc.fullUnicodeString(), async (path, content) => {
                        await skipIfExists(path);

                        await polyOut.writeFile(path, content, { encoding: "utf-8" });

                        await assert.eventually.equal(polyOut.readFile(path, { encoding: "utf-8" }), content);
                        await assert.eventually.deepEqual(polyOut.readFile(path), encodeUtf8(content));
                    }));
                });

                it("stat/read", async () => {
                    await fc.assert(fc.asyncProperty(pathGen, async path => {
                        await skipIfExists(path);

                        await assert.isRejected(polyOut.readFile(path, { encoding: "utf-8" }));
                    }));
                });

            });

            describe("HTTP requests", () => {

                it("Successful GET (text)", async () => {
                    const response = await polyOut.fetch(`${this.httpbinUrl}/robots.txt`);
                    await assert.eventually.equal(response.text(), "User-agent: *\nDisallow: /deny\n");
                });

                it("Successful GET (json)", async () => {
                    const response = await polyOut.fetch(`${this.httpbinUrl}/json`);
                    await assert.eventually.property(response.json(), "slideshow");
                });

                it("Successful GET (plaintext)", async () => {
                    const response = await polyOut.fetch(`${this.httpbinUrl}/robots.txt`);
                    await assert.isRejected(response.json(), /json/i);
                });

                it("Successful POST", async () => {
                    const postBody = `"test-post"`;
                    const response = await polyOut.fetch(
                        `${this.httpbinUrl}/anything`,
                        {
                            method: "post",
                            body: postBody,
                            headers: {
                                "Content-Type": "application/json"
                            }
                        }
                    );

                    const json = await response.json();

                    assert.property(json, "data", postBody);
                    assert.property(json, "method", "POST");
                });

                it("404", async () => {
                    const response = polyOut.fetch(`${this.httpbinUrl}/status/404`);
                    await assert.eventually.propertyVal(response, "status", 404);
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
export function podSpec(
    pod: Pod,
    path = "/",
    httpbinUrl = "https://httpbin.org"
): void {
    return new PodSpec(pod, path, httpbinUrl).run();
}
