const DEFAULT_HOST = "localhost";
const DEFAULT_PORT = 5005;
/**
 * Looks at `PORT` and `HTTPBIN_URL` environment variables to figure out an URL to make requests or uses defaults
 *
 * @returns an URL to make binary requests
 */
export function getHttpbinUrl(): string {
    let httpbinUrl: string;
    if (process.env.HTTPBIN_URL) {
        httpbinUrl = process.env.HTTPBIN_URL;
    } else {
        let port = DEFAULT_PORT;
        if (process.env.PORT) {
            port = Number(process.env.PORT);
        }
        httpbinUrl = `http://${DEFAULT_HOST}:${port}`;
        console.log(`Using local instance of an HTTP server at ${httpbinUrl}`);
    }

    return httpbinUrl;
}
