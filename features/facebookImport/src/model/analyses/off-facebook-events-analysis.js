import RootAnalysis from "./root-analysis.js";
import i18n from "../../i18n.js";
import { groupOffFacebookEventsByType } from "./utils/off-facebook-events-utils.js";

import OffFacebookMiniStory from "../../components/offFacebookMinistory/offFacebookMinistory.jsx";

export default class OffFacebookEventsAnalysis extends RootAnalysis {
    get title() {
        return i18n.t("offFacebookEventsMiniStory:title");
    }

    async analyze({ facebookAccount }) {
        console.log(facebookAccount);
        this._companiesCount = facebookAccount.offFacebookCompanies.length;
        try {
            this._eventsCount = facebookAccount.offFacebookEventsCount;
            this.active = this._companiesCount > 0;
            this._purchasesCount = 0;
            if (!this.active) {
                return;
            }

            this._purchasesCount = groupOffFacebookEventsByType(
                facebookAccount
            ).find((e) => e.type == "PURCHASE")?.count;
        } catch (err) {
            console.log(err);
        }
    }

    renderSummary() {
        return (
            <OffFacebookMiniStory
                companiesCount={this._companiesCount}
                purchasesCount={this._purchasesCount}
            />
        );
    }
}
