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
import { Manifest, readManifest } from "@polypoly-eu/manifest-parser";

const NAV_FRAME_ID = "polyNavFrame";
const NAV_DEFAULT_BACKGROUND_COLOR = "white";
const NAV_DEFAULT_FOREGROUND_COLOR = "khaki";
class LocalStoragePolyIn implements PolyIn {
    private static readonly storageKey = "polyInStore";
    private store = JSON.parse(
        localStorage.getItem(LocalStoragePolyIn.storageKey) || "[]"
    );

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
    private popStateListener: any = null;

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
        const actionKeys: any = {
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
        if (this.popStateListener)
            window.removeEventListener("popstate", this.popStateListener);

        this.popStateListener = (_event: any) => {
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
}

declare global {
    interface Window {
        manifestData: string;
        manifest: Manifest;
        currentTitle: string;
    }
}

export class BrowserPod implements Pod {
    constructor() {
        window.addEventListener("load", async () => {
            const manifestJson =
                window.manifestData ||
                (await await (await fetch("manifest.json")).json());
            if (!manifestJson) {
                console.log(
                    `ERROR: Could not load the feature manifest. If you are
                    loading the feature from a file:// URL please explose the
                    manifest data in window.manifestData`
                );
            }
            window.manifest = await readManifest(manifestJson);
            window.parent.currentTitle =
                window.parent.currentTitle || window.manifest.name;
            const injection = document.createElement("iframe");
            injection.style.width = "100%";
            injection.style.height = "50px";
            injection.id = NAV_FRAME_ID;
            const source = `
            <html>
                <body style="background-color: ${
                    window.manifest.primaryColor || NAV_DEFAULT_BACKGROUND_COLOR
                }">
                    <script>
                        window.addEventListener("message", (event) => {
                            document.getElementById("title").textContent = event.data;
                        });
                    </script>
                    <h1 id="title" style="color: ${NAV_DEFAULT_FOREGROUND_COLOR}">
                        ${window.parent.currentTitle}
                    <h1>
                </body>
            </html>
            `;
            const blob = new Blob([source], { type: "text/html" });
            injection.src = URL.createObjectURL(blob);
            document.body.prepend(injection);

            document.title = window.manifest.name;
        });
    }

    public readonly dataFactory = dataFactory;
    public readonly polyIn = new LocalStoragePolyIn();
    public readonly polyOut = new ThrowingPolyOut();
    public readonly polyNav = new BrowserPolyNav();
}
