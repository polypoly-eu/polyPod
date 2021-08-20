import DataEntitiesCountAnalysis from "./data-count.js";

class AdInterestsAnalysis extends DataEntitiesCountAnalysis {
    constructor() {
        super("other_logged_information/ads_interests.json", "topics_v2");
    }
    get title() {
        return "Ads Interests";
    }

    render() {
        if (!this.active) {
            return "No Ad Interests!";
        }
        return `There are ${this.dataEntitiesCount} interests infered based on your Facebook activity and other actions that help Facebook show you relevant ads`;
    }
}

export default AdInterestsAnalysis;
