import DataEntitiesCountAnalysis from "./data-count.js";

class FollowedPagesAnalysis extends DataEntitiesCountAnalysis {
    constructor() {
        super("pages/pages_you_follow.json", "pages_followed_v2");
    }
    get title() {
        return "Pages you've followed";
    }

    render() {
        if (!this.active) {
            return "No Followed Pages!";
        }
        return `You followed ${this.dataEntitiesCount} ${
            this.dataEntitiesCount === 1 ? "page" : "pages"
        }.`;
    }
}

export default FollowedPagesAnalysis;
