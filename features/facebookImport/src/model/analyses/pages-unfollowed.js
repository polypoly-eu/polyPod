import DataEntitiesCountAnalysis from "./data-count.js";

class UnfollowedPagesAnalysis extends DataEntitiesCountAnalysis {
    constructor() {
        super("pages/pages_you've_unfollowed.json", "pages_unfollowed_v2");
    }
    get title() {
        return "Pages you've unfollowed";
    }

    render() {
        if (!this.active) {
            return "No Unfollowed Pages!";
        }
        return `You unfollowed ${this.dataEntitiesCount} ${
            this.dataEntitiesCount === 1 ? "page" : "pages"
        }.`;
    }
}

export default UnfollowedPagesAnalysis;
