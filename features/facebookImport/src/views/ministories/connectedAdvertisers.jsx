import React from "react";
import ListOfDetails from "../../components/listOfDetails/listOfDetails.jsx";
import Story from "./story.jsx";
import i18n from "../../i18n";
import analysisKeys from "../../model/analyses/utils/analysisKeys";

class ConnectedAdvertisersMinistory extends Story {
    constructor(props) {
        super(props);
        this._neededAnalyses = [analysisKeys.connectedAdvertiserNames];
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
                    {
                        this.analyses[analysisKeys.connectedAdvertiserNames]
                            .length
                    }
                </h2>
                <p>
                    {i18n.t("connectedAdvertisersMiniStory:summary.text.1", {
                        number_companies:
                            this.analyses[analysisKeys.connectedAdvertiserNames]
                                .length,
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
                        number_companies:
                            this.analyses[analysisKeys.connectedAdvertiserNames]
                                .length,
                    })}
                </p>
                <ListOfDetails
                    list={this.analyses[analysisKeys.connectedAdvertiserNames]}
                />
            </div>
        );
    }
}

export default ConnectedAdvertisersMinistory;
