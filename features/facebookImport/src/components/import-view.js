import { LitElement, html, css } from "lit";

class ImportView extends LitElement {
    static get properties() {
        return { pod: {} };
    }

    static get styles() {
        return css`
            button {
                display: block;
                margin-bottom: 16px;
            }
        `;
    }

    _handleDownload() {
        this.pod.polyNav.openUrl("data-download");
    }

    async _handleImport() {
        const importResult = await this.pod.polyNav.importFile("facebook-data.zip");
        if (!importResult) return;

        this.dispatchEvent(
            new CustomEvent("add-file", {
                detail: { time: new Date() },
            })
        );
        this._handleBack();
    }

    _handleBack() {
        this.dispatchEvent(new CustomEvent("close"));
    }

    render() {
        return html`<h1>File import</h1>
            <button @click=${this._handleDownload}>
                Step 1: Download your Facebook data archive
            </button>
            <button @click=${this._handleImport}>
                Step 2: Import your Facebook data archive
            </button>
            <button @click=${this._handleBack}>Back</button>`;
    }
}

customElements.define("import-view", ImportView);
