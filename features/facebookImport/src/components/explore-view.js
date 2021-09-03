import { LitElement, html, css } from "lit";
<<<<<<< HEAD
import FacebookChecks from "../model/facebook-checks.js";
import * as zip from "@zip.js/zip.js";
=======
import { analyzeFile } from "../model/analysis.js";
>>>>>>> main

class ExploreView extends LitElement {
    static get styles() {
        return css`
<<<<<<< HEAD
            table {
                margin-top: 10px;
            }

            th {
                padding-right: 10px;
                white-space: nowrap;
            }

            .code {
                font-family: monospace;
=======
            .analysis-card:first-child {
                margin-top: 20px;
            }

            .analysis-card {
                margin: 0 8px 8px 8px;
                padding: 4px;
                border: 1px solid black;
                border-radius: 8px;
            }

            .analysis-card > h1 {
                font-size: 16px;
            }

            .unrecognized-analysis-card {
                border-color: red;
>>>>>>> main
            }
        `;
    }

    static get properties() {
        return {
            file: {},
<<<<<<< HEAD
            _analysis: { state: true },
        };
    }

    async _analyzeFile({ id, data }) {
        let hex = [...data]
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
=======
            _fileAnalysis: { state: true },
>>>>>>> main
        };
    }

    async updated(updatedProperties) {
        if (updatedProperties.has("file"))
<<<<<<< HEAD
            this._analysis = await this._analyzeFile(this.file);
=======
            this._fileAnalysis = await analyzeFile(this.file);
>>>>>>> main
    }

    _handleBack() {
        this.dispatchEvent(new CustomEvent("close"));
    }

<<<<<<< HEAD
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
=======
    _handleReviewReport(unrecognizedData) {
        this.dispatchEvent(
            new CustomEvent("review-report", { detail: { unrecognizedData } })
        );
    }

    _renderUnrecognizedCard(unrecognizedData) {
        return html`<div class="analysis-card unrecognized-analysis-card">
            <h1>Unrecognised and Missing Data</h1>
            <p>${unrecognizedData.report}</p>
            <button
                @click="${() => this._handleReviewReport(unrecognizedData)}"
            >
                View&Send Report
            </button>
        </div>`;
    }

    _renderAnalysisCard(analysis) {
        return html`<div class="analysis-card">
            <h1>${analysis.title}</h1>
            <p>${analysis.render()}</p>
        </div>`;
    }

    _renderFileAnalyses() {
        if (!this._fileAnalysis) {
            return "";
        }
        return html`<div>
            ${this._renderUnrecognizedCard(this._fileAnalysis.unrecognizedData)}
            ${this._fileAnalysis.analyses.map(this._renderAnalysisCard)}
        </div>`;
>>>>>>> main
    }

    render() {
        return html`
            <h1>Explore your data</h1>
            <button @click="${this._handleBack}">Back</button>
<<<<<<< HEAD
            ${this._renderFileAnalysis()}
=======
            ${this._renderFileAnalyses()}
>>>>>>> main
        `;
    }
}

customElements.define("explore-view", ExploreView);
