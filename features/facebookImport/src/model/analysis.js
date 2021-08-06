import { html } from "lit";
import * as zip from "@zip.js/zip.js";
import Storage from "../model/storage.js";

const subAnalyses = [
    class {
        get title() {
            return "File name";
        }

        parse({ name }) {
            this.active = true;
            this._name = name;
        }

        render() {
            return "" + this._name;
        }
    },
    class {
        get title() {
            return "File size";
        }

        parse({ data }) {
            this.active = true;
            this._size = data.length;
        }

        render() {
            return "" + this._size;
        }
    },
    class {
        get title() {
            return "Hexdump of compressed data";
        }

        parse({ data }) {
            this.active = !!data.length;
            if (!this.active) return;
            this._hex = [...data]
                .map((i) => i.toString(16).padStart(2, "0"))
                .join(" ");
        }

        render() {
            return html`<code>${this._hex}</code>`;
        }
    },
    class {
        get title() {
            return "List of contents";
        }

        async parse({ reader }) {
            this.active = !!reader;
            if (!this.active) return;
            this._entries = await reader.getEntries();
        }

        render() {
            return html`<ul>
                ${this._entries.map(
                    (entry) => html`<li>${entry.filename}</li>`
                )}
            </ul>`;
        }
    },
];

class UnrecognizedData {
    get isUnrecognized() {
        return true;
    }

    get report() {
        return "Data goes here!!!";
    }
}

export async function analyzeFile(file) {
    const reader = new zip.ZipReader(new zip.Uint8ArrayReader(file.data));
    const enrichedFile = { ...file, reader };
    const parsedAnalyses = await Promise.all(
        subAnalyses.map(async (subAnalysisClass) => {
            const subAnalysis = new subAnalysisClass();
            await subAnalysis.parse(enrichedFile);
            return subAnalysis;
        })
    );
    const activeAnalyses = parsedAnalyses.filter((analysis) => analysis.active);
    return {
        analyses: activeAnalyses,
        unrecognizedData: new UnrecognizedData(),
    };
}
