import React, { useState } from "react";
import { FilterChips, LineLegend, PolyChart } from "@polypoly-eu/poly-look";
import i18n from "../../i18n";

import "./messengerMauChart.css";

const facebookColor = "#3749A9";
const otherColor = "#3BA6FF";

const otherColorSet = { color: otherColor, gradient: "other-gradient" };
const facebookColorSet = {
    color: facebookColor,
    gradient: "facebook-gradient",
};

const gradients = [
    {
        id: "facebook-gradient",
        type: "linearGradient",
        stops: [
            { offset: "0%", color: facebookColor, opacity: 0.1 },
            { offset: "100%", color: facebookColor, opacity: 0.5 },
        ],
    },
    {
        id: "other-gradient",
        type: "linearGradient",
        stops: [
            { offset: "0%", color: otherColor, opacity: 0.1 },
            { offset: "100%", color: otherColor, opacity: 0.5 },
        ],
    },
];

const MessengerMauChart = ({ messengers, i18nHeader }) => {
    const [selectedMessenger, setSelectedMessenger] = useState(null);
    const lineChartData = messengers.map((messenger) => ({
        id: messenger.ppid,
        dataPoints: messenger.activeUsers.values
            .map((value) => ({
                value: value.user_count / 1000000,
                date: value.end_date,
                id: messenger.ppid,
            }))
            .filter((d) => d.value > 0)
            .sort((a, b) => new Date(a.date) - new Date(b.date)),
    }));

    const messengerIds = messengers.map((m) => m.ppid);

    const coloring = Object.fromEntries(
        messengers.map((messenger) => [
            messenger.ppid,
            messenger.productOwner.some((e) => e.includes("Facebook"))
                ? facebookColorSet
                : otherColorSet,
        ])
    );

    const lineColor = (d) => coloring[d[0].id].color;
    const areaColor = (d) =>
        d[0].id === selectedMessenger
            ? `url(#${coloring[d[0].id].gradient})`
            : "rgba(0, 0, 0, 0)";

    return (
        <div className="messenger-mau-chart">
            <h4 className="legend">
                {i18n.t(`${i18nHeader}:details.monthly.active.users`)}
            </h4>
            <LineLegend
                legend={[
                    {
                        description: i18n.t(
                            `${i18nHeader}:details.owned.by.fb`
                        ),
                        color: facebookColor,
                    },
                    {
                        description: i18n.t(
                            `${i18nHeader}:details.owned.by.others`
                        ),
                        color: otherColor,
                    },
                ]}
            />
            <p className="unit">MAU</p>
            <PolyChart
                type="time-line-chart"
                data={lineChartData}
                lineColor={lineColor}
                areaColor={areaColor}
                gradients={gradients}
            />
            <FilterChips
                chipsContent={messengerIds}
                onChipClick={setSelectedMessenger}
            />
        </div>
    );
};

export default MessengerMauChart;
