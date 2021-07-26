import type { RequestInit, Response } from "@polypoly-eu/fetch-spec";
import type {
    Matcher,
    Pod,
    PolyIn,
    PolyOut,
    PolyNav,
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
        if (["subject", "predicate", "object"].some((key) => key in matcher))
            throw "Not implemented: select with non-empty matcher";
        return this.store;
    }


    async select(matcher: Partial<Matcher>): Promise<RDF.Quad[]> {
        if (["subject", "predicate", "object"].some((key) => key in matcher))
            throw "Not implemented: select with non-empty matcher";
        return this.store;
    }

    async add(...quads: RDF.Quad[]): Promise<void> {
        this.store.push(...quads);
        localStorage.setItem(
            LocalStoragePolyIn.storageKey,
            JSON.stringify(this.store)
        );
    }

    async delete(...quads: RDF.Quad[]): Promise<void> {
        throw "Not implemented: delete";
    }

    async has(...quads: RDF.Quad[]): Promise<boolean> {
        throw "Not implemented: has";
    }

}

/* eslint-disable @typescript-eslint/no-unused-vars */
class ThrowingPolyOut implements PolyOut {
    fetch(input: string, init?: RequestInit): Promise<Response> {
        return window.fetch(input, init);
    }

    readFile(path: string, options: EncodingOptions): Promise<string>;
    readFile(path: string): Promise<Uint8Array>;
    readFile(
        path: string,
        options?: EncodingOptions
    ): Promise<string | Uint8Array> {
        throw "Not implemented: readFile";
    }

    readdir(path: string): Promise<string[]> {
        throw "Not implemented: readdir";
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
}
/* eslint-enable @typescript-eslint/no-unused-vars */

class BrowserPolyNav implements PolyNav {
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

    async pickFile(): Promise<Uint8Array | null> {
        return new Promise((resolve) => {
            const fileInput = document.createElement("input");
            fileInput.setAttribute("type", "file");
            fileInput.addEventListener("change", function () {
                const selectedFile = this.files?.[0];
                if (!selectedFile) {
                    resolve(null);
                    return;
                }

                const reader = new FileReader();
                reader.onload = function () {
                    const buffer = this.result as ArrayBuffer;
                    const file = new Uint8Array(buffer);
                    resolve(file);
                };
                reader.readAsArrayBuffer(selectedFile);
            });
            fileInput.click();
        });
    }
}

export class BrowserPod implements Pod {
    public readonly dataFactory = dataFactory;
    public readonly polyIn = new LocalStoragePolyIn();
    public readonly polyOut = new ThrowingPolyOut();
    public readonly polyNav = new BrowserPolyNav();
}
