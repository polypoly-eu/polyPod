import { RootAnalysis } from "@polypoly-eu/poly-analysis";

/**
 * It's a simple analysis that displays the size of the exported file.
 * @class ExportSizeAnalysis
 */
export default class ExportSizeAnalysis extends RootAnalysis {
    get title() {
        return "File size";
    }

    async analyze({ size }) {
        this.active = true;
        this._size = size;
    }

    renderSummary() {
        return "" + this._size;
    }
}
