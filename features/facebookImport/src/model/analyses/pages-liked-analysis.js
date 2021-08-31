import RootAnalysis from "./root-analysis.js";

export default class LikedPagesAnalysis extends RootAnalysis {
    get title() {
        return "Liked Pages";
    }

    async analyze({ facebookAccount }) {
        this._likedPagesCount = facebookAccount.likedPages.length;
        this.active = this._likedPagesCount > 0;
    }

    render() {
        if (!this.active) {
            return "No Liked Pages!";
        }
        return `You liked ${this._likedPagesCount} pages.`;
    }
}
