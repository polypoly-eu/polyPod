import RootAnalysis from "./root-analysis";

export default class ExportTitleAnalysis extends RootAnalysis {
    get title() {
        return "File name";
    }

    analyze({ name }) {
        this.active = true;
        this._name = name;
    }

    render() {
        return "" + this._name;
    }
}
