import RootAnalysis from "./root-analysis.js";

export default class UnfollowedPagesAnalysis extends RootAnalysis {
    get title() {
        return "Pages you've unfollowed";
    }

    async analyze({ facebookAccount }) {
        this._unfollowedPagesCount = facebookAccount.unfollowedPages.length;
        this.active = this._unfollowedPagesCount > 0;
    }

    render() {
        if (!this.active) {
            return "No Unfollowed Pages!";
        }
        return `You unfollowed ${this._unfollowedPagesCount} ${
            this._unfollowedPagesCount === 1 ? "page" : "pages"
        }.`;
    }
}
