import React from "react";
import DataStory from "../../components/dataStory/dataStory.jsx";
import DonutChart from "../../components/dataViz/donutChar.jsx";

const ExampleStory = () => {
    const size = 500;
    const message = `My first donut\nchart very ver long`;

    const data = [
        {
            groupName: "default",
            color: "lightBlue",
            attributes: {
                telegram: 10,
                signal: 20,
                snapChat: 30,
                iMessege: 40,
                TikTok: 50,
            },
        },
        {
            groupName: "Facebook",
            color: "darkBlue",
            attributes: {
                WhatsUp: 10,
                Messenger: 20,
                Instagram: 30,
            },
        },
    ];

    return (
        <DataStory progressBarColor="#3BA6FF">
            <div className="full-story">
                <div className="text">
                    Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed
                    diam nonumy eirmod tempor invidunt ut labore et dolore magna
                    aliquyam erat, sed diam voluptua. At vero eos et accusam et
                    justo duo dolores et ea rebum.
                </div>
                <div className="graph">
                    <DonutChart
                        size={size}
                        data={data}
                        message={message}
                    ></DonutChart>
                </div>
            </div>
        </DataStory>
    );
};

export default ExampleStory;
