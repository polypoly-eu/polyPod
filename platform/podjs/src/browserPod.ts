import type { RequestInit, Response } from "@polypoly-eu/fetch-spec";
import type {
    ExternalFile,
    Endpoint,
    EndpointResponse,
    Network,
    NetworkResponse,
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
//@ts-ignore
import endpoints from "../../../assets/config/endpoints.json";

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

    async select(matcher: Partial<Matcher>): Promise<RDF.Quad[]> {
        return this.store.filter((quad: RDF.Quad) => {
            if (!quad) return false;
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

    async add(...quads: RDF.Quad[]): Promise<void> {
        this.store.push(...quads);
        localStorage.setItem(
            LocalStoragePolyIn.storageKey,
            JSON.stringify(this.store)
        );
    }

    async delete(...quads: RDF.Quad[]): Promise<void> {
        quads.forEach((quad) => {
            delete this.store[this.store.indexOf(quad)];
        });
        localStorage.setItem(
            LocalStoragePolyIn.storageKey,
            JSON.stringify(this.store)
        );
    }

    async has(...quads: RDF.Quad[]): Promise<boolean> {
        throw "Not implemented: has";
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
    fetch(input: string, init?: RequestInit): Promise<Response> {
        return window.fetch(input, init);
    }

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
                    if (!zipEntry) {
                        reject(new Error(`Zip entry not found: ${entryPath}`));
                        return;
                    }
                    zipEntry.getData!(new zip.TextWriter()).then((data) => {
                        resolve(new TextEncoder().encode(data));
                    });
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

class BrowserNetwork implements Network {
    async httpPost(
        url: string,
        body: string,
        contentType?: string,
        authorization?: string
    ): Promise<NetworkResponse> {
        return new Promise((resolve) => {
            const request = new XMLHttpRequest();
            const fetchResponse = {} as NetworkResponse;
            request.onreadystatechange = function () {
                if (request.readyState !== XMLHttpRequest.DONE) return;
                const status = request.status;
                if (status < 200 || status > 299) {
                    fetchResponse.payload = `Unexpected response: ${request.responseText}`;
                    fetchResponse.responseCode = this.status;
                    resolve(fetchResponse);
                }
                fetchResponse.payload = request.responseText;
                fetchResponse.responseCode = this.status;
                resolve(fetchResponse);
            };

            request.onerror = function () {
                fetchResponse.payload = "Network error";
                fetchResponse.responseCode = 403;
                resolve(fetchResponse);
            };

            request.open("POST", url);
            if (contentType)
                request.setRequestHeader("Content-Type", contentType);
            if (authorization)
                request.setRequestHeader(
                    "Authorization",
                    "Basic " + btoa(authorization)
                );
            request.send(body);
        });
    }
    async httpGet(
        url: string,
        body: string,
        contentType?: string,
        authorization?: string
    ): Promise<NetworkResponse> {
        return new Promise((resolve) => {
            const request = new XMLHttpRequest();
            const fetchResponse = {} as NetworkResponse;
            request.onreadystatechange = function () {
                if (request.readyState !== XMLHttpRequest.DONE) return;
                const status = request.status;
                if (status < 200 || status > 299) {
                    fetchResponse.payload = `Unexpected response: ${request.responseText}`;
                    fetchResponse.responseCode = this.status;
                    resolve(fetchResponse);
                }
                fetchResponse.payload = request.responseText;
                fetchResponse.responseCode = this.status;
                resolve(fetchResponse);
            };

            request.onerror = function () {
                fetchResponse.payload = "Network API Client Error";
                fetchResponse.responseCode = 400;
                resolve(fetchResponse);
            };

            request.open("GET", url);
            if (contentType)
                request.setRequestHeader("Content-Type", contentType);
            if (authorization)
                request.setRequestHeader(
                    "Authorization",
                    "Basic " + btoa(authorization)
                );
            request.send(body);
        });
    }
}

function getEndpoint(endpointId: string): string | null {
    return endpoints[endpointId]?.url || null;
}

function approveEndpointFetch(
    endpointId: string,
    featureIdToken: string
): boolean {
    return confirm(
        `${featureIdToken} wants to contact the endpoint: ${endpointId}. \n Proceed?`
    );
}

class BrowserEndpoint implements Endpoint {
    endpointNetwork = new BrowserNetwork();
    async send(
        endpointId: string,
        featureIdToken: string,
        payload: string,
        contentType?: string,
        authorization?: string
    ): Promise<EndpointResponse> {
        //Poly Error Codes start from 600s or 1000s
        if (!approveEndpointFetch(endpointId, featureIdToken))
            return new Promise(() => ({
                payload: "User Denied Request",
                responseCode: 600,
            }));
        const endpointURL = getEndpoint(endpointId);
        if (!endpointURL)
            return new Promise(() => ({
                payload: "Endpoint URL not found",
                responseCode: 604,
            }));
        const endpointResponse = {
            ...(await this.endpointNetwork.httpPost(
                endpointURL,
                payload,
                contentType,
                authorization
            )),
        } as EndpointResponse;
        return new Promise((response) => response(endpointResponse));
    }
    async get(
        endpointId: string,
        featureIdToken: string,
        payload: string,
        contentType?: string,
        authorization?: string
    ): Promise<EndpointResponse> {
        if (!approveEndpointFetch(endpointId, featureIdToken))
            return new Promise(() => ({
                payload: "User Denied Request",
                responseCode: 600,
            }));
        const endpointURL = getEndpoint(endpointId);
        if (!endpointURL)
            return new Promise(() => ({
                payload: "Endpoint URL not found",
                responseCode: 604,
            }));
        const endpointResponse = {
            ...(await this.endpointNetwork.httpPost(
                endpointURL,
                payload,
                contentType,
                authorization
            )),
        } as EndpointResponse;
        return new Promise((response) => response(endpointResponse));
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
    private keyUpListener: any = null;

    async openUrl(url: string): Promise<void> {
        console.log(`polyNav: Attempt to open URL: ${url}`);
    }

    async setActiveActions(actions: string[]): Promise<void> {
        const actionKeys: any = {
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
                `polyNav: Keyboard navigation available: ${actionUsage}`
            );
        }
        this.keyUpListener = ({ key }: any) => {
            const action = actionKeys[key];
            if (actions.includes(action)) this.actions?.[action]?.();
        };
        window.addEventListener("keyup", this.keyUpListener);
    }

    async setTitle(title: string): Promise<void> {
        document.title = title;
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

export class BrowserPod implements Pod {
    public readonly dataFactory = dataFactory;
    public readonly polyIn = new LocalStoragePolyIn();
    public readonly polyOut = new LocalStoragePolyOut();
    public readonly polyNav = new BrowserPolyNav();
    public readonly info = new PodJsInfo();
    public readonly network = new BrowserNetwork();
    public readonly endpoint = new BrowserEndpoint();
}
