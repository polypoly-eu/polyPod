import { LitElement, html, css } from "lit";

import "./fi-analysis";
import "./fi-file-management";

class FacebookImport extends LitElement {
    static get styles() {
        return css``;
    }

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
        this._files = {};
    }

    _renderSplash() {
        return html`<p>Loading ...</p>`;
    }

    _handleAddFile(event) {
        const file = event.detail;
        const id = file.time.getTime();
        this._files[id] = { ...file, id };
        this._files = { ...this._files };
    }

    _handleRemoveFile(event) {
        const id = event.detail.id;
        delete this._files[id];
        this._files = { ...this._files };
    }

    render() {
        if (!this._pod) return this._renderSplash();
        const files = Object.values(this._files);
        return html`
            <h1>File management</h1>
            <fi-file-management
                .pod="${this._pod}"
                .files="${files}"
                @add-file="${this._handleAddFile}"
                @remove-file="${this._handleRemoveFile}"
            ></fi-file-management>
            <hr />
            <h1>Analysis</h1>
            <fi-analysis .files="${files}"></fi-analysis>
        `;
    }
}

customElements.define("facebook-import", FacebookImport);
