import { readJSONDataArray } from "./../analysis-util.js";

class InteractedWithAdvertisersAnalysis {
    get title() {
        return "Advertisers You've Interacted With";
    }

    get id() {
        return "interacted-advertisers";
    }

    get dataEntitiesCount() {
        return this._advertisersCount;
    }

    async parse({ zipFile }) {
        this._advertisersCount = 0;
        this.active = false;
        if (!zipFile) return;

        const advertisersData = await readJSONDataArray(
            "ads_information/advertisers_you've_interacted_with.json",
            "history_v2",
            zipFile
        );
        if (!(advertisersData.status === "ok")) {
            return;
        }

        this._advertisersCount = advertisersData.data.length;
        this.active = this._advertisersCount > 0;
    }

    render() {
        if (!this.active) {
            return "No Interacted with Advertisers!";
        }
        return `There are ${this._advertisersCount} advertisers whose ads you've clicked on Facebook`;
    }
}

export default InteractedWithAdvertisersAnalysis;
