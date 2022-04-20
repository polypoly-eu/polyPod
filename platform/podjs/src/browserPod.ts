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
import * as zip from "@zip.js/zip.js";
import endpointsJson from "../../../../polyPod-config/endpoints.json";
import { Manifest, readManifest } from "./manifest";

const NAV_FRAME_ID = "polyNavFrame";
const NAV_DEFAULT_BACKGROUND_COLOR = "#ffffff";
const NAV_DARK_FOREGROUND_COLOR = "#000000";
const NAV_LIGHT_FOREGROUND_COLOR = "#ffffff";

class LocalStoragePolyIn implements PolyIn {
    private static readonly storageKey = "polyInStore";
    private store = JSON.parse(
        localStorage.getItem(LocalStoragePolyIn.storageKey) || "[]"
    );

    async match(matcher: Partial<Matcher>): Promise<RDF.Quad[]> {
        return this.store.filter((quad: RDF.Quad) => {
            if (matcher.subject && quad.subject.value != matcher.subject.value)
                return false;
            if (matcher.object && quad.object.value != matcher.object.value)
                return false;
            if (
                matcher.predicate &&
                quad.predicate.value != matcher.predicate.value
            )
                return false;
            return true;
        });
    }

    private checkQuads(quads: RDF.Quad[]): void {
        for (const quad of quads)
            if (!quad.graph.equals(dataFactory.defaultGraph()))
                throw new Error("Only default graph allowed");
    }

    async add(...quads: RDF.Quad[]): Promise<void> {
        this.checkQuads(quads);
        this.store.push(...quads);
        localStorage.setItem(
            LocalStoragePolyIn.storageKey,
            JSON.stringify(this.store)
        );
    }

    async delete(...quads: RDF.Quad[]): Promise<void> {
        this.checkQuads(quads);
        quads.forEach((quad) => {
            delete this.store[this.store.indexOf(quad)];
        });
        localStorage.setItem(
            LocalStoragePolyIn.storageKey,
            JSON.stringify(this.store)
        );
    }

    async has(...quads: RDF.Quad[]): Promise<boolean> {
        this.checkQuads(quads);
        return quads.some((quad) => this.store.includes(quad));
    }
}

// Since pickFile and importArchive work with local URLs that have the actual
// archive file name as their last component, and since the current BrowserPod
// implementation works with data URLs which don't, we employ a little workaround.
class FileUrl {
    private static readonly separator = "/";

    static fromUrl(url: string): FileUrl {
        const [lastComponent, ...rest] = url.split(FileUrl.separator).reverse();
        return new FileUrl(
            url,
            rest.reverse().join(FileUrl.separator),
            lastComponent
        );
    }

    static fromParts(data: string, fileName: string): FileUrl {
        const url = data + FileUrl.separator + fileName;
        return new FileUrl(url, data, fileName);
    }

    constructor(
        readonly url: string,
        readonly data: string,
        readonly fileName: string
    ) {}
}

/* eslint-disable @typescript-eslint/no-unused-vars */
class LocalStoragePolyOut implements PolyOut {
    readFile(path: string, options: EncodingOptions): Promise<string>;
    readFile(path: string): Promise<Uint8Array>;
    readFile(
        id: string,
        options?: EncodingOptions
    ): Promise<string | Uint8Array | undefined> {
        if (options) {
            throw new Error("Not implemented: readFile with options");
        }
        return new Promise((resolve, reject) => {
            const parts = id.split("/");
            if (parts.length > 3) {
                const zipId = `${parts[0]}//${parts[2]}`;
                const dataUrl = localStorage.getItem(zipId);
                if (!dataUrl) {
                    reject(new Error(`File not found: ${zipId}`));
                    return;
                }
                const reader = new zip.ZipReader(
                    new zip.Data64URIReader(dataUrl)
                );
                const entryPath = id.substring(zipId.length + 1);
                reader.getEntries().then((entries) => {
                    const zipEntry = entries.find(
                        (entry) => entry.filename == entryPath
                    );

                    zipEntry
                        ? zipEntry
                              .getData?.(new zip.TextWriter())
                              .then((data: string | undefined) => {
                                  resolve(new TextEncoder().encode(data));
                              })
                        : reject(
                              new Error(`Zip entry not found: ${entryPath}`)
                          );
                });
                return;
            }
            if (!files.has(id)) {
                reject(new Error(`File not found: ${id}`));
                return;
            }
            const dataUrl = localStorage.getItem(id);
            if (!dataUrl) {
                reject(new Error(`File not found: ${id}`));
            }
            fetch(dataUrl || "").then((response) => {
                response.arrayBuffer().then((arrayBuf) => {
                    resolve(new Uint8Array(arrayBuf));
                });
            });
        });
    }

