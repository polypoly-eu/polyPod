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

import { Pod } from "./api";
import fc from "fast-check";
import { DataFactorySpec, gens } from "@polypoly-eu/rdf-spec";
import chai, { assert } from "chai";
import chaiAsPromised from "chai-as-promised";
import { fetchSpec } from "@polypoly-eu/fetch-spec";

function encodeUtf8(string: string): Uint8Array {
    if (typeof TextEncoder !== "undefined") return new TextEncoder().encode(string);
    else return Buffer.from(string, "utf-8");
}

/**
 * The specification of the [[Pod]] API. All tests are executed by calling [[podSpec]].

 * The specification manipulates files only under a path that is provided in the constructor. Callers should ensure
 * that the path exists, is empty, and not used for other purposes.
 *
 * Note that the tests use the [httpbin](https://httpbin.org/) service. Test runners should either ensure Internet
 * access or provide a URI to a local httpbin service.
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
        const { dataFactory, polyIn } = this.pod;

        describe("polyIn", () => {
            describe("factory", () => {
                new DataFactorySpec(dataFactory).run();
            });

            it("add only allows default graph", async () => {
                const quad = dataFactory.quad(
                    dataFactory.namedNode("http://example.org/s"),
                    dataFactory.namedNode("http://example.org/p"),
                    dataFactory.namedNode("http://example.org/o"),
                    dataFactory.namedNode("http://example.org/g")
                );
                await assert.isRejected(polyIn.add(quad), /default/);
                await assert.isRejected(polyIn.has(quad), /default/);
                await assert.isRejected(polyIn.delete(quad), /default/);
            });

            it("add/select", async () => {
                const { triple } = gens(dataFactory);
                await fc.assert(
                    fc.asyncProperty(fc.array(triple), async (quads) => {
                        await polyIn.add(...quads);
                        for (const quad of quads) {
                            const selected = await polyIn.match(quad);
                            assert.lengthOf(selected, 1);
                            assert.ok(quad.equals(selected[0]));
                            assert.ok(await polyIn.has(quad));
                        }
                    })
                );
            });

            it("add/delete", async () => {
                const { triple } = gens(dataFactory);
                await fc.assert(
                    fc.asyncProperty(fc.array(triple), async (quads) => {
                        await polyIn.add(...quads);
                        for (const quad of quads) {
                            await polyIn.delete(quad);
                            assert.notOk(await polyIn.has(quad));
                        }
                    })
                );
            });
        });
    }

    polyOut(): void {
        const { polyOut } = this.pod;

        describe("polyOut", () => {
            describe("Filesystem", () => {
                const pathGen = fc
                    .hexaString({ minLength: 1, maxLength: 30 })
                    .map((path) => this.path + "/" + path);

                async function skipIfExists(path: string): Promise<void> {
                    let cont = true;
                    try {
                        await polyOut.stat(path);
                        cont = false;
                    } catch {
                        // intentionally left blank
                    }
                    fc.pre(cont);
                }

                it("write/read", async () => {
                    await fc.assert(
                        fc.asyncProperty(pathGen, fc.fullUnicodeString(), async (path, content) => {
                            await skipIfExists(path);

                            await polyOut.writeFile(path, content, { encoding: "utf-8" });

                            await assert.eventually.equal(
                                polyOut.readFile(path, { encoding: "utf-8" }),
                                content
                            );
                            await assert.eventually.deepEqual(
                                polyOut.readFile(path),
                                encodeUtf8(content)
                            );
                        })
                    );
                });

                it("readDir", async () => {
                    assert.isFulfilled(polyOut.readDir(this.path));
                    await fc.assert(
                        fc.asyncProperty(pathGen, fc.fullUnicodeString(), async (path, content) => {
                            await skipIfExists(path);

                            await polyOut.writeFile(path, content, { encoding: "utf-8" });
                            const filesWithPath = (await polyOut.readDir(this.path)).map(
                                (path) => this.path + "/" + path["id"]
                            );
                            assert.include(filesWithPath, path);
                        })
                    );
                });

                it("stat/read", async () => {
                    await fc.assert(
                        fc.asyncProperty(pathGen, async (path) => {
                            await skipIfExists(path);

                            await assert.isRejected(polyOut.readFile(path, { encoding: "utf-8" }));
                        })
                    );
                });

                it("stat (root)", async () => {
                    const stat = await polyOut.stat(this.path);
                    assert.ok(stat.isDirectory());
                    assert.notOk(stat.isFile());
                });

                it("stat (files)", async () => {
                    await fc.assert(
                        fc.asyncProperty(pathGen, async (path) => {
                            let assertion: () => void;
                            try {
                                const stat = await polyOut.stat(path);
                                assertion = () =>
                                    assert.notEqual(stat.isFile(), stat.isDirectory());
                            } catch {
                                assertion = () => {
                                    // intentionally left blank
                                };
                            }
                            assertion();
                        })
                    );
                });
            });

            fetchSpec(polyOut.fetch.bind(polyOut), this.httpbinUrl);
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
export function podSpec(pod: Pod, path = "/", httpbinUrl = "https://httpbin.org"): void {
    return new PodSpec(pod, path, httpbinUrl).run();
}
