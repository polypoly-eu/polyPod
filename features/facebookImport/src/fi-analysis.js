import { LitElement, html, css } from "lit";
import * as zip from "@zip.js/zip.js";

const hexdump = (data) =>
    [...data].map((i) => i.toString(16).padStart(2, "0")).join(" ");

class FiAnalysis extends LitElement {
    static get styles() {
        return css`
            table {
                margin-top: 10px;
            }

            th {
                padding-right: 10px;
            }

            .code {
                font-family: monospace;
            }
        `;
    }

    static get properties() {
        return {
            files: {},
            _analysis: { state: true },
        };
    }

    constructor() {
        super();
        this.files = [];
        this._analysis = [];
    }

    async _analyzeFile({ id, data }) {
        const reader = new zip.ZipReader(new zip.Uint8ArrayReader(data));
        const entries = await reader.getEntries();
        return {
            fileId: id,
            fileSize: data.length,
            hex: hexdump(data),
            entries,
        };
    }

    async _updateAnalysis() {
        this._analysis = await Promise.all(this.files.map(this._analyzeFile));
    }

    updated(changedProperties) {
        if (changedProperties.has("files")) this._updateAnalysis();
    }

    _renderFileAnalysis(fileAnalysis) {
        return html`
            <h2>${fileAnalysis.fileId}</h2>
            <table>
                <tr>
                    <th>Size</th>
                    <td>${fileAnalysis.fileSize}</td>
                </tr>
                <tr>
                    <th>Data</th>
                    <td class="code">${fileAnalysis.hex}</td>
                </tr>
                <tr>
                    <th>List</th>
                    <td>
                        ${fileAnalysis.entries
                            .map((entry) => entry.filename)
                            .join("\n")}
                    </td>
                </tr>
            </table>
        `;
    }

    render() {
        return html`${this._analysis.map(this._renderFileAnalysis)}`;
    }
}

customElements.define("fi-analysis", FiAnalysis);
