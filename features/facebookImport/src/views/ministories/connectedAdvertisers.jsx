import React from "react";
import ListOfDetails from "../../components/listOfDetails/listOfDetails.jsx";
import i18n from "../../i18n";
import analysisKeys from "../../model/analyses/utils/analysisKeys";
import { SingleDataStory } from "./singleDataStory.jsx";

class ConnectedAdvertisersMinistory extends SingleDataStory {
    constructor(props) {
        super(props, analysisKeys.connectedAdvertiserNames);
    }
    get title() {
        return i18n.t("connectedAdvertisersMiniStory:title");
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
                    {this.analysisData.length}
                </h2>
                <p>
                    {i18n.t("connectedAdvertisersMiniStory:summary.text.1", {
                        number_companies: this.analysisData.length,
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
                        number_companies: this.analysisData.length,
                    })}
                </p>
                <ListOfDetails list={this.analysisData} />
            </div>
        );
    }
}

export default ConnectedAdvertisersMinistory;
