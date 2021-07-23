import { LitElement, html } from "lit";

class FiFileManagement extends LitElement {
    static get properties() {
        return {
            pod: {},
            files: {},
        };
    }

    async _importFile() {
        const file = await this.pod.polyNav.pickFile();
        if (!file) return;

        this.dispatchEvent(
            new CustomEvent("add-file", {
                detail: { time: new Date(), data: file },
            })
        );
    }

    _removeFile(id) {
        this.dispatchEvent(
            new CustomEvent("remove-file", {
                detail: { id },
            })
        );
    }

    _renderFileList() {
        return html`<h2>Loaded files</h2>
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
                        </li>`
                )}
            </ul>`;
    }

    render() {
        return html`
            <p>
                This is where the user can add previously downloaded Facebook
                data exports, and manage the ones they had already imported.
            </p>
            <button @click="${this._importFile}">Import file</button>
            <hr />
            ${Object.values(this.files).length
                ? this._renderFileList()
                : html`<em>No files imported</em>`}
        `;
    }
}

customElements.define("fi-file-management", FiFileManagement);
