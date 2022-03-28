import type {
    ExternalFile,
    Endpoint,
    Info,
    Matcher,
    Pod,
    PolyIn,
    PolyOut,
    PolyNav,
} from "@polypoly-eu/pod-api";
import { EncodingOptions, Stats, Entry } from "@polypoly-eu/pod-api";
import { dataFactory } from "@polypoly-eu/rdf";
import * as RDF from "rdf-js";
import * as RDFString from "rdf-string";
import * as zip from "@zip.js/zip.js";
import endpointsJson from "../../../../polyPod-config/endpoints.json";
import { Manifest, readManifest } from "./manifest";

const DB_PREFIX = "polypod:";
const DB_VERSION = 1;
const OBJECT_STORE_POLY_IN = "poly-in";
const OBJECT_STORE_POLY_OUT = "poly-out";
const QUAD_KEYS = ["subject", "predicate", "object"];

const NAV_FRAME_ID = "polyNavFrame";
const NAV_DEFAULT_BACKGROUND_COLOR = "#ffffff";
const NAV_DARK_FOREGROUND_COLOR = "#000000";
const NAV_LIGHT_FOREGROUND_COLOR = "#ffffff";

const MANIFEST_DATA = window.manifestData;

async function openDatabase(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const name = `${DB_PREFIX}${document.location.pathname}`;
        const request = indexedDB.open(name, DB_VERSION);

        request.onupgradeneeded = () => {
            const db = request.result;
            const polyInStore = db.createObjectStore(OBJECT_STORE_POLY_IN, {
                keyPath: QUAD_KEYS,
            });
            for (let mask = 1; mask < (1 << QUAD_KEYS.length) - 1; mask++) {
                const keyPath = QUAD_KEYS.filter((_, idx) => (mask >> idx) & 1);
                polyInStore.createIndex(keyPath.join("-"), keyPath);
            }
            db.createObjectStore(OBJECT_STORE_POLY_OUT, { keyPath: "id" });
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

class IDBPolyIn implements PolyIn {
    async match(matcher: Partial<Matcher>): Promise<RDF.Quad[]> {
        const db = await openDatabase();
        return new Promise((resolve, reject) => {
            const index = [];
            const query = [];
            for (const key of QUAD_KEYS) {
                const value = matcher[key as keyof Matcher];
                if (value) {
                    index.push(key);
                    query.push(RDFString.termToString(value));
                }
            }

            const tx = db.transaction([OBJECT_STORE_POLY_IN], "readonly");
            const store = tx.objectStore(OBJECT_STORE_POLY_IN);
            const request =
                index.length > 0
                    ? (index.length < QUAD_KEYS.length
                          ? store.index(index.join("-"))
                          : store
                      ).getAll(query)
                    : store.getAll();

            request.onsuccess = () =>
                resolve(
                    request.result.map((quad: RDFString.IStringQuad) =>
                        RDFString.stringQuadToQuad(quad)
                    )
                );

            tx.onerror = tx.onabort = () => reject(tx.error);
        });
    }

    private checkQuad(quad: RDF.Quad): void {
        if (!quad.graph.equals(dataFactory.defaultGraph()))
            throw new Error("Only default graph allowed");
    }

    async add(...quads: RDF.Quad[]): Promise<void> {
        const db = await openDatabase();
        return new Promise((resolve, reject) => {
            const tx = db.transaction([OBJECT_STORE_POLY_IN], "readwrite");
            const store = tx.objectStore(OBJECT_STORE_POLY_IN);
            for (const quad of quads) {
                this.checkQuad(quad);
                store.put(RDFString.quadToStringQuad(quad));
            }
            tx.oncomplete = () => resolve();
            tx.onerror = tx.onabort = () => reject(tx.error);
        });
    }

    private serializeKeys(quad: RDF.Quad): string[] {
        this.checkQuad(quad);
        return QUAD_KEYS.map((key) =>
            RDFString.termToString(quad[key as keyof RDF.Quad] as RDF.Term)
        );
    }

    async delete(...quads: RDF.Quad[]): Promise<void> {
        const db = await openDatabase();
        return new Promise((resolve, reject) => {
            const tx = db.transaction([OBJECT_STORE_POLY_IN], "readwrite");
            const store = tx.objectStore(OBJECT_STORE_POLY_IN);
            for (const quad of quads) store.delete(this.serializeKeys(quad));
            tx.oncomplete = () => resolve();
            tx.onerror = tx.onabort = () => reject(tx.error);
        });
    }

    async has(...quads: RDF.Quad[]): Promise<boolean> {
        const db = await openDatabase();
        return new Promise((resolve, reject) => {
            const tx = db.transaction([OBJECT_STORE_POLY_IN], "readonly");
            const store = tx.objectStore(OBJECT_STORE_POLY_IN);
            const lookupQuad = (i: number): void => {
                if (i >= quads.length) resolve(false);
                else {
                    const request = store.count(this.serializeKeys(quads[i]));
                    request.onsuccess = () =>
                        request.result > 0 ? resolve(true) : lookupQuad(i + 1);
                }
            };
            lookupQuad(0);
            tx.onerror = tx.onabort = () => reject(tx.error);
        });
    }
}

/**
 * @class FileUrl takes a URL and splits it into a path and a file name in a FileUrl format
 * Since pickFile and importArchive work with local URLs that have the actual
 * archive file name as their last component, and since the current BrowserPod
 * implementation works with data URLs which don't, we employ a little workaround.
 */
class FileUrl {
    private static readonly separator = "/";

    constructor(
        readonly url: string,
        readonly data: string,
        readonly fileName: string
    ) {}

    /**
     * It takes a URL and splits it into a path and a file name in a FileUrl format.
     * @param {string} url - The full URL of the file.
     * @returns A FileUrl object.
     */
    static fromUrl(url: string): FileUrl {
        const [lastComponent, ...rest] = url.split(FileUrl.separator).reverse();
        return new FileUrl(
            url,
            rest.reverse().join(FileUrl.separator),
            lastComponent
        );
    }

    /**
     * Creates a new FileUrl object from the given data and fileName
     * @param {string} data - The base URL of the file.
     * @param {string} fileName - The name of the file.
     * @returns A FileUrl object.
     */
    static fromParts(data: string, fileName: string): FileUrl {
        const url = data + FileUrl.separator + fileName;
        return new FileUrl(url, data, fileName);
    }
}

interface FileInfo {
    id: string;
    name: string;
    time: Date;
    blob: Blob;
}

/**
 * A variant of Stats that maintains compatibility with other polyPod
 * implementations by exposing value properties.
 *
 * TODO: Eliminate the need for this, either by adding the value properties to
 *       the Stats interface, or by eliminating them in all other polyPod
 *       implementations, and their usages in all features.
 */
class CompatStats implements Stats {
    constructor(
        readonly id: string,
        readonly size: number,
        readonly time: string,
        readonly name: string,
        readonly directory: boolean
    ) {}

    get file(): boolean {
        return !this.directory;
    }

    getId(): string {
        return this.id;
    }

    getSize(): number {
        return this.size;
    }

    getTime(): string {
        return this.time;
    }

    getName(): string {
        return this.name;
    }

    isFile(): boolean {
        return this.file;
    }

    isDirectory(): boolean {
        return this.directory;
    }
}

interface File {
    read(): Promise<Uint8Array>;
    stat(): CompatStats;
}

class IDBPolyOut implements PolyOut {
    private async getFileInfo(id: string): Promise<FileInfo> {
        const db = await openDatabase();
        return new Promise((resolve, reject) => {
            const tx = db.transaction([OBJECT_STORE_POLY_OUT], "readonly");
            const request = tx.objectStore(OBJECT_STORE_POLY_OUT).get(id);
            request.onsuccess = () => {
                if (request.result) resolve(request.result);
                else reject(new Error(`File not found: ${id}`));
            };
            tx.onerror = tx.onabort = () => reject(request.error);
        });
    }

    private async getZipEntries(id: string): Promise<zip.Entry[]> {
        const file = await this.getFileInfo(id);
        const reader = new zip.ZipReader(new zip.BlobReader(file.blob));
        return reader.getEntries();
    }

    private async getFile(id: string): Promise<File> {
        const match = /^(.*?:\/\/.*?)\/(.*)/.exec(id);
        if (match) {
            const [, zipId, filename] = match;
            const entries = await this.getZipEntries(zipId);
            const entry = entries.find((ent) => ent.filename == filename);
            if (!entry) throw new Error(`Zip entry not found: ${filename}`);

            return {
                read() {
                    if (!entry.getData)
                        throw new Error(`Zip entry is not a file: ${filename}`);
                    return entry.getData(new zip.Uint8ArrayWriter());
                },
                stat() {
                    return new CompatStats(
                        id,
                        entry.uncompressedSize,
                        entry.lastModDate.toISOString(),
                        filename,
                        entry.directory
                    );
                },
            };
        }

        const file = await this.getFileInfo(id);
        return {
            async read() {
                return new Uint8Array(await file.blob.arrayBuffer());
            },
            stat() {
                return new CompatStats(
                    id,
                    file.blob.size,
                    file.time.toISOString(),
                    file.name,
                    false
                );
            },
        };
    }

    readFile(path: string, options: EncodingOptions): Promise<string>;

    /** Reads a file asynchronously and returns the contents as a Uint8Array.
     * @param {string} path - The path of the file to read.
     * @returns A promise that resolves to a Uint8Array.
     */
    readFile(path: string): Promise<Uint8Array>;

    /**
     * It reads a file from the local storage
     * @param {string} id - The id of the file to read.
     * @param {EncodingOptions} [options] - EncodingOptions
     * @returns The promise returns a string or a Uint8Array.
     */
    readFile(
        id: string,
        options?: EncodingOptions
    ): Promise<string | Uint8Array | undefined> {
        if (options) {
            throw new Error("Not implemented: readFile with options");
        }
        return this.getFile(id).then((file) => file.read());
    }

    async stat(id: string): Promise<CompatStats> {
        if (id != "") return (await this.getFile(id)).stat();
        return new CompatStats("", 0, "", "", true);
    }

    async readDir(id: string): Promise<Entry[]> {
        if (id != "") {
            const entries = await this.getZipEntries(id);
            return entries.map(({ filename }) => ({
                id: `${id}/${filename}`,
                path: filename,
            }));
        }

        const db = await openDatabase();
        return new Promise((resolve, reject) => {
            const tx = db.transaction([OBJECT_STORE_POLY_OUT], "readonly");
            const request = tx.objectStore(OBJECT_STORE_POLY_OUT).getAll();
            request.onsuccess = () =>
                resolve(request.result.map(({ id }) => ({ id, path: id })));
            tx.onerror = tx.onabort = () => reject(tx.error);
        });
    }

    writeFile(): Promise<void> {
        throw "Not implemented: writeFile";
    }

    /**
     * It takes a URL string, downloads the file, and stores it in the browser's local storage
     * @param {string} url - The URL of the file to be downloaded.
     * @returns The fileId of the file that was just added to the archive.
     */
    async importArchive(url: string): Promise<string> {
        const { data: dataUrl, fileName } = FileUrl.fromUrl(url);
        const blob = await (await fetch(dataUrl)).blob();
        const db = await openDatabase();

        return new Promise((resolve, reject) => {
            const tx = db.transaction([OBJECT_STORE_POLY_OUT], "readwrite");
            const fileId = "polypod://" + createUUID();

            tx.objectStore(OBJECT_STORE_POLY_OUT).put({
                id: fileId,
                name: fileName,
                time: new Date(),
                blob,
            });

            tx.oncomplete = () => resolve(fileId);
            tx.onerror = tx.onabort = () => reject(tx.error);
        });
    }

    /**
     * removeArchive() removes the file with the given fileId from the local storage
     * @param {string} fileId - The id of the file to be removed.
     * @returns Nothing.
     */
    async removeArchive(fileId: string): Promise<void> {
        const db = await openDatabase();
        return new Promise((resolve, reject) => {
            const tx = db.transaction([OBJECT_STORE_POLY_OUT], "readwrite");
            tx.objectStore(OBJECT_STORE_POLY_OUT).delete(fileId);
            tx.oncomplete = () => resolve();
            tx.onerror = tx.onabort = () => reject(tx.error);
        });
    }
}

/**
 * PodJsInfo is used to return the runtime name and a version of PodJs
 * @class PodJsInfo
 */
class PodJsInfo implements Info {
    /**
     * It returns the runtime name.
     * @returns The runtime name as a string.
     */
    async getRuntime(): Promise<string> {
        return "podjs";
    }

    /**
     * It returns a version.
     * @returns A string.
     */
    async getVersion(): Promise<string> {
        return "¯\\_(ツ)_/¯";
    }
}

interface NetworkResponse {
    payload?: string;
    error?: string;
}

/**
 * BrowserNetwork makes network requests using XMLHttpRequest
 * @class BrowserNetwork
 */
class BrowserNetwork {
    /**
     * It makes a POST request to the specified URL, with a body, a content type, and an auth token.
     * And returns the network response as a promise.
     * @param {string} url - The URL to which the request is sent.
     * @param {string} body - The body of the request.
     * @param {string} [contentType] - The content type of the request.
     * @param {string} [authToken] - The token to use for authentication.
     * @returns A Promise of the Network Response of the call that was executed.
     */
    async httpPost(
        url: string,
        body: string,
        allowInsecure: boolean,
        contentType?: string,
        authToken?: string
    ): Promise<NetworkResponse> {
        return await this.httpFetchRequest(
            "Post",
            url,
            allowInsecure,
            body,
            contentType,
            authToken
        );
    }

    /**
     * It makes a GET request to the specified URL, and returns the response
     * @param {string} url - The URL to fetch.
     * @param {string} [contentType] - The content type of the request.
     * @param {string} [authToken] - The token to use for authentication.
     * @returns A promise.
     */
    async httpGet(
        url: string,
        allowInsecure: boolean,
        contentType?: string,
        authToken?: string
    ): Promise<NetworkResponse> {
        return await this.httpFetchRequest(
            "GET",
            url,
            allowInsecure,
            contentType,
            authToken
        );
    }

    /**
     * It makes a network request of type @type and returns the response
     * @param {string} type - The HTTP method to use.
     * @param {string} url - The URL to fetch.
     * @param {string} [body] - The body of the request.
     * @param {string} [contentType] - The content type of the request.
     * @param {string} [authToken] - The token to use for authentication.
     * @returns The promise is resolved with a NetworkResponse object.
     */
    private async httpFetchRequest(
        type: string,
        url: string,
        allowInsecure: boolean,
        body?: string,
        contentType?: string,
        authToken?: string
    ): Promise<NetworkResponse> {
        return new Promise((resolve) => {
            const request = new XMLHttpRequest();
            const fetchResponse = {} as NetworkResponse;
            request.onreadystatechange = function () {
                if (request.readyState !== XMLHttpRequest.DONE) return;
                const status = request.status;
                if (status < 200 || status > 299) {
                    fetchResponse.error = `Unexpected response: ${request.responseText}`;
                    resolve(fetchResponse);
                    return;
                }
                fetchResponse.payload = request.responseText;
                resolve(fetchResponse);
            };

            request.onerror = function () {
                fetchResponse.error = `Network error`;
                resolve(fetchResponse);
            };
            let urlObject;
            try {
                urlObject = new URL(url);
            } catch (e) {
                fetchResponse.error = `Bad URL`;
                resolve(fetchResponse);
                return;
            }
            if (!allowInsecure && urlObject?.protocol != "https") {
                fetchResponse.error = `Not a secure protocol`;
                resolve(fetchResponse);
                return;
            }
            request.open(type, url);

            if (contentType)
                request.setRequestHeader("Content-Type", contentType);
            if (authToken)
                request.setRequestHeader(
                    "Authorization",
                    "Basic " + btoa(authToken)
                );
            // Request.send must be executed, so this works even if body is null
            request.send(body);
        });
    }
}

interface EndpointInfo {
    url: string;
    auth: string;
    allowInsecure: boolean;
}

interface EndpointJSON {
    polyPediaReport: EndpointInfo;
    demoTest: EndpointInfo;
}

type EndpointKeyId = keyof EndpointJSON;

function getEndpoint(endpointId: EndpointKeyId): EndpointInfo | null {
    return (endpointsJson as EndpointJSON)[endpointId] || null;
}

/**
 * `approveEndpointFetch` is a function that takes in two parameters, `endpointId` and
 * `featureIdToken` and prompts a confirm of this connection. It returns the answer as a boolean value.
 * @param {string} endpointId - The ID of the endpoint that the feature wants to contact.
 * @returns The return value is a boolean.
 */
function approveEndpointFetch(endpointId: string): boolean {
    const featureName = window.parent.currentTitle || window.manifest.name;
    return confirm(
        `${featureName} wants to contact the endpoint: ${endpointId}. \n Proceed?`
    );
}

/**
 * It returns a string that contains the error message.
 * @param {string} fetchType - The type of fetch that failed.
 * @param {string} errorlog - The error message that was returned by the endpoint.
 * @returns a promise.
 */
function endpointErrorMessage(fetchType: string, errorlog: string): string {
    console.error(errorlog);
    return `Endpoint failed at : ${fetchType}`;
}

/**
 * The BrowserEndpoint class implements the Endpoint interface
 * @class BrowserEndpoint
 */
class BrowserEndpoint implements Endpoint {
    endpointNetwork = new BrowserNetwork();

    /**
     * Sends a message to a specific endpoint
     * @param {string} endpointId - The ID of the endpoint to send the request to.
     * @param {string} featureIdToken - The featureIdToken is the token that the user has approved for the
     * feature.
     * @param {string} payload - The payload to send to the endpoint.
     * @param {string} [contentType] - The content type of the payload.
     * @param {string} [authToken] - The token to use for authentication. If not provided, the default
     * token will be used.
     */
    async send(
        endpointId: EndpointKeyId,
        payload: string,
        contentType?: string,
        authToken?: string
    ): Promise<void> {
        if (!approveEndpointFetch(endpointId))
            throw endpointErrorMessage("send", "User denied request");
        const endpoint = getEndpoint(endpointId);
        if (!endpoint) {
            throw endpointErrorMessage("send", "Endpoint URL not set");
        }
        const NetworkResponse = await this.endpointNetwork.httpPost(
            endpoint.url,
            payload,
            endpoint.allowInsecure,
            contentType,
            authToken
        );
        if (NetworkResponse.error) {
            throw endpointErrorMessage("send", NetworkResponse.error);
        }
    }

    async get(
        endpointId: EndpointKeyId,
        contentType?: string,
        authToken?: string
    ): Promise<string> {
        if (!approveEndpointFetch(endpointId))
            throw endpointErrorMessage("get", "User denied request");
        const endpoint = getEndpoint(endpointId);
        if (!endpoint)
            throw endpointErrorMessage("get", "Endpoint URL not set");
        const NetworkResponse = await this.endpointNetwork.httpGet(
            endpoint.url,
            endpoint.allowInsecure,
            contentType,
            authToken
        );
        if (NetworkResponse.error)
            throw endpointErrorMessage("get", NetworkResponse.error);
        if (NetworkResponse.payload) {
            return NetworkResponse.payload;
        } else {
            throw endpointErrorMessage("get", "Endpoint returned null");
        }
    }
}

/**
 * Create a random UUID
 * @returns A string of length 36.
 */
function createUUID(): string {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
            const r = (Math.random() * 16) | 0,
                v = c == "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        }
    );
}

class BrowserPolyNav implements PolyNav {
    /* Creating a new object with a property called actions. The actions property is an
    object with a string key and a value of a function that returns void. */
    actions?: { [key: string]: () => void };

    /** Creating a function that will be called when the user releases a key on the keyboard. */
    private keyUpListener: ((key: KeyboardEvent) => void) | undefined;
    /** Creating a function that will be called when the browser's history state changes. */
    private popStateListener: // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ((this: Window, ev: PopStateEvent) => any) | undefined;

    async openUrl(url: string): Promise<void> {
        console.log(`polyNav: Attempt to open URL: ${url}`);
        const targetLink = (window.manifest?.links as Record<string, string>)[
            url
        ];
        const permission = confirm(
            `Feature ${window.manifest?.name} is trying to open URL ${targetLink}. Allow?`
        );
        if (permission) {
            window.open(targetLink);
        }
    }

    async setActiveActions(actions: string[]): Promise<void> {
        if (actions.includes("back"))
            window.history.pushState(document.title, document.title);
        const actionKeys: { [key: string]: string } = {
            Escape: "back",
            s: "search",
            i: "info",
        };

        if (this.keyUpListener)
            window.removeEventListener("keyup", this.keyUpListener);
        else {
            const actionUsage = Object.entries(actionKeys)
                .map((pair) => `[${pair.join(" = ")}]`)
                .join(", ");
            console.log(
                `polyNav: Keyboard navigation available: ${actionUsage}. You
can also navigate backwards using the browser's back functionality.`
            );
        }
        this.keyUpListener = (key: KeyboardEvent) => {
            const action = actionKeys[key.key];
            if (actions.includes(action)) this.actions?.[action]?.();
        };
        window.addEventListener("keyup", this.keyUpListener);

        if (this.popStateListener)
            window.removeEventListener("popstate", this.popStateListener);

        this.popStateListener = () => {
            // NOTE: This triggers "back" action for both Back and Forward
            // browser buttons
            if (actions.includes("back")) this.actions?.["back"]?.();
        };
        window.addEventListener("popstate", this.popStateListener);
    }

    async setTitle(title: string): Promise<void> {
        window.currentTitle = title;
        const injection = document.getElementById(
            NAV_FRAME_ID
        ) as HTMLIFrameElement;
        injection?.contentWindow?.postMessage(title, "*");
    }

    async pickFile(type?: string): Promise<ExternalFile | null> {
        return new Promise((resolve) => {
            const fileInput = document.createElement("input");
            fileInput.setAttribute("type", "file");
            if (type) fileInput.setAttribute("accept", type);
            fileInput.addEventListener("change", function () {
                const selectedFile = this.files?.[0];
                if (!selectedFile) {
                    // The change listener doesn't seem to be invoked when the
                    // user cancels the file dialog, but if, for some reason,
                    // there is no file anyway, we treat it like cancel.
                    resolve(null);
                    return;
                }

                const reader = new FileReader();
                reader.onload = async function () {
                    const dataUrl = this.result as string;
                    resolve({
                        name: selectedFile.name,
                        url: FileUrl.fromParts(dataUrl, selectedFile.name).url,
                        size: selectedFile.size,
                    });
                };
                reader.readAsDataURL(selectedFile);
            });

            // This is quite the workaround - but the best approach we could
            // find so far to react to the user cancelling the native file
            // picking dialog. It would be more robust to add an additional,
            // non-native popup where the user can select a file using the
            // native mechanism - that way we wouldn't need to react directly to
            // them interacting with the native dialog.
            window.addEventListener("focus", function focusListener() {
                this.removeEventListener("focus", focusListener);
                setTimeout(() => {
                    if (!fileInput.files?.[0]) resolve(null);
                }, 1000);
            });

            fileInput.click();
        });
    }
}

declare global {
    interface Window {
        manifestData: Record<string, unknown>;
        manifest: Manifest;
        currentTitle: string;
    }
}

/**
 * It takes a string representing a color in hexadecimal format and
 * returns the relative luminance of that feature color.
 * @param {string} featureColor - the color of the feature you want to change in a six digit hex color string, e.g. #000000
 * @returns The luminance of the feature color.
 */
function luminance(featureColor: string): number {
    const red = parseInt(featureColor.substr(1, 2), 16);
    const green = parseInt(featureColor.substr(3, 2), 16);
    const blue = parseInt(featureColor.substr(5, 2), 16);
    // See: https://en.wikipedia.org/wiki/Relative_luminance
    return red * 0.2126 + green * 0.7152 + blue * 0.0722;
}

/**
 * It determines the foreground and background colors for the navbar based on the primary color of the
 * app.
 * @param {Manifest} manifest - Manifest
 * @returns an object with two properties: `fg` and `bg`.
 */
function determineNavBarColors(manifest: Manifest): { fg: string; bg: string } {
    const bg = manifest.primaryColor || NAV_DEFAULT_BACKGROUND_COLOR;
    const brightnessThreshold = 80;
    const fg =
        luminance(bg) > brightnessThreshold
            ? NAV_DARK_FOREGROUND_COLOR
            : NAV_LIGHT_FOREGROUND_COLOR;
    return { fg, bg };
}

/**
 * Create a new iframe with a title and a background color
 * @param {string} title - The title of the page.
 * @returns A promise that resolves to a DOM element.
 */
function createNavBarFrame(title: string): HTMLElement {
    const frame = document.createElement("iframe");
    frame.style.display = "block";
    frame.style.width = "100%";
    frame.style.height = "50px";
    frame.frameBorder = "0"; //TODO: @deprecated
    frame.scrolling = "no"; //TODO: @deprecated
    frame.id = NAV_FRAME_ID;

    const navBarColors = determineNavBarColors(window.manifest);
    const source = `
    <html>
        <body style="background-color: ${navBarColors.bg}">
            <script>
                window.addEventListener("message", (event) => {
                    document.getElementById("title").textContent = event.data;
                });
            </script>
            <h1 id="title" style="color: ${navBarColors.fg}">${title}<h1>
        </body>
    </html>
    `;
    const blob = new Blob([source], { type: "text/html" });
    frame.src = URL.createObjectURL(blob);
    return frame;
}

/**
 * The @class BrowserPod is a Pod that uses the browser's local storage to store poly-in and poly-out data
 */
export class BrowserPod implements Pod {
    public readonly dataFactory = dataFactory;
    public readonly polyIn = new IDBPolyIn();
    public readonly polyOut = new IDBPolyOut();
    public readonly polyNav = new BrowserPolyNav();
    public readonly info = new PodJsInfo();
    public readonly endpoint = new BrowserEndpoint();

    /** Creates a navigation bar for the app. */
    constructor() {
        window.addEventListener("load", async () => {
            if (!MANIFEST_DATA) {
                console.warn(
                    `Unable to find feature manifest, navigation bar disabled.`,
                    `To get the navigation bar, expose the manifest's content through`,
                    `the provided "genPodJs" plugin or manually.`
                );
                return;
            }

            try {
                window.manifest = await readManifest(MANIFEST_DATA);
            } catch (e) {
                console.warn(
                    `Unable to parse feature manifest, navigation bar disabled.`,
                    e
                );
                return;
            }

            window.parent.currentTitle =
                window.parent.currentTitle || window.manifest.name;
            const frame = createNavBarFrame(window.parent.currentTitle);
            document.body.prepend(frame);
            document.title = window.manifest.name;
        });
    }
}
