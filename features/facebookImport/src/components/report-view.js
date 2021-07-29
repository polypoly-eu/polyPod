import { LitElement, html, css } from "lit";

class ReportView extends LitElement {
    static get properties() {
        return {
            pod: {},
            report: {},
        };
    }

    static get styles() {
        return css`
            button,
            code {
                display: block;
                margin: 8px;
            }
        `;
    }

    async _handleSendReport() {
        console.log("TODO");
    }

    _handleBack() {
        this.dispatchEvent(new CustomEvent("close"));
    }

    render() {
        return html`<h1>Unregognized data report</h1>
            <button @click=${this._handleBack}>Back</button>
            <code>${this.report}</code>
            <button @click=${this._handleSendReport}>Send report</button>`;
    }
}

customElements.define("report-view", ReportView);
