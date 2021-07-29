import { LitElement, html } from "lit";

class OverviewView extends LitElement {
    static get properties() {
        return {
            pod: {},
            files: {},
        };
    }

    _importFile() {
        this.dispatchEvent(new CustomEvent("import-file"));
    }

    _removeFile(id) {
        this.dispatchEvent(
            new CustomEvent("remove-file", {
                detail: { id },
            })
        );
    }

    _exploreFile(id) {
        this.dispatchEvent(
            new CustomEvent("explore-file", {
                detail: { id },
            })
        );
    }

    _renderFileList() {
        return html`<h2>Imported files</h2>
            <ul>
                ${Object.values(this.files).map(
                    (file) =>
                        html`<li>
                            <span>
                                ID: ${file.id}. Imported: ${file.time}. Size:
                                ${file.data.length} bytes
                            </span>
                            <button @click="${() => this._removeFile(file.id)}">
                                Remove
                            </button>
                            <button
                                @click="${() => this._exploreFile(file.id)}"
                            >
                                Explore
                            </button>
                        </li>`
                )}
            </ul>`;
    }

    render() {
        return html`
            <h1>File overview</h1>
            <button @click="${this._importFile}">Import (another) file</button>
            ${Object.values(this.files).length
                ? this._renderFileList()
                : html`<em>No files imported</em>`}
        `;
    }
}

customElements.define("overview-view", OverviewView);
