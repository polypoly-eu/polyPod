import DataEntitiesCountAnalysis from "./data-count.js";

class RecommendedPagesAnalysis extends DataEntitiesCountAnalysis {
    constructor() {
        super("pages/pages_you've_recommended.json", "recommended_pages_v2");
    }
    get title() {
        return "Pages you've recommended";
    }

    render() {
        if (!this.active) {
            return "No Recommended Pages!";
        }
        return `You recommended ${this.dataEntitiesCount} ${
            this.dataEntitiesCount === 1 ? "page" : "pages"
        }.`;
    }
}

export default RecommendedPagesAnalysis;
