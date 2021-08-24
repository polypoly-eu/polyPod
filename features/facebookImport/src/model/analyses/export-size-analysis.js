import RootAnalysis from "./root-analysis";

export default class ExportSizeAnalysis extends RootAnalysis {
    get title() {
        return "File size";
    }

    analyze({ size }) {
        this.active = true;
        this._size = size;
    }

    render() {
        return "" + this._size;
    }
}