    readDir(id: string): Promise<Entry[]> {
        const files = new Map<string, Stats>(
            JSON.parse(localStorage.getItem(BrowserPolyNav.filesKey) || "[]")
        );
        return new Promise((resolve, reject) => {
            const filteredFiles = Array.from(files)
                .filter((file) => file[0].startsWith(id))
                .map((file) => file[0]);
            if (id == "") {
                resolve(
                    filteredFiles.map((file) => ({ id: file, path: file }))
                );
                return;
            }
            const dataUrl = localStorage.getItem(id);
            if (!dataUrl) {
                reject(new Error(`File not found: ${id}`));
                return;
            }
            const reader = new zip.ZipReader(new zip.Data64URIReader(dataUrl));
            reader.getEntries().then((entries) => {
                resolve(
                    entries.map((entry) => ({
                        id: `${id}/${entry.filename}`,
                        path: entry.filename,
                    }))
                );
            });
        });
    }

    stat(id: string): Promise<Stats> {
        return new Promise((resolve, reject) => {
            if (id === "") {
                resolve({
                    getId: () => "",
                    getSize: () => 0,
                    getTime: () => "",
                    getName: () => "",
                    isFile: () => false,
                    isDirectory: () => true,
                });
                return;
            }
            const parts = id.split("/");
            if (parts.length > 3) {
                const zipId = `${parts[0]}//${parts[2]}`;
                const dataUrl = localStorage.getItem(zipId);
                if (!dataUrl) {
                    reject(new Error(`File not found: ${zipId}`));
                    return;
                }
                const reader = new zip.ZipReader(
                    new zip.Data64URIReader(dataUrl)
                );
                const entryPath = id.substring(zipId.length + 1);
                reader.getEntries().then((entries) => {
                    const zipEntry = entries.find(
                        (entry) => entry.filename == entryPath
                    );
                    if (!zipEntry) {
                        reject(new Error(`Zip entry not found: ${entryPath}`));
                        return;
                    }
                    const modal: Stats = {
                        getId: () => id,
                        getSize: () => zipEntry.uncompressedSize,
                        getTime: () => "",
                        getName: () => zipEntry.filename,
                        isFile: () => !zipEntry.directory,
                        isDirectory: () => zipEntry.directory,
                    };

                    resolve(modal);
                });
                return;
            }

            files = new Map<string, Stats>(
                JSON.parse(
                    localStorage.getItem(BrowserPolyNav.filesKey) || "[]"
                )
            );
            if (!files.has(id)) {
                throw new Error(`File not found: ${id}`);
            }
            resolve(files.get(id) || ({} as Stats));
        });
    }

    writeFile(
        path: string,
        content: string,
        options: EncodingOptions
    ): Promise<void> {
        throw "Not implemented: writeFile";
    }

    async importArchive(url: string): Promise<string> {
        return new Promise((resolve) => {
            const filesInDir = new Map(
                JSON.parse(
                    localStorage.getItem(BrowserPolyNav.filesKey) || "[]"
                )
            );

            const fileId = "polypod://" + createUUID();
            const { data: dataUrl, fileName } = FileUrl.fromUrl(url);
            filesInDir.set(fileId, {
                id: fileId,
                name: fileName,
                time: new Date().toISOString(),
                size: dataUrl.length,
            });
            localStorage.setItem(
                BrowserPolyNav.filesKey,
                JSON.stringify(Array.from(filesInDir))
            );
            localStorage.setItem(fileId, dataUrl);
            resolve(fileId);
        });
    }

    async removeArchive(fileId: string): Promise<void> {
        return new Promise((resolve) => {
            const filesInDir = new Map(
                JSON.parse(
                    localStorage.getItem(BrowserPolyNav.filesKey) || "[]"
                )
            );
            filesInDir.delete(fileId);
            localStorage.setItem(
                BrowserPolyNav.filesKey,
                JSON.stringify(Array.from(filesInDir))
            );
            localStorage.removeItem(fileId);
            resolve();
        });
    }
}
/* eslint-enable @typescript-eslint/no-unused-vars */

