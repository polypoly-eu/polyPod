import React from "react";
import DataStory from "../../components/dataStory/dataStory.jsx";
import LinesChart from "../../components/dataViz/linesChart.jsx";
import { BUBBLES_SPEECH_SIZES } from "../../constants";

import "./exampleStory.css";

const ExampleStory = () => {
    const mockData = {
        rangeDates: [new Date("2015-01-01"), new Date("2021-01-01")],
        rangeY: [0, 1000],
        yAxisLabel: "MAU",
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
                                text:
                                    "I like the stablity... no hearth attacks",
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

    return (
        <DataStory
            progressBarColor="#3BA6FF"
            className="example-story"
            scrollEvent={fakeEvent}
        >
            <LinesChart data={mockData}></LinesChart>
            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
            nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
            erat, sed diam voluptua. At vero eos et accusam et justo duo dolores
            et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est
            Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur
            sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore
            et dolore magna aliquyam erat, sed diam voluptua. At vero eos et
            accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren,
            no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum
            dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod
            tempor invidunt ut labore et dolore magna aliquyam erat, sed diam
            voluptua. At vero eos et accusam et justo duo dolores et ea rebum.
            Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum
            dolor sit amet. Duis autem vel eum iriure dolor in hendrerit in
            vulputate velit esse molestie consequat, vel illum dolore eu feugiat
            nulla facilisis at vero eros et accumsan et iusto odio dignissim qui
            blandit praesent luptatum zzril delenit augue duis dolore te feugait
            nulla facilisi. Lorem ipsum dolor sit amet, consectetuer adipiscing
            elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore
            magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis
            nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip
            ex ea commodo consequat. Duis autem vel eum iriure dolor in
            hendrerit in vulputate velit esse molestie consequat, vel illum
            dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto
            odio dignissim qui blandit praesent luptatum zzril delenit augue
            duis dolore te feugait nulla facilisi. Nam liber tempor cum soluta
            nobis eleifend option congue nihil imperdiet doming id quod mazim
            placerat facer possim assum. Lorem ipsum dolor sit amet,
            consectetuer adipiscing elit, sed diam nonummy nibh euismod
            tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi
            enim ad minim veniam, quis nostrud exerci tation ullamcorper
            suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis
            autem vel eum iriure dolor in hendrerit in vulputate velit esse
            molestie consequat, vel illum dolore eu feugiat nulla facilisis. At
            vero eos et accusam et justo duo dolores et ea rebum. Stet clita
            kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit
            amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed
            diam nonumy eirmod tempor invidunt ut labore et dolore magna
            aliquyam erat, sed diam voluptua. At vero eos et accusam et justo
            duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata
            sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet,
            consetetur sadipscing elitr, At accusam aliquyam diam diam dolore
            dolores duo eirmod eos erat, et nonumy sed tempor et et invidunt
            justo labore Stet clita ea et gubergren, kasd magna no rebum.
            sanctus sea sed takimata ut vero voluptua. est Lorem ipsum dolor sit
            amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed
            diam nonumy eirmod tempor invidunt ut labore et dolore magna
            aliquyam erat. Consetetur sadipscing elitr, sed diam nonumy eirmod
            tempor invidunt ut labore et dolore magna aliquyam erat, sed diam
            voluptua. At vero eos et accusam et justo duo dolores et ea rebum.
            Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum
            dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing
            elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore
            magna aliquyam erat, sed diam voluptua. At vero eos et accusam et
            justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea
            takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor
            sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
            invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.
            At vero eos et accusam et justo duo dolores et ea rebum. Stet clita
            kasd gubergren, no sea takimata sanctus. Lorem ipsum dolor sit amet,
            consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt
            ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero
            eos et accusam et justo duo dolores et ea rebum. Stet clita kasd
            gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
            nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
            erat, sed diam voluptua. At vero eos et accusam et justo duo dolores
            et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est
            Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur
            sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore
            et dolore magna aliquyam erat, sed diam voluptua. At vero eos et
            accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren,
            no sea takimata sanctus est Lorem ipsum dolor sit amet. Duis autem
            vel eum iriure dolor in hendrerit in vulputate velit esse molestie
            consequat, vel illum dolore eu feugiat nulla facilisis at vero eros
            et accumsan et iusto odio dignissim qui blandit praesent luptatum
            zzril delenit augue duis dolore te feugait nulla facilisi. Lorem
            ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy
            nibh euismod tincidunt ut laoreet dolore magna aliquam erat
            volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation
            ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo
            consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate
            velit esse molestie consequat, vel illum dolore eu feugiat nulla
            facilisis at vero eros et accumsan et iusto odio dignissim qui
            blandit praesent luptatum zzril delenit augue duis dolore te feugait
            nulla facilisi. Nam liber tempor cum soluta nobis eleifend option
            congue nihil imperdiet doming id quod mazim placerat facer possim
            assum. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed
            diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam
            erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci
            tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo
        </DataStory>
    );
};

export default ExampleStory;
