export * from "./api";

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