import { RootAnalysis } from "@polypoly-eu/poly-analysis";

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
