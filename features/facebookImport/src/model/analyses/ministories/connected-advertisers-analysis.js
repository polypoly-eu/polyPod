import React from "react";

import i18n from "../../../i18n.js";
import RootAnalysis from "./root-analysis.js";

import ListOfDetails from "../../../components/listOfDetails/listOfDetails.jsx";

export default class ConnectedAdvertisersAnalysis extends RootAnalysis {
    get title() {
        return i18n.t("connectedAdvertisersMiniStory:title");
    }

    get label() {
        return RootAnalysis.Labels.NONE;
    }

    async analyze({ facebookAccount }) {
        this._connectedAdvertisersCount =
            facebookAccount.connectedAdvertisers.length;
        this._connectedAdvertisers = facebookAccount.connectedAdvertisers;
        this.active = this._connectedAdvertisersCount > 0;
    }

    renderSummary() {
        return (
            <div className="connected-advertisers-ministory-summary">
                <h2
                    style={{
                        fontSize: "60px",
                        fontFamily: "Jost Bold",
                    }}
                >
                    {this._connectedAdvertisersCount}
                </h2>
                <p>
                    {i18n.t("connectedAdvertisersMiniStory:summary.text.1", {
                        number_companies: this._connectedAdvertisersCount,
                    })}
                </p>
                <p>{i18n.t("connectedAdvertisersMiniStory:summary.text.2")}</p>
                <p className="source">
                    {i18n.t("common:source.your.facebook.data")}
                </p>
            </div>
        );
    }

    renderDetails() {
        return (
            <div
                style={{
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                }}
                className="connected-advertisers-ministory-summary"
            >
                <p>
                    {i18n.t("connectedAdvertisersMiniStory:details.text", {
                        number_companies: this._connectedAdvertisersCount,
                    })}
                </p>
                <ListOfDetails list={this._connectedAdvertisers} />
            </div>
        );
    }
}
