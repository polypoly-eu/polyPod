import RootAnalysis from "./root-analysis.js";

export default class RecommendedPagesAnalysis extends RootAnalysis {
    get title() {
        return "Pages you've recommended";
    }

    async parse({ facebookAccount }) {
        this._recommendedPagesCount = facebookAccount.recommendedPages.length;
        this.active = this._recommendedPagesCount > 0;
    }

    render() {
        if (!this.active) {
            return "No Recommended Pages!";
        }
        return `You recommended ${this._recommendedPagesCount} ${
            this._recommendedPagesCount === 1 ? "page" : "pages"
        }.`;
    }
}
