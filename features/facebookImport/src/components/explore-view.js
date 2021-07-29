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

.analysis-card>h1 {
font-size: 16px;
}
        `;
    }

    static get properties() {
        return {
            file: {},
            _analyses: { state: true },
        };
    }

    async updated(updatedProperties) {
        if (updatedProperties.has("file"))
            this._analyses = await analyzeFile(this.file);
    }

    _handleBack() {
        this.dispatchEvent(new CustomEvent("close"));
    }

    _renderAnalysisCard(analysis) {
        return html`<div class="analysis-card">
            <h1>${analysis.title}</h1>
            <p>${analysis.render()}</p>
        </div>`;
    }

    _renderFileAnalyses() {
        if (!this._analyses) return html`<p>Error: No file found</p>`;
        return html`<div>${this._analyses.map(this._renderAnalysisCard)}</div>`;
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
