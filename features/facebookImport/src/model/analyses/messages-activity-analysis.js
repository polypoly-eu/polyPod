import React from "react";
import RootAnalysis from "./root-analysis";
import BarChart from "../../components/dataViz/barChart.jsx";

export default class MessagesActivityAnalysis extends RootAnalysis {
    get title() {
        return "Messages Activity";
    }

    async analyze({ facebookAccount }) {
        this.active = facebookAccount.messagesCount > 0;

        if (!this.active) {
            return;
        }

        const messagesCountByHour = [];

        for (let index = 0; index <= 23; index++) {
            messagesCountByHour[index] = 0;
        }

        facebookAccount.forEachMessage((message) => {
            if (message?.timestamp_ms) {
                const creationDate = new Date(message.timestamp_ms);
                const hour = creationDate.getHours();
                messagesCountByHour[hour]++;
            }
        });

        this._messageByHourData = messagesCountByHour.map((count, index) => {
            return { title: index + "h", count };
        });
    }

    renderSummary() {
        return (
            <>
                Sent and received messages grouped by the hour of the day:
                <BarChart data={this._messageByHourData} shouldSort={false} />
            </>
        );
    }
}
