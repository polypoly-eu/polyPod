import { LitElement, html, css } from "lit";
import { FacebookChecks } from "../model/facebook-checks.js";
import * as zip from "@zip.js/zip.js";

class ExploreView extends LitElement {
    static get styles() {
        return css`
            table {
                margin-top: 10px;
            }

            th {
                padding-right: 10px;
                white-space: nowrap;
            }

            .code {
                font-family: monospace;
            }
        `;
    }

    static get properties() {
        return {
            file: {},
            _analysis: { state: true },
        };
    }

    async _analyzeFile({ id, data }) {
        const hex = [...data]
            .map((i) => i.toString(16).padStart(2, "0"))
            .join(" ");
        const reader = new zip.ZipReader(new zip.Uint8ArrayReader(data));
        const entries = await reader.getEntries();
        const checks = FacebookChecks(entries);
        if (checks.isHTMLExport()) {
            hex = "DEADBEEF";
        }
        return {
            fileId: id,
            fileSize: data.length,
            hex,
            entries,
        };
    }

    async updated(updatedProperties) {
        if (updatedProperties.has("file"))
            this._analysis = await this._analyzeFile(this.file);
    }

    _handleBack() {
        this.dispatchEvent(new CustomEvent("close"));
    }

    _renderFileAnalysis() {
        if (!this._analysis) return html`<p>Error: No file found</p>`;
        return html`
            <table>
                <tr>
                    <th>File ID</th>
                    <td>${this._analysis.fileId}</td>
                </tr>
                <tr>
                    <th>File Size</th>
                    <td>${this._analysis.fileSize}</td>
                </tr>
                <tr>
                    <th>Data</th>
                    <td class="code">${this._analysis.hex}</td>
                </tr>
                <tr>
                    <th>List</th>
                    <td>
                        ${this._analysis.entries
                            .map((entry) => entry.filename)
                            .join("\n")}
                    </td>
                </tr>
            </table>
        `;
    }

    render() {
        return html`
            <h1>Explore your data</h1>
            <button @click="${this._handleBack}">Back</button>
            ${this._renderFileAnalysis()}
        `;
    }
}

customElements.define("explore-view", ExploreView);
