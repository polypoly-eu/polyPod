import type { RequestInit, Response } from "@polypoly-eu/fetch-spec";
import type {
    Matcher,
    Pod,
    PolyIn,
    PolyOut,
    PolyNav
} from "@polypoly-eu/pod-api";
import { EncodingOptions, Stats } from "@polypoly-eu/pod-api";
import { dataFactory } from "@polypoly-eu/rdf";
import * as RDF from "rdf-js";
import * as zip from "@zip.js/zip.js"

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

class LocalStorageStats implements Stats {
    static of(stats: Stats): LocalStorageStats {
        return new LocalStorageStats(
            stats.isFile(),
            stats.isDirectory(),
            stats.getCreationTime(),
            stats.getSize(),
            stats.getName(),
            stats.getId()
            );
    }

    constructor(
        readonly file: boolean,
        readonly directory: boolean,
        readonly time: string,
        readonly size: number,
        readonly name: string,
        readonly id: string
        ) {}
    isFile(): boolean {
        return this.file;
    }
    isDirectory(): boolean {
        return this.directory;
    }
    getCreationTime(): string {
        return this.time;
    }
    getSize(): number {
        return this.size;
    }
    getName(): string {
        return this.name;
    }
    getId(): string {
        return this.id;
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
        return new Promise(async (resolve, reject) => {
            let parts = id.split("/");
            if (parts.length > 3) {
                let zipId = `${parts[0]}//${parts[2]}`;
                let dataUrl = localStorage.getItem(zipId);
                if (!dataUrl) {
                    reject(new Error(`File not found: ${zipId}`));
                    return;
                }
                let reader = new zip.ZipReader(new zip.Data64URIReader(dataUrl));
                let entryPath = id.substring(zipId.length + 1);
                let zipEntry = (await reader.getEntries()).find(
                    entry => entry.filename == entryPath
                );
                if (!zipEntry) {
                    reject(new Error(`Zip entry not found: ${entryPath}`));
                    return;
                }
                const data = await zipEntry.getData!(new zip.TextWriter());
                resolve(new TextEncoder().encode(data));
                return;
            }
            if (!files.has(id)) {
                reject(new Error(`File not found: ${id}`));
                return;
            }
            let dataUrl = localStorage.getItem(id);
            if (!dataUrl) {
                reject(new Error(`File not found: ${id}`));
            }
            let response = await fetch(dataUrl || "");
            const arrayBuf = await response.arrayBuffer();
            resolve(new Uint8Array(arrayBuf));
        });
    }

    readdir(path: string): Promise<string[]> {
        files = new Map<string, Stats>(JSON.parse(
            localStorage.getItem(BrowserPolyNav.filesKey) || "[]"
            ));
        return new Promise(async (resolve, reject)  => {
            const filteredFiles = Array.from(
                files
            ).filter(
                file => file[0].startsWith(path)
            ).map(file => file[0]);

            if (path == "") {
                resolve(filteredFiles);
                return;
            }
            let dataUrl = localStorage.getItem(path);
            if (!dataUrl) {
                reject(new Error(`File not found: ${path}`));
                return;
            }
            let reader = new zip.ZipReader(new zip.Data64URIReader(dataUrl));
            resolve((await reader.getEntries()).map(
                entry => `${path}/${entry.filename}`)
            );
        });
    }

    stat(id: string): Promise<Stats> {
        return new Promise(async resolve => {
            files = new Map<string, Stats>(JSON.parse(
                localStorage.getItem(BrowserPolyNav.filesKey) || "[]"
                ));
            if (!files.has(id)) {
                throw new Error(`File not found: ${id}`);
            }
            resolve(files.get(id)!!);
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

function createUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
       var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
       return v.toString(16);
    });
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
                    let filesInDir = new Map(JSON.parse(
                        localStorage.getItem(BrowserPolyNav.filesKey) || "[]"
                        ));

                    let fileId = "polypod://" + createUUID();
                    filesInDir.set(fileId, {
                        id: fileId,
                        name: selectedFile.name,
                        time: new Date().toISOString(),
                        size: dataUrl.length
                    });
                    localStorage.setItem(BrowserPolyNav.filesKey,
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
        return new Promise(resolve => {
            let filesInDir = new Map(JSON.parse(
                localStorage.getItem(BrowserPolyNav.filesKey) || "[]"
                ));
            filesInDir.delete(fileId);
            localStorage.setItem(BrowserPolyNav.filesKey,
                JSON.stringify(Array.from(filesInDir))
            );
            localStorage.removeItem(fileId);
            resolve()
        })
    }
}

export class BrowserPod implements Pod {
    public readonly dataFactory = dataFactory;
    public readonly polyIn = new LocalStoragePolyIn();
    public readonly polyOut = new LocalStoragePolyOut();
    public readonly polyNav = new BrowserPolyNav();
}
