import type { Fetch } from "./api";
import chai, { assert } from "chai";
import chaiAsPromised from "chai-as-promised";

export * from "./api";

let httpbinUrl: string | undefined;

export function getHttpbinUrl(): string {
    if (httpbinUrl !== undefined) return httpbinUrl;

    if (process.env.HTTPBIN_URL) {
        httpbinUrl = process.env.HTTPBIN_URL;
    } else {
        console.warn("Using live httpbin API; set HTTPBIN_URL to use local server ...");
        httpbinUrl = "https://httpbin.org";
    }

    return httpbinUrl;
}

async function alwaysCatch<T>(f: () => Promise<T>): Promise<T> {
    return await f();
}

export function fetchSpec(fetch: Fetch, httpbinUrl: string): void {
    chai.use(chaiAsPromised);

    describe("HTTP requests", () => {
        it("Successful GET (text)", async () => {
            const response = await fetch(`${httpbinUrl}/robots.txt`);
            await assert.eventually.equal(response.text(), "User-agent: *\nDisallow: /deny\n");
        });

        it("Successful GET (json)", async () => {
            const response = await fetch(`${httpbinUrl}/json`);
            await assert.eventually.property(response.json(), "slideshow");
        });

        it("Successful GET (plaintext)", async () => {
            const response = await fetch(`${httpbinUrl}/robots.txt`);
            await assert.isRejected(
                alwaysCatch(() => response.json()),
                /json/i
            );
        });

        it("Successful POST", async () => {
            const postBody = `"test-post"`;
            const response = await fetch(`${httpbinUrl}/anything`, {
                method: "post",
                body: postBody,
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const json = await response.json();

            assert.propertyVal(json, "data", postBody);
            assert.propertyVal(json, "method", "POST");
        });

        it("404", async () => {
            const response = fetch(`${httpbinUrl}/status/404`);
            await assert.eventually.propertyVal(response, "status", 404);
        });
    });
}
