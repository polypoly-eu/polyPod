import React, { useState, useEffect, useRef } from "react";
import i18n from "../../../i18n";
import DonutChart from "../../dataViz/donutChar.jsx";
import { DONUT_CHART } from "../../../constants";
import * as _ from "lodash";

import "./overview.css";

const i18nHeader = "clusterMessengerStory";

const Overview = ({ products, heightEvent }) => {
    const wholeOverview = useRef();
    const messageInstalls = "overview.donut.installs.message";
    const messageUsers = "overview.donut.users.message";
    const typeDonutsChar = {
        donutInstalls: "donutInstalls",
        donutUsers: "donutUsers",
        donutPartOf: "donutPartOf",
    };

    const [donutData, updateDonutData] = useState();
    const [currentDonutData, updateCurrentDataDonut] = useState();
    const [currentDonutMessage, updateCurrentDonutMessage] = useState(
        messageInstalls
    );

    const graphMagnitud = 1000000;
    const decimalsNumber = 2;

    function _changeDonutData(donutType, donutInfo) {
        switch (donutType) {
            case typeDonutsChar.donutInstalls:
                updateCurrentDataDonut(donutInfo.installs);
                updateCurrentDonutMessage(messageInstalls);
                break;
            case typeDonutsChar.donutUsers:
                updateCurrentDataDonut(donutInfo.activeUsers);
                updateCurrentDonutMessage(messageUsers);
                break;
            case typeDonutsChar.donutPartOf:
                updateCurrentDataDonut(donutInfo.partOf);
                updateCurrentDonutMessage(messageUsers);
                break;
        }
    }

    function buildDonutData() {
        const ownerFacebookTest = /.*[F,f]acebook.*/g;
        const [facebookProducts, noFacebookProducts] = Object.keys(
            products
        ).reduce(
            (acc, key) => {
                let [accFacebook, accNoFacebook] = acc;
                if (
                    products[key].productOwner.find((owner) =>
                        ownerFacebookTest.test(owner)
                    )
                ) {
                    accFacebook[key] = _.cloneDeep(products[key]);
                } else {
                    accNoFacebook[key] = _.cloneDeep(products[key]);
                }

                return [accFacebook, accNoFacebook];
            },
            [{}, {}]
        );

        const installs = [
            {
                groupName: DONUT_CHART.DEFAULT_GROUP,
                color: DONUT_CHART.DEFAULT_COLOR,
                groupLabelCorrection: {
                    x: 1,
                    y: 1,
                },
                attributes: Object.keys(noFacebookProducts).reduce(
                    (acc, key) => ({
                        ...acc,
                        [key]:
                            Math.round(
                                (products[key].totalInstalls / graphMagnitud) *
                                    Math.pow(10, decimalsNumber)
                            ) / Math.pow(10, decimalsNumber),
                    }),
                    {}
                ),
            },
            {
                groupName: DONUT_CHART.DEFAULT_GROUP,
                color: DONUT_CHART.DEFAULT_COLOR,
                groupLabelCorrection: {
                    x: 1,
                    y: 1,
                },
                attributes: Object.keys(facebookProducts).reduce(
                    (acc, key) => ({
                        ...acc,
                        [key]:
                            Math.round(
                                (products[key].totalInstalls / graphMagnitud) *
                                    Math.pow(10, decimalsNumber)
                            ) / Math.pow(10, decimalsNumber),
                    }),
                    {}
                ),
            },
        ];

        const activeUsers = [
            {
                groupName: DONUT_CHART.DEFAULT_GROUP,
                color: DONUT_CHART.DEFAULT_COLOR,
                groupLabelCorrection: {
                    x: 1,
                    y: 1,
                },
                attributes: Object.keys(noFacebookProducts).reduce(
                    (acc, key) => ({
                        ...acc,
                        [key]:
                            Math.round(
                                (products[key].currentActiveUsers /
                                    graphMagnitud) *
                                    Math.pow(10, decimalsNumber)
                            ) / Math.pow(10, decimalsNumber),
                    }),
                    {}
                ),
            },
            {
                groupName: DONUT_CHART.DEFAULT_GROUP,
                color: DONUT_CHART.DEFAULT_COLOR,
                groupLabelCorrection: {
                    x: 1,
                    y: 1,
                },
                attributes: Object.keys(facebookProducts).reduce(
                    (acc, key) => ({
                        ...acc,
                        [key]:
                            Math.round(
                                (products[key].currentActiveUsers /
                                    graphMagnitud) *
                                    Math.pow(10, decimalsNumber)
                            ) / Math.pow(10, decimalsNumber),
                    }),
                    {}
                ),
            },
        ];

        const partOf = [
            {
                groupName: DONUT_CHART.DEFAULT_GROUP,
                color: DONUT_CHART.DEFAULT_COLOR,
                groupLabelCorrection: {
                    x: 1,
                    y: 1,
                },
                attributes: Object.keys(noFacebookProducts).reduce(
                    (acc, key) => ({
                        ...acc,
                        [key]:
                            Math.round(
                                (products[key].currentActiveUsers /
                                    graphMagnitud) *
                                    Math.pow(10, decimalsNumber)
                            ) / Math.pow(10, decimalsNumber),
                    }),
                    {}
                ),
            },
            {
                groupName: DONUT_CHART.FACEBOOK_GROUP,
                color: DONUT_CHART.FACEBOOK_COLOR,
                groupLabelCorrection: {
                    x: 1,
                    y: 1,
                },
                attributes: Object.keys(facebookProducts).reduce(
                    (acc, key) => ({
                        ...acc,
                        [key]:
                            Math.round(
                                (products[key].currentActiveUsers /
                                    graphMagnitud) *
                                    Math.pow(10, decimalsNumber)
                            ) / Math.pow(10, decimalsNumber),
                    }),
                    {}
                ),
            },
        ];

        return { installs, activeUsers, partOf };
    }

    useEffect(() => {
        const { height } = wholeOverview.current.getBoundingClientRect();
        let donutGraphData;

        heightEvent(height);
        if (!donutData) {
            donutGraphData = buildDonutData();
            updateDonutData(donutGraphData);
        } else {
            donutGraphData = donutData;
        }

        _changeDonutData(typeDonutsChar.donutInstalls, donutGraphData);
    }, [products]);

    return (
        <div className="messenger-overview" ref={wholeOverview}>
            <div className="chart-container">
                <DonutChart
                    data={currentDonutData}
                    message={i18n.t(`${i18nHeader}:${currentDonutMessage}`)}
                ></DonutChart>
            </div>
            <div className="test-btn">
                <button
                    type="button"
                    onClick={() => {
                        _changeDonutData(
                            typeDonutsChar.donutInstalls,
                            donutData
                        );
                    }}
                >
                    Installs
                </button>
                <button
                    type="button"
                    onClick={() => {
                        _changeDonutData(typeDonutsChar.donutUsers, donutData);
                    }}
                >
                    Users
                </button>
                <button
                    type="button"
                    onClick={() => {
                        _changeDonutData(typeDonutsChar.donutPartOf, donutData);
                    }}
                >
                    Part of
                </button>
            </div>
        </div>
    );
};

export default Overview;