class PodJsInfo implements Info {
    async getRuntime(): Promise<string> {
        return "podjs";
    }

    async getVersion(): Promise<string> {
        return "¯\\_(ツ)_/¯";
    }
}

interface NetworkResponse {
    payload?: string;
    error?: string;
}

class BrowserNetwork {
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

function approveEndpointFetch(endpointId: string): boolean {
    const featureName = window.parent.currentTitle || window.manifest.name;
    return confirm(
        `${featureName} wants to contact the endpoint: ${endpointId}. \n Proceed?`
    );
}

function endpointErrorMessage(fetchType: string, errorlog: string): string {
    console.error(errorlog);
    return `Endpoint failed at : ${fetchType}`;
}

class BrowserEndpoint implements Endpoint {
    endpointNetwork = new BrowserNetwork();
    async send(
        endpointId: EndpointKeyId,
        payload: string,
        contentType?: string,
        authToken?: string
    ): Promise<void> {
        if (!approveEndpointFetch(endpointId))
            throw endpointErrorMessage("send", "User denied request");
        const endpoint = getEndpoint(endpointId as EndpointKeyId);
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
        const endpoint = getEndpoint(endpointId as EndpointKeyId);
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

let files = new Map<string, Stats>();
class BrowserPolyNav implements PolyNav {
    static readonly filesKey = "files";
    actions?: { [key: string]: () => void };
    private keyUpListener: ((key: KeyboardEvent) => void) | undefined;
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
 * Returns the relative luminance value of a feature color.
 *
 * @param featureColor - A six digit hex color string, e.g. #000000
 */
function luminance(featureColor: string): number {
    const red = parseInt(featureColor.substr(1, 2), 16);
    const green = parseInt(featureColor.substr(3, 2), 16);
    const blue = parseInt(featureColor.substr(5, 2), 16);
    // See: https://en.wikipedia.org/wiki/Relative_luminance
    return red * 0.2126 + green * 0.7152 + blue * 0.0722;
}

function determineNavBarColors(manifest: Manifest): { fg: string; bg: string } {
    const bg = manifest.primaryColor || NAV_DEFAULT_BACKGROUND_COLOR;
    const brightnessThreshold = 80;
    const fg =
        luminance(bg) > brightnessThreshold
            ? NAV_DARK_FOREGROUND_COLOR
            : NAV_LIGHT_FOREGROUND_COLOR;
    return { fg, bg };
}

function createNavBarFrame(title: string): HTMLElement {
    const frame = document.createElement("iframe");
    frame.style.display = "block";
    frame.style.width = "100%";
    frame.style.height = "50px";
    frame.frameBorder = "0";
    frame.scrolling = "no";
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

// DYNAMIC_IMPORT_MANIFEST points to the `manifest.json` file of the bundled dest
// as it's setup in our rollup configuration and will be replaced at build time.
// export const DYNAMIC_IMPORT_MANIFEST = "";

export class BrowserPod implements Pod {
    public readonly dataFactory = dataFactory;
    public readonly polyIn = new LocalStoragePolyIn();
    public readonly polyOut = new LocalStoragePolyOut();
    public readonly polyNav = new BrowserPolyNav();
    public readonly info = new PodJsInfo();
    public readonly endpoint = new BrowserEndpoint();

    constructor() {
        window.addEventListener("load", async () => {
            window.manifestData = await this.fetchManifestJson<
                Record<string, unknown>
            >();
            window.manifest = await readManifest(window.manifestData);
            window.parent.currentTitle =
                window.parent.currentTitle || window.manifest.name;
            const frame = createNavBarFrame(window.parent.currentTitle);
            document.body.prepend(frame);
            document.title = window.manifest.name;
        });
    }

    private async fetchManifestJson<T>(): Promise<T> {
        const opts = {
            method: "GET",
            headers: {
                mode: "no-cors",
                "Content-Type": "application/json",
                "Referrer-Policy": "strict-origin-when-cross-origin",
                "X-Requested-With": "XMLHttpRequest",
                "Access-Control-Allow-Origin": "*",
            },
        };

        // Fetch the manifest-data JSON
        return fetch("../src/static/manifest.json", opts)
            .then((response) => response.json())
            .then((body) => {
                return body;
            })
            .catch((error) => {
                console.warn(
                    `Unable to find feature manifest, navigation bar disabled.
            To get the navigation bar, expose the manifest's content as
            window.manifestData.`,
                    error
                );
                return error;
            });
    }
}
