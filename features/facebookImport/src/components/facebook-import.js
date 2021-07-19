import { LitElement, html } from "lit";

import Storage from "../model/storage.js";
import "./fi-analysis";
import "./fi-download";
import "./fi-file-management";

class FacebookImport extends LitElement {
    static get properties() {
        return {
            _pod: { state: true },
            _files: { state: true },
        };
    }

    async _initPod() {
        return await window.pod;
    }

    constructor() {
        super();
        this._initPod().then((pod) => (this._pod = pod));
        this._files = [];
        this._storage = new Storage();
        this._storage.changeListener = () => {
            this._files = Object.values(this._storage.files);
        };
    }

    _renderSplash() {
        return html`<p>Loading ...</p>`;
    }

    _handleAddFile(event) {
        this._storage.addFile(event.detail);
    }

    _handleRemoveFile(event) {
        this._storage.removeFile(event.detail);
    }

    render() {
        if (!this._pod) return this._renderSplash();
        return html`
            <h1>Download</h1>
            <fi-download .pod="${this._pod}"></fi-download>
            <hr />
            <h1>File management</h1>
            <fi-file-management
                .pod="${this._pod}"
                .files="${this._files}"
                @add-file="${this._handleAddFile}"
                @remove-file="${this._handleRemoveFile}"
            ></fi-file-management>
            <hr />
            <h1>Analysis</h1>
            <fi-analysis .files="${this._files}"></fi-analysis>
        `;
    }
}

customElements.define("facebook-import", FacebookImport);
