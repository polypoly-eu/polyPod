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
        files = new Map<string, string>(JSON.parse(
            localStorage.getItem(BrowserPolyNav.filesKey) || "[]"
            ));
        return new Promise(async (resolve, reject) => {
            if (!files.has(id)) {
                reject(new Error(`File not found: ${id}`));
                return;
            }
            let response = await fetch(files.get(id) || "");
            const arrayBuf = await response.arrayBuffer();
            resolve(new Uint8Array(arrayBuf));
        });
    }

    readdir(path: string): Promise<string[]> {
        files = new Map<string, string>(JSON.parse(
            localStorage.getItem(BrowserPolyNav.filesKey) || "[]"
            ));
        return new Promise(async resolve => {
            const filteredFiles = Array.from(files).filter(file => file[0].startsWith(path));
            const response = [];
            for (const file of filteredFiles) {
                const filePath = (file[1] as unknown) as string;
                response.push(filePath);
            }
            resolve(response);
        });
    }

    stat(path: string): Promise<Stats> {
        throw "Not implemented: stat";
    }

    writeFile(
        path: string,
        content: string,
        options: EncodingOptions
    ): Promise<void> {
        throw "Not implemented: writeFile";
    }

    removeFile(fileId: string): Promise<void> | void {
        return new Promise(resolve => {
            files = new Map<string, string>(JSON.parse(
                localStorage.getItem(BrowserPolyNav.filesKey) || "[]"
                ));
            files.delete(fileId);
            localStorage.setItem(
                BrowserPolyNav.filesKey,
                JSON.stringify(Array.from(files))
            );
            resolve();
        });
    }
}
/* eslint-enable @typescript-eslint/no-unused-vars */

let files = new Map<string, string>();
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

                    filesInDir.set(selectedFile.name, dataUrl);
                    localStorage.setItem(BrowserPolyNav.filesKey,
                        JSON.stringify(Array.from(filesInDir))
                    );
                    resolve(dataUrl);
                };
                reader.readAsDataURL(selectedFile);
            });
            fileInput.click();
        });
    }

    async removeFile(fileId: string): Promise<void> {
        throw new Error("not implemented");
    }
}

export class BrowserPod implements Pod {
    public readonly dataFactory = dataFactory;
    public readonly polyIn = new LocalStoragePolyIn();
    public readonly polyOut = new LocalStoragePolyOut();
    public readonly polyNav = new BrowserPolyNav();
}
