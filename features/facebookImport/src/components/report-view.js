import { LitElement, html, css } from "lit";

class ReportView extends LitElement {
    static get properties() {
        return {
            pod: {},
            unrecognizedData: {},
        };
    }

    static get styles() {
        return css`
            button,
            code {
                display: block;
                margin: 8px;
            }

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
        `;
    }

    async _handleSendReport() {
        console.log("TODO");
    }

    _handleBack() {
        this.dispatchEvent(new CustomEvent("close"));
    }

    _renderReportCard(analysis) {
        return html`<div class="analysis-card">
            <h1>${analysis.title}</h1>
            <p>${analysis.render()}</p>
        </div>`;
    }

    _renderReportAnalyses() {
        if (!this.unrecognizedData) {
            return "";
        }
        return html`<div>
            ${this.unrecognizedData.reportAnalyses.map(this._renderReportCard)}
        </div>`;
    }

    render() {
        return html`<h1>Unrecognized data report</h1>
            <button @click=${this._handleBack}>Back</button>
            ${this._renderReportAnalyses()}
            <button @click=${this._handleSendReport}>Send report</button>`;
    }
}

customElements.define("report-view", ReportView);
