import React, { useState } from "react";
import { PolyChart } from "@polypoly-eu/poly-look";

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
            { offset: "0%", color: facebookColor, opacity: 0.2 },
            { offset: "100%", color: facebookColor, opacity: 1 },
        ],
    },
    {
        id: "other-gradient",
        type: "linearGradient",
        stops: [
            { offset: "0%", color: otherColor, opacity: 0.2 },
            { offset: "100%", color: otherColor, opacity: 1 },
        ],
    },
];

const coloring = {
    Signal: otherColorSet,
    Instagram: facebookColorSet,
    WhatsApp: facebookColorSet,
    Threema: otherColorSet,
    Snapchat: otherColorSet,
    "Facebook Messenger": facebookColorSet,
    Telegram: otherColorSet,
    TikTok: otherColorSet,
    iMessage: otherColorSet,
};

const MauLineChart = ({ messengers }) => {
    const [selectedMessenger, setSelectedMessenger] = useState("Signal");
    const lineChartData = messengers.map((messenger) => ({
        id: messenger.ppid,
        dataPoints: messenger.activeUsers.values.map((value) => ({
            value: value.user_count / 1000000,
            date: value.end_date,
            id: messenger.ppid,
        })),
    }));
    const lineColor = (d) => coloring[d[0].id].color;
    const areaColor = (d) =>
        d[0].id === selectedMessenger
            ? `url(#${coloring[d[0].id].gradient})`
            : "rgba(0, 0, 0, 0)";

    return (
        <div className="mau-line-chart">
            <PolyChart
                type="time-line-chart"
                data={lineChartData}
                lineColor={lineColor}
                areaColor={areaColor}
                gradients={gradients}
            />
        </div>
    );
};

export default MauLineChart;
