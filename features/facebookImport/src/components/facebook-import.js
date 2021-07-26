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
        let podInitializer = this._initPod();
        podInitializer.then((pod) => (this._pod = pod));
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

    _handleRemoveFile(event) {
        this._storage.removeFile(event.detail);
    }

    render() {
        if (!this._pod) return this._renderSplash();
        return html`
            <poly-tabs theme="dark">
                <poly-tab tabId="download" label="Download" active>
                    <poly-tab-content></poly-tab-content>
                </poly-tab>
                <poly-tab tabId="file-management" label="File management">
                    <poly-tab-content></poly-tab-content>
                </poly-tab>
                <poly-tab tabId="analysis" label="Analysis">
                    <poly-tab-content></poly-tab-content>
                </poly-tab>
            </poly-tabs>

            <div class="tab-content" style="display: none">
                <fi-download .pod="${this._pod}"></fi-download>

                <fi-file-management
                    .pod="${this._pod}"
                    .files="${this._files}"
                    @add-file="${this._handleAddFile}"
                    @remove-file="${this._handleRemoveFile}"
                ></fi-file-management>

                <fi-analysis .files="${this._files}"></fi-analysis>
            </div>
        `;
    }

    updated() {
        // This is quite a bit of a hack - at the moment, <poly-tab-content>
        // elements don't support nested LitElement-derived web components,
        // hence this questionable workaround:
        setTimeout(() => {
            const tabIds = [
                ...this.shadowRoot.querySelectorAll(".tab-content>*"),
            ].map((element) =>
                element.nodeName.toLowerCase().replace(/^fi-/, "")
            );
            const polyTabs = this.shadowRoot.querySelector("poly-tabs");
            for (let tabId of tabIds) {
                const polyTabContent = polyTabs.shadowRoot.querySelector(
                    `poly-tab-content[tabId=${tabId}`
                );
                const tabTarget = polyTabContent.shadowRoot.querySelector(
                    `#poly-${tabId}`
                );
                const tabSource = this.shadowRoot.querySelector(`fi-${tabId}`);
                tabTarget.appendChild(tabSource);
            }
        }, 0);
    }
}

customElements.define("facebook-import", FacebookImport);
