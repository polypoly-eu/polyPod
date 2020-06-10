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
import {DataFactorySpec, gens} from "@polypoly-eu/rdf-spec";
import {assert} from "chai";
import {resolve} from "path";

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
        private readonly podFactory: () => Pod,
        private readonly path: string,
        private readonly httpbinUrl: string
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
                const {polyOut} = this.podFactory();
                const pathExisting = resolve(this.path, "existing");
                const pathNotExisting = resolve(this.path, "not-existing");
                await assert.isRejected(polyOut.stat(pathExisting));
                await assert.isRejected(polyOut.stat(pathNotExisting));
                const content = "abc";

                await polyOut.writeFile(pathExisting, content, { encoding: "utf-8" });

                await assert.equal(await polyOut.readFile(pathExisting, { encoding: "utf-8" }), content);

                await assert.isRejected(polyOut.readFile(pathNotExisting, { encoding: "utf-8" }));
            });

            describe("HTTP requests", () => {

                it("Successful GET (text)", async () => {
                    const {polyOut} = this.podFactory();
                    const response = await polyOut.fetch(`${this.httpbinUrl}/robots.txt`);
                    await assert.eventually.equal(response.text(), "User-agent: *\nDisallow: /deny\n");
                });

                it("Successful GET (json)", async () => {
                    const {polyOut} = this.podFactory();
                    const response = await polyOut.fetch(`${this.httpbinUrl}/json`);
                    await assert.eventually.property(response.json(), "slideshow");
                });

                it("Successful GET (plaintext)", async () => {
                    const {polyOut} = this.podFactory();
                    const response = await polyOut.fetch(`${this.httpbinUrl}/robots.txt`);
                    await assert.isRejected(response.json(), /json/i);
                });

                it("Successful POST", async () => {
                    const postBody = `"test-post"`;
                    const {polyOut} = this.podFactory();
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
                    const {polyOut} = this.podFactory();
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
    podFactory: () => Pod,
    path = "/",
    httpbinUrl = "https://httpbin.org"
): void {
    return new PodSpec(podFactory, path, httpbinUrl).run();
}
