import React from "react";

import i18n from "../../../i18n.js";
import { RootAnalysis } from "@polypoly-eu/poly-analysis";

import ListOfDetails from "../../../components/listOfDetails/listOfDetails.jsx";

export default class ConnectedAdvertisersAnalysis extends RootAnalysis {
    get title() {
        return i18n.t("connectedAdvertisersMiniStory:title");
    }

    get label() {
        return RootAnalysis.Labels.NONE;
    }

    async analyze({ dataAccount }) {
        this._connectedAdvertisersCount =
            dataAccount.connectedAdvertisers.length;
        this._connectedAdvertiserNames =
            dataAccount.connectedAdvertisers.map(
                (connectedAdvertiser) => connectedAdvertiser.name
            );
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
                <ListOfDetails list={this._connectedAdvertiserNames} />
            </div>
        );
    }
}
