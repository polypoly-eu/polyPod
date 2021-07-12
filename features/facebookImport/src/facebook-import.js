import { LitElement, html, css } from "lit";
import * as zip from "@zip.js/zip.js";

const hexdump = (data) =>
    [...data].map((i) => i.toString(16).padStart(2, "0")).join(" ");

class FacebookImport extends LitElement {
    static get styles() {
        return css`
            table {
                margin-top: 10px;
            }

            th {
                padding-right: 10px;
            }

            .code {
                font-family: monospace;
            }
        `;
    }

    static get properties() {
        return {
            _pod: { state: true },
            _data: { state: true },
        };
    }

    async _initPod() {
        return await window.pod;
    }

    constructor() {
        super();
        this._initPod().then((pod) => (this._pod = pod));
    }

    _renderSplash() {
        return html`<p>Loading ...</p>`;
    }

    async _loadFile() {
        const file = await this._pod.polyNav.pickFile();
        if (!file) {
            this._data = null;
            return;
        }

        const reader = new zip.ZipReader(new zip.Uint8ArrayReader(file));
        const entries = await reader.getEntries();
        this._data = {
            fileSize: file.length,
            hex: hexdump(file),
            entries,
        };
    }

    _renderImporter() {
        return html` <button @click="${this._loadFile}">Load file</button> `;
    }

    _renderAnalysis() {
        if (!this._data) return "";
        return html`
            <table>
                <tr>
                    <th>Size</th>
                    <td>${this._data.fileSize}</td>
                </tr>
                <tr>
                    <th>Data</th>
                    <td class="code">${this._data.hex}</td>
                </tr>
                <tr>
                    <th>List</th>
                    <td>
                        ${this._data.entries
                            .map((entry) => entry.filename)
                            .join("\n")}
                    </td>
                </tr>
            </table>
        `;
    }

    render() {
        if (!this._pod) return this._renderSplash();
        return html` ${this._renderImporter()} ${this._renderAnalysis()} `;
    }
}

customElements.define("facebook-import", FacebookImport);
