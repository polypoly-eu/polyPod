import { LitElement, html } from "lit";

class FiDownload extends LitElement {
    static get properties() {
        return { pod: {} };
    }

    _openDataDownloadLink() {
        this.pod.polyNav.openUrl("data-download");
    }

    render() {
        return html`<p>
                This is where we will guide the user through the process of
                downloading their data from Facebook.
            </p>
            <button @click=${this._openDataDownloadLink}>
                Download your Facebook data
            </button>`;
    }
}

customElements.define("fi-download", FiDownload);
