import RootAnalysis from "./root-analysis";

export default class ExportTitleAnalysis extends RootAnalysis {
    get title() {
        return "File name";
    }

    async analyze({ name }) {
        this.active = true;
        this._name = name;
    }

    renderSummary() {
        return "" + this._name;
    }
}
