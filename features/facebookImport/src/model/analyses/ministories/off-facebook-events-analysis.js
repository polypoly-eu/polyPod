import React from "react";

import RootAnalysis from "./root-analysis.js";
import i18n from "../../../i18n.js";

import OffFacebookMiniStory from "../../../components/offFacebookMiniStory/offFacebookMiniStory.jsx";

export default class OffFacebookEventsAnalysis extends RootAnalysis {
    get label() {
        return RootAnalysis.Labels.NONE;
    }

    get title() {
        return i18n.t("offFacebookEventsMiniStory:title");
    }

    async analyze({ facebookAccount }) {
        this._companiesCount = facebookAccount.offFacebookCompanies.length;
        this.active = this._companiesCount > 0;
        this._purchasesCount = facebookAccount.offFacebookCompanies.filter(
            (company) =>
                company.events.find((event) => event.type == "PURCHASE")
        ).length;
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
