import DataEntitiesCountAnalysis from "./data-count.js";

class LikedPagesAnalysis extends DataEntitiesCountAnalysis {
    constructor() {
        super("pages/pages_you've_liked.json", "page_likes_v2");
    }
    get title() {
        return "Pages you've liked";
    }

    render() {
        if (!this.active) {
            return "No Liked Pages!";
        }
        return `You liked ${this.dataEntitiesCount} pages.`;
    }
}

export default LikedPagesAnalysis;
