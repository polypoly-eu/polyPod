import { LitElement, html } from "lit";

import Storage from "../model/storage.js";
import "./fi-analysis";
import "./fi-download";
import "./fi-file-management";

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

    _handleImportFile() {
        this._currentView = "download";
    }

    _handleRemoveFile(event) {
        this._storage.removeFile(event.detail);
    }

    _handleExploreFile(event) {
        const id = event.detail.id;
        this._selectedFile = this._files.find((file) => file.id === id);
        this._currentView = "analysis";
    }

    _renderFileManagement() {
        return html` <fi-file-management
            .pod="${this._pod}"
            .files="${this._files}"
            @import-file="${this._handleImportFile}"
            @remove-file="${this._handleRemoveFile}"
            @explore-file="${this._handleExploreFile}"
        ></fi-file-management>`;
    }

    _handleAddFile(event) {
        this._storage.addFile(event.detail);
    }

    _handleClose() {
        this._currentView = null;
    }

    _renderDownload() {
        return html`<fi-download
            .pod="${this._pod}"
            @add-file="${this._handleAddFile}"
            @close="${this._handleClose}"
        ></fi-download>`;
    }

    _renderAnalysis() {
        return html`<fi-analysis
            .file="${this._selectedFile}"
            @close="${this._handleClose}"
        ></fi-analysis>`;
    }

    render() {
        if (!this._pod) return this._renderSplash();
        if (this._currentView === "download") return this._renderDownload();
        if (this._currentView === "analysis") return this._renderAnalysis();
        return this._renderFileManagement();
    }
}

customElements.define("facebook-import", FacebookImport);
