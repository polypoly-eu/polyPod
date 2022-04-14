import React from "react";
import ListOfDetails from "../../components/listOfDetails/listOfDetails";
import Story from "./story";
import i18n from "../../i18n";

class ConnectedAdvertisersMinistory extends Story {
    constructor(props) {
        super(props);
    }
    state = {};
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

export default ConnectedAdvertisersMinistory;
