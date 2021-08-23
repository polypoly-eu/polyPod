import React from "react";
import ConnectedAdvertisersAnalysis from "./connected-advertisers.js";
import InteractedWithAdvertisersAnalysis from "./interacted-advertisers.js";
import AdInterestsAnalysis from "./ad-interests.js";
import OffFacebookEventsAnalysis from "./off-facebook-events.js";
import MessagesAnalysis from "./messages.js";

import DataBubblesAll from "../../components/dataViz/dataBubblesAll.jsx";
import BarChart from "../../components/dataViz/barChart.jsx";

class DataBubblesAnalysis {
    get title() {
        return "Data Bubbles";
    }

    get id() {
        return "data-bubbles";
    }

    async parse({ id, zipFile }) {
        this._advertisersCount = {};
        this.active = false;
        if (!zipFile) return;

        const analysisClasses = [
            ConnectedAdvertisersAnalysis,
            InteractedWithAdvertisersAnalysis,
            AdInterestsAnalysis,
            OffFacebookEventsAnalysis,
            MessagesAnalysis,
        ];

        const parsedAnalyses = await Promise.all(
            analysisClasses.map(async (subAnalysisClass) => {
                const subAnalysis = new subAnalysisClass();
                await subAnalysis.parse({ id, zipFile });
                const title = subAnalysis.constructor.name.replace(
                    "Analysis",
                    ""
                );
                return {
                    analysis: subAnalysis,
                    title,
                };
            })
        );

        this._bubblesData = parsedAnalyses
            .map(({ analysis, title }) => {
                return { count: analysis.dataEntitiesCount, title: title };
            })
            .filter(({ count }) => count > 0);

        this.active = true;
    }

    render() {
        if (!this.active) {
            return "No Data!";
        }
        return (
            <>
                <DataBubblesAll
                    data={this._bubblesData}
                    width={400}
                    height={400}
                    bubbleColor="#fef230"
                    textColor="black"
                />
                <BarChart data={this._bubblesData} />
            </>
        );
    }
}

export default DataBubblesAnalysis;
