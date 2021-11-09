import type { Fetch } from "./api";
import chai, { assert } from "chai";
import chaiAsPromised from "chai-as-promised";

export * from "./api";

export function getHttpbinUrl(): string {
    let httpbinUrl: string;
    if (process.env.HTTPBIN_URL) {
        httpbinUrl = process.env.HTTPBIN_URL;
    } else {
        let port = 5005;
        if (process.env.PORT) {
            port = Number(process.env.PORT);
        }
        httpbinUrl = `http://localhost:${port}`;
        console.log(`Using local instance of an HTTP server at ${httpbinUrl}`);
    }

    return httpbinUrl;
}

async function alwaysCatch<T>(f: () => Promise<T>): Promise<T> {
    return await f();
}

export function fetchSpec(fetch: Fetch, httpbinUrl: string): void {
    chai.use(chaiAsPromised);

    describe("HTTP requests", () => {
        it("Returns a promise", () => {
            assert.instanceOf(fetch(httpbinUrl), Promise);
        });

        it("Rejects if URL is protocol relative", async () => {
            const url = "//example.com/";
            await assert.isRejected(alwaysCatch(() => fetch(url)));
        });

        it("Rejects if URL is relative path", async () => {
            const url = "/some/path";
            await assert.isRejected(alwaysCatch(() => fetch(url)));
        });

        it("Rejects if protocol is unsupported", async () => {
            const url = "ftp://example.com/";
            await assert.isRejected(alwaysCatch(() => fetch(url)));
        });

        it("Rejects on network failure", async () => {
            const url = "http://localhost:65535/";
            await assert.isRejected(alwaysCatch(() => fetch(url)));
        });

        it("Correct response", async () => {
            const result = await fetch(httpbinUrl);
            assert.propertyVal(result, "ok", true);
            assert.propertyVal(result, "url", httpbinUrl + "/");
            assert.propertyVal(result, "status", 200);
            assert.propertyVal(result, "statusText", "OK");
            assert.propertyVal(result, "redirected", false);
        });

        it("Correct response on redirect", async () => {
            const result = await fetch(
                `${httpbinUrl}/redirect-to?url=${encodeURI(httpbinUrl + "/status/201")}`
            );
            assert.propertyVal(result, "ok", true);
            assert.propertyVal(result, "url", httpbinUrl + "/status/201");
            assert.propertyVal(result, "status", 201);
            assert.propertyVal(result, "statusText", "CREATED");
            assert.propertyVal(result, "redirected", true);
        });

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
