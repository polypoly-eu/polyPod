import RootAnalysis from "./root-analysis.js";

export default class FollowedPagesAnalysis extends RootAnalysis {
    get title() {
        return "Followed Pages";
    }

    async analyze({ facebookAccount }) {
        this._followedPagesCount = facebookAccount._followedPages.length;
        this.active = this._followedPagesCount > 0;
    }

    render() {
        if (!this.active) {
            return "No Followed Pages!";
        }
        return `You followed ${this._followedPagesCount} ${
            this._followedPagesCount === 1 ? "page" : "pages"
        }.`;
    }
}
