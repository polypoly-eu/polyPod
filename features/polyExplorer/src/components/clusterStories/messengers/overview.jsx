import React, { useState, useEffect, useRef } from "react";
import i18n from "../../../i18n";
import DonutChart from "../../dataViz/donutChar.jsx";

import "./overview.css";

const i18nHeader = "clusterMessengerStory";

const Overview = ({ donutData, heightEvent }) => {
    const wholeOverview = useRef();
    const chartSize = 730;
    const messageInstalls = "overview.donut.installs.message";
    const messageUsers = "overview.donut.users.message";
    const typeDonutsChar = {
        donutInstalls: "donutInstalls",
        donutUsers: "donutUsers",
        donutPartOf: "donutPartOf",
    };

    const [currentDonutData, updateCurrentDataDonut] = useState(
        donutData.installs
    );
    const [currentDonutMessage, updateCurrentDonutMessage] = useState(
        messageInstalls
    );

    function _changeDonutData(donutType) {
        switch (donutType) {
            case typeDonutsChar.donutInstalls:
                updateCurrentDataDonut(donutData.installs);
                updateCurrentDonutMessage(messageInstalls);
                break;
            case typeDonutsChar.donutUsers:
                updateCurrentDataDonut(donutData.users);
                updateCurrentDonutMessage(messageUsers);
                break;
            case typeDonutsChar.donutPartOf:
                updateCurrentDataDonut(donutData.partOF);
                updateCurrentDonutMessage(messageUsers);
                break;
        }
    }

    useEffect(() => {
        const { height } = wholeOverview.current.getBoundingClientRect();
        heightEvent(height);
    }, [donutData]);

    return (
        <div className="messenger-overview" ref={wholeOverview}>
            <div className="chart-container">
                <DonutChart
                    size={chartSize}
                    data={currentDonutData}
                    message={i18n.t(`${i18nHeader}:${currentDonutMessage}`)}
                ></DonutChart>
            </div>
            <div className="test-btn">
                <button
                    type="button"
                    onClick={() => {
                        _changeDonutData(typeDonutsChar.donutInstalls);
                    }}
                >
                    Installs
                </button>
                <button
                    type="button"
                    onClick={() => {
                        _changeDonutData(typeDonutsChar.donutUsers);
                    }}
                >
                    Users
                </button>
                <button
                    type="button"
                    onClick={() => {
                        _changeDonutData(typeDonutsChar.donutPartOf);
                    }}
                >
                    Part of
                </button>
            </div>
        </div>
    );
};

export default Overview;
