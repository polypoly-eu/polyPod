import React from "react";
import { RootAnalysis } from "@polypoly-eu/poly-analysis";
import BarChart from "../../../components/dataViz/barChart.jsx";

export default class MessagesActivityAnalysis extends RootAnalysis {
    get title() {
        return "Messages Activity";
    }

    async analyze({ dataAccount }) {
        this.active = dataAccount.messagesCount > 0;

        if (!this.active) {
            return;
        }

        const messagesCountByHour = [];

        for (let index = 0; index <= 23; index++) {
            messagesCountByHour[index] = 0;
        }
        dataAccount.forEachMessageThread((messageThread) => {
            messageThread.forEachMessageTimestamp((messageTimestamp_ms) => {
                const creationDate = new Date(messageTimestamp_ms);
                const hour = creationDate.getHours();
                messagesCountByHour[hour]++;
            });
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
