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
