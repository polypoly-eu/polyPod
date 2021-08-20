import DataEntitiesCountAnalysis from "./data-count.js";

class ConnectedAdvertisersAnalysis extends DataEntitiesCountAnalysis {
    constructor() {
        super(
            "ads_information/advertisers_who_uploaded_a_contact_list_with_your_information.json",
            "custom_audiences_v2"
        );
    }
    get title() {
        return "Advertisers Who Uploaded a Contact List With Your Information";
    }

    render() {
        if (!this.active) {
            return "No Connected Advertisers!";
        }
        return `There are ${this.dataEntitiesCount} advertisers who run
                ads using a contact list they uploaded that includes contact
                info you shared with them or with one of their data partners`;
    }
}

export default ConnectedAdvertisersAnalysis;
