import React, { useEffect, useRef, useState } from "react";
import i18n from "../../i18n.js";
import BarChart from "../../components/dataViz/barChart.jsx";
import ClusterStory from "../../components/baseClusterStory/baseClusterStory.jsx";
import LinesChart from "../../components/dataViz/linesChart.jsx";
import { BUBBLES_SPEECH_SIZES } from "../../constants";
import OneMessagerBubblesChart from "../../components/clusterStories/messengers/oneMessagerBubblesChart.jsx";
import * as d3 from "d3";

import "./exampleStory.css";

const animationPause = "pause";

const ExampleStory = () => {
    const [allMarks, updateAllMarks] = useState([]);

    const sections = {
        introduction: "introduction",
        summary: "summary",
        overview: "overview",
    };
    const marks = [
        {
            sectionName: sections,
            totalHeight: 0,
            marks: [
                {
                    animation: animationPause,
                    heightPercentage: 30,
                    debugColor: "red",
                },
            ],
        },
    ];

    const mockData = {
        rangeDates: [new Date("2015-01-01"), new Date("2021-01-01")],
        rangeY: [0, 1000],
        yAxisLabel: "MAU",
        instructionText: "Explore by tapping on the lines",
        graphDescription:
            "Development of monthly active users (MAU) per messenger over recent years in millions",
        groups: [
            {
                groupName: "Owned by Facebook",
                color: "#3749A9",
                lines: [
                    {
                        points: [
                            {
                                x: new Date("2015-01-01"),
                                y: 50,
                            },
                            {
                                x: new Date("2016-01-01"),
                                y: 100,
                            },
                            {
                                x: new Date("2017-01-01"),
                                y: 300,
                            },
                            {
                                x: new Date("2018-01-01"),
                                y: 400,
                            },
                            {
                                x: new Date("2019-01-01"),
                                y: 500,
                            },
                        ],
                        messages: [
                            {
                                x: new Date("2017-01-01"),
                                y: 300,
                                text: "We ride the dolar",
                                size: BUBBLES_SPEECH_SIZES.BIG,
                            },
                            {
                                x: new Date("2019-01-01"),
                                y: 500,
                                text: "Messanger FB: 500",
                                size: BUBBLES_SPEECH_SIZES.SMALL,
                            },
                        ],
                    },
                    {
                        points: [
                            {
                                x: new Date("2015-01-01"),
                                y: 100,
                            },
                            {
                                x: new Date("2015-06-01"),
                                y: 50,
                            },
                            {
                                x: new Date("2016-01-01"),
                                y: 150,
                            },
                            {
                                x: new Date("2016-06-01"),
                                y: 100,
                            },
                            {
                                x: new Date("2017-01-01"),
                                y: 200,
                            },
                        ],
                        messages: [
                            {
                                x: new Date("2016-06-01"),
                                y: 100,
                                text: "I think that I don't feel good",
                                size: BUBBLES_SPEECH_SIZES.BIG,
                            },
                            {
                                x: new Date("2017-01-01"),
                                y: 200,
                                text: "WhatsApp: 200",
                                size: BUBBLES_SPEECH_SIZES.SMALL,
                            },
                        ],
                    },
                    {
                        points: [
                            {
                                x: new Date("2018-01-01"),
                                y: 500,
                            },
                            {
                                x: new Date("2019-01-01"),
                                y: 490,
                            },
                            {
                                x: new Date("2020-01-01"),
                                y: 450,
                            },
                            {
                                x: new Date("2020-06-01"),
                                y: 420,
                            },
                            {
                                x: new Date("2021-01-01"),
                                y: 400,
                            },
                        ],
                        messages: [
                            {
                                x: new Date("2020-06-01"),
                                y: 420,
                                text: "I think we are going down...",
                                size: BUBBLES_SPEECH_SIZES.BIG,
                            },
                            {
                                x: new Date("2021-01-01"),
                                y: 400,
                                text: "Instagram: 400",
                                size: BUBBLES_SPEECH_SIZES.SMALL,
                            },
                        ],
                    },
                ],
            },
            {
                groupName: "Others",
                color: "#3BA6FF",
                lines: [
                    {
                        points: [
                            {
                                x: new Date("2015-01-01"),
                                y: 500,
                            },
                            {
                                x: new Date("2016-01-01"),
                                y: 500,
                            },
                            {
                                x: new Date("2017-01-01"),
                                y: 500,
                            },
                            {
                                x: new Date("2018-01-01"),
                                y: 500,
                            },
                            {
                                x: new Date("2019-01-01"),
                                y: 500,
                            },
                        ],
                        messages: [
                            {
                                x: new Date("2017-01-01"),
                                y: 500,
                                text: "I like the stablity... no hearth attacks",
                                size: BUBBLES_SPEECH_SIZES.BIG,
                            },
                            {
                                x: new Date("2019-01-01"),
                                y: 500,
                                text: "Signarl: 500",
                                size: BUBBLES_SPEECH_SIZES.SMALL,
                            },
                        ],
                    },
                    {
                        points: [
                            {
                                x: new Date("2015-01-01"),
                                y: 10,
                            },
                            {
                                x: new Date("2015-06-01"),
                                y: 100,
                            },
                            {
                                x: new Date("2016-01-01"),
                                y: 1000,
                            },
                        ],
                        messages: [
                            {
                                x: new Date("2015-06-01"),
                                y: 100,
                                text: "I'm like a rocket",
                                size: BUBBLES_SPEECH_SIZES.BIG,
                            },
                            {
                                x: new Date("2017-01-01"),
                                y: 100000,
                                text: "Telegram: 100000",
                                size: BUBBLES_SPEECH_SIZES.SMALL,
                            },
                        ],
                    },
                    {
                        points: [
                            {
                                x: new Date("2018-01-01"),
                                y: 1000,
                            },
                            {
                                x: new Date("2019-01-01"),
                                y: 100,
                            },
                            {
                                x: new Date("2020-01-01"),
                                y: 10,
                            },
                            {
                                x: new Date("2020-06-01"),
                                y: 1,
                            },
                            {
                                x: new Date("2021-01-01"),
                                y: -10,
                            },
                        ],
                        messages: [
                            {
                                x: new Date("2020-01-01"),
                                y: 10,
                                text: "щ（ﾟДﾟщ）",
                                size: BUBBLES_SPEECH_SIZES.BIG,
                            },
                            {
                                x: new Date("2021-01-01"),
                                y: -10,
                                text: "Threema",
                                size: BUBBLES_SPEECH_SIZES.SMALL,
                            },
                        ],
                    },
                ],
            },
        ],
    };
    const fakeEvent = () => {};
    const mockData1 = {
        title: "Facebook Messenger",
        color: "#FB8A89",
        bubbles: [5, 5, 5, 5, 5, 5, 5, 5],
    };

    const mockData2 = {
        title: "Facebook Messenger",
        color: "#FB8A89",
        bubbles: [10, 5, 15, 20, 35, 30, 45, 40],
    };
    const svgCanvas = useRef();
    const [currentData, changeCurrentData] = useState(mockData2);

    function changeToMockData2() {
        changeCurrentData(mockData2);
    }

    function changeToMockData1() {
        changeCurrentData(mockData1);
    }

    function updateMarks() {
        if (!marks.find((section) => section.totalHeight === 0)) {
            updateAllMarks(marks);
        }
    }

    useEffect(() => {
        updateMarks(marks);
        d3.select(svgCanvas.current)
            .attr("xmlns", "http://www.w3.org/2000/svg")
            .attr("xmlns:xlink", "http://www.w3.org/1999/xlink")
            .attr("xmlns:xhtml", "http://www.w3.org/1999/xhtml")
            .attr("viewBox", "0 0 300 300")
            .style("width", "100%")
            .style("height", "400px");
    }, []);

    const data = [
        { title: "Example A", value: 1079999 },
        { title: "Example B", value: 31 },
        { title: "Example C", value: 63588 },
        { title: "Example for a Longer Label", value: 6400000 },
    ];

    const fakeAnimationEvent = () => {
        return true;
    };

    const purposesChartTranslation = i18n.t(
        "clusterMessengerStory:purposes.chart.legend"
    );

    return (
        <ClusterStory
            progressBarColor="#3BA6FF"
            className="example-story"
            scrollEvent={fakeEvent}
            marks={allMarks}
        >
            <LinesChart data={mockData}></LinesChart>
            <BarChart
                data={data}
                animation={fakeAnimationEvent()}
                legendTitle={purposesChartTranslation}
            />
            <svg ref={svgCanvas}>
                <OneMessagerBubblesChart
                    data={currentData}
                    width={65}
                    height={65}
                    coord={[0, 0]}
                ></OneMessagerBubblesChart>
            </svg>
            <button
                type="button"
                onClick={() => {
                    changeToMockData1();
                }}
            >
                Mock data 1
            </button>
            <button
                type="button"
                onClick={() => {
                    changeToMockData2();
                }}
            >
                Mock data 2
            </button>
            <p className="text-example">
                Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed
                diam nonumy eirmod tempor invidunt ut labore et dolore magna
                aliquyam erat, sed diam voluptua. At vero eos et accusam et
                justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea
                takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum
                dolor sit amet, consetetur sadipscing elitr, sed diam nonumy
                eirmod tempor invidunt ut labore et dolore magna aliquyam erat,
                sed diam voluptua. At vero eos et accusam et justo duo dolores
                et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus
                est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet,
                consetetur sadipscing elitr, sed diam nonumy eirmod tempor
                invidunt ut labore et dolore magna aliquyam erat, sed diam
                voluptua.
            </p>
            <p className="text-example">
                Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed
                diam nonumy eirmod tempor invidunt ut labore et dolore magna
                aliquyam erat, sed diam voluptua. At vero eos et accusam et
                justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea
                takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum
                dolor sit amet, consetetur sadipscing elitr, sed diam nonumy
                eirmod tempor invidunt ut labore et dolore magna aliquyam erat,
                sed diam voluptua. At vero eos et accusam et justo duo dolores
                et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus
                est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet,
                consetetur sadipscing elitr, sed diam nonumy eirmod tempor
                invidunt ut labore et dolore magna aliquyam erat, sed diam
                voluptua.
            </p>
            <p className="text-example">
                Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed
                diam nonumy eirmod tempor invidunt ut labore et dolore magna
                aliquyam erat, sed diam voluptua. At vero eos et accusam et
                justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea
                takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum
                dolor sit amet, consetetur sadipscing elitr, sed diam nonumy
                eirmod tempor invidunt ut labore et dolore magna aliquyam erat,
                sed diam voluptua. At vero eos et accusam et justo duo dolores
                et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus
                est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet,
                consetetur sadipscing elitr, sed diam nonumy eirmod tempor
                invidunt ut labore et dolore magna aliquyam erat, sed diam
                voluptua.
            </p>
        </ClusterStory>
    );
};

export default ExampleStory;
