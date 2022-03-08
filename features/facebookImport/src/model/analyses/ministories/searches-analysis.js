import RootAnalysis from "./root-analysis.js";

export default class SearchesAnalysis extends RootAnalysis {
    get title() {
        return "Search History";
    }

    async analyze({ facebookAccount }) {
        this._searchesCount = facebookAccount.searches.length;
        this.active = this._searchesCount > 0;
    }

    renderSummary() {
        return `There are ${this._searchesCount} words, phrases and names you've searched for`;
    }
}
