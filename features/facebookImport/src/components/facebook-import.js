import { LitElement, html } from "lit";

import Storage from "../model/storage.js";
import "./explore-view";
import "./import-view";
import "./overview-view";

class FacebookImport extends LitElement {
    static get properties() {
        return {
            _pod: { state: true },
            _currentView: { state: true },
            _files: { state: true },
        };
    }

    async _initPod() {
        return await window.pod;
    }

    constructor() {
        super();
        let podInitializer = this._initPod();
        podInitializer.then(async (pod) => {
            this._pod = pod;
            await this._storage.refreshFiles();
            this._storage.changeListener();
        });
        this._storage = new Storage(podInitializer);
        this._files = [];
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

    _handleClose() {
        this._currentView = null;
    }

    _renderImport() {
        return html`<import-view
            .pod="${this._pod}"
            @add-file="${this._handleAddFile}"
            @close="${this._handleClose}"
        ></import-view>`;
    }

    _renderExplore() {
        return html`<explore-view
            .file="${this._selectedFile}"
            @close="${this._handleClose}"
        ></explore-view>`;
    }

    _handleImportFile() {
        this._currentView = "import";
    }

    _handleRemoveFile(event) {
        this._storage.removeFile(event.detail);
    }

    _handleExploreFile(event) {
        const id = event.detail.id;
        this._selectedFile = this._files.find((file) => file.id === id);
        this._currentView = "explore";
    }

    _renderOverview() {
        return html` <overview-view
            .pod="${this._pod}"
            .files="${this._files}"
            @import-file="${this._handleImportFile}"
            @remove-file="${this._handleRemoveFile}"
            @explore-file="${this._handleExploreFile}"
        ></overview-view>`;
    }

    render() {
        if (!this._pod) return this._renderSplash();
        if (this._currentView === "import") return this._renderImport();
        if (this._currentView === "explore") return this._renderExplore();
        return this._renderOverview();
    }
}

customElements.define("facebook-import", FacebookImport);
