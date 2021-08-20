import { readJSONDataArray } from "./../analysis-util.js";

class OffFacebookEventsAnalysis {
    get title() {
        return "Your Off-Facebook Activity";
    }

    get id() {
        return "off-Facebook-events";
    }

    get dataEntitiesCount() {
        return this._eventsCount;
    }

    async parse({ zipFile }) {
        this._eventsCount = 0;
        this._companiesCount = 0;
        this.active = false;
        if (!zipFile) return;

        const eventsData = await readJSONDataArray(
            "apps_and_websites_off_of_facebook/your_off-facebook_activity.json",
            "off_facebook_activity_v2",
            zipFile
        );
        if (!(eventsData.status === "ok")) {
            return;
        }
        const events = eventsData.data;

        this._companiesCount = events.length;
        this._eventsCount = events.reduce((total, companyData) => {
            if (companyData?.events) {
                return total + companyData.events.length;
            }
            return total;
        }, 0);
        this.active = this._companiesCount > 0;
    }

    render() {
        if (!this.active) {
            return "No off-facebook events detected in your export!";
        }
        return `There are ${this._eventsCount} events from ${this._companiesCount} businesses and organizations you visit off of Facebook`;
    }
}

export default OffFacebookEventsAnalysis;
