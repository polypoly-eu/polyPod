import { RootAnalysis } from "@polypoly-eu/poly-analysis";

export default class SearchesAnalysis extends RootAnalysis {
    get title() {
        return "Search History";
    }

    async analyze({ dataAccount }) {
        this._searchesCount = dataAccount.searches.length;
        this.active = this._searchesCount > 0;
    }

    renderSummary() {
        return `There are ${this._searchesCount} words, phrases and names you've searched for`;
    }
}
