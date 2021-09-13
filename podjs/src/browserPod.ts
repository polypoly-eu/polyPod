import type { RequestInit, Response } from "@polypoly-eu/fetch-spec";
import type {
    Matcher,
    Network,
    Pod,
    PolyIn,
    PolyOut,
    PolyNav,
} from "@polypoly-eu/pod-api";
import { EncodingOptions, Stats } from "@polypoly-eu/pod-api";
import { dataFactory } from "@polypoly-eu/rdf";
import * as RDF from "rdf-js";
import * as zip from "@zip.js/zip.js";

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

    readdir(path: string): Promise<string[]> {
        files = new Map<string, Stats>(
            JSON.parse(localStorage.getItem(BrowserPolyNav.filesKey) || "[]")
        );
        return new Promise((resolve, reject) => {
            const filteredFiles = Array.from(files)
                .filter((file) => file[0].startsWith(path))
                .map((file) => file[0]);

            if (path == "") {
                resolve(filteredFiles);
                return;
            }
            const dataUrl = localStorage.getItem(path);
            if (!dataUrl) {
                reject(new Error(`File not found: ${path}`));
                return;
            }
            const reader = new zip.ZipReader(new zip.Data64URIReader(dataUrl));
            reader
                .getEntries()
                .then((entries) =>
                    resolve(entries.map((entry) => `${path}/${entry.filename}`))
                );
        });
    }

    stat(id: string): Promise<Stats> {
        return new Promise((resolve) => {
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
}
/* eslint-enable @typescript-eslint/no-unused-vars */

class BrowserNetwork implements Network {
    async httpPost(
        url: string,
        body: string,
        contentType?: string,
        authorization?: string
    ): Promise<string | undefined> {
        return new Promise((resolve) => {
            const request = new XMLHttpRequest();

            request.onreadystatechange = function () {
                if (request.readyState !== XMLHttpRequest.DONE) return;
                const status = request.status;
                if (status < 200 || status > 299) {
                    resolve(`Unexpected response status: ${status}`);
                    return;
                }
                resolve();
            };

            request.onerror = function () {
                resolve("Network error");
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

    async importFile(): Promise<string> {
        return new Promise((resolve) => {
            const fileInput = document.createElement("input");
            fileInput.setAttribute("type", "file");
            fileInput.addEventListener("change", function () {
                const selectedFile = this.files?.[0];
                if (!selectedFile) {
                    resolve("");
                    return;
                }

                const reader = new FileReader();
                reader.onload = async function () {
                    const dataUrl = this.result as string;
                    const filesInDir = new Map(
                        JSON.parse(
                            localStorage.getItem(BrowserPolyNav.filesKey) ||
                                "[]"
                        )
                    );

                    const fileId = "polypod://" + createUUID();
                    filesInDir.set(fileId, {
                        id: fileId,
                        name: selectedFile.name,
                        time: new Date().toISOString(),
                        size: dataUrl.length,
                    });
                    localStorage.setItem(
                        BrowserPolyNav.filesKey,
                        JSON.stringify(Array.from(filesInDir))
                    );
                    localStorage.setItem(fileId, dataUrl);
                    resolve(dataUrl);
                };
                reader.readAsDataURL(selectedFile);
            });
            fileInput.click();
        });
    }

    async removeFile(fileId: string): Promise<void> {
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

export class BrowserPod implements Pod {
    public readonly dataFactory = dataFactory;
    public readonly polyIn = new LocalStoragePolyIn();
    public readonly polyOut = new LocalStoragePolyOut();
    public readonly polyNav = new BrowserPolyNav();
    public readonly network = new BrowserNetwork();
}
