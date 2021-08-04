import { LitElement, html, css } from "lit";
import { analyzeFile } from "../model/analysis.js";

class ExploreView extends LitElement {
    static get styles() {
        return css`
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
            }
        `;
    }

    static get properties() {
        return {
            file: {},
            _fileAnalysis: { state: true },
        };
    }

    async updated(updatedProperties) {
        if (updatedProperties.has("file"))
            this._fileAnalysis = await analyzeFile(this.file);
    }

    _handleBack() {
        this.dispatchEvent(new CustomEvent("close"));
    }

    _handleReviewReport(unrecognizedData) {
        this.dispatchEvent(
            new CustomEvent("review-report", { detail: { unrecognizedData } })
        );
    }

    _renderUnrecognizedCard(unrecognizedData) {
        return html`<div class="analysis-card unrecognized-analysis-card">
            <h1>Unrecognised Data</h1>

            <button
                @click="${() => this._handleReviewReport(unrecognizedData)}"
            >
                Send Report
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
    }

    render() {
        return html`
            <h1>Explore your data</h1>
            <button @click="${this._handleBack}">Back</button>
            ${this._renderFileAnalyses()}
        `;
    }
}

customElements.define("explore-view", ExploreView);
