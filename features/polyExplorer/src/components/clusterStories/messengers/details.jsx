import React from "react";
// import i18n from "../../../i18n";
import SectionTitle from "../sectionTitle.jsx";
import { ClusterSections } from "../clusterSections";
import { StoryParagraph } from "./storyParagraph";
import LinesChart from "../../dataViz/linesChart.jsx";
import { BUBBLES_SPEECH_SIZES } from "../../../constants";

import "./details.css";

const Details = ({ data }) => {
    const activeUsers = {
        FBmessenger: {
            name: data["Facebook Messenger"]._data.name,
            values: data["Facebook Messenger"]._data.activeUsers.values,
        },
        Whatsapp: {
            name: data["WhatsApp"]._data.name,
            values: data["WhatsApp"]._data.activeUsers.values,
        },
        Instagram: {
            name: data["Instagram"]._data.name,
            values: data["Instagram"]._data.activeUsers.values,
        },
        Signal: {
            name: data["Signal"]._data.name,
            values: data["Signal"]._data.activeUsers.values,
        },
        Telegram: {
            name: data["Telegram"]._data.name,
            values: data["Telegram"]._data.activeUsers.values,
        },
        Threema: {
            name: data["Threema"]._data.name,
            values: data["Threema"]._data.activeUsers.values,
        },
        Snapchat: {
            name: data["Snapchat"]._data.name,
            values: data["Snapchat"]._data.activeUsers.values,
        },
        TikTok: {
            name: data["TikTok"]._data.name,
            values: data["TikTok"]._data.activeUsers.values,
        },
        iMessage: {
            name: data["iMessage"]._data.name,
            values: data["iMessage"]._data.activeUsers.values,
        },
    };
    const chartData = {
        rangeDates: [new Date("2015-01-01"), new Date("2022-01-01")],
        rangeY: [0, 2000],
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
                                x: new Date(
                                    activeUsers.FBmessenger.values[0].start_date
                                ),
                                y:
                                    activeUsers.FBmessenger.values[0]
                                        .user_count / 1000000,
                            },
                            {
                                x: new Date(
                                    activeUsers.FBmessenger.values[0].end_date
                                ),
                                y:
                                    activeUsers.FBmessenger.values[0]
                                        .user_count / 1000000,
                            },
                        ],
                        messages: [
                            {
                                x: new Date(
                                    activeUsers.FBmessenger.values[0].start_date
                                ),
                                y:
                                    activeUsers.FBmessenger.values[0]
                                        .user_count / 1000000,
                                text: "Even though Facebook revamped its messaging service in 2010, the data available about their active users is from 2020.",
                                size: BUBBLES_SPEECH_SIZES.BIG,
                            },
                            {
                                x: new Date(
                                    activeUsers.FBmessenger.values[0].end_date
                                ),
                                y:
                                    activeUsers.FBmessenger.values[0]
                                        .user_count / 1000000,
                                text:
                                    activeUsers.FBmessenger.name +
                                    ": " +
                                    activeUsers.FBmessenger.values[0]
                                        .user_count /
                                        1000000,
                                size: BUBBLES_SPEECH_SIZES.SMALL,
                            },
                        ],
                    },
                    {
                        points: [
                            {
                                x: new Date(
                                    activeUsers.Whatsapp.values[9].end_date
                                ),
                                y:
                                    activeUsers.Whatsapp.values[9].user_count /
                                    1000000,
                            },
                            {
                                x: new Date(
                                    activeUsers.Whatsapp.values[10].end_date
                                ),
                                y:
                                    activeUsers.Whatsapp.values[10].user_count /
                                    1000000,
                            },
                            {
                                x: new Date(
                                    activeUsers.Whatsapp.values[11].end_date
                                ),
                                y:
                                    activeUsers.Whatsapp.values[11].user_count /
                                    1000000,
                            },
                            {
                                x: new Date(
                                    activeUsers.Whatsapp.values[12].end_date
                                ),
                                y:
                                    activeUsers.Whatsapp.values[12].user_count /
                                    1000000,
                            },
                            {
                                x: new Date(
                                    activeUsers.Whatsapp.values[13].end_date
                                ),
                                y:
                                    activeUsers.Whatsapp.values[13].user_count /
                                    1000000,
                            },
                            {
                                x: new Date(
                                    activeUsers.Whatsapp.values[14].end_date
                                ),
                                y:
                                    activeUsers.Whatsapp.values[14].user_count /
                                    1000000,
                            },
                            {
                                x: new Date(
                                    activeUsers.Whatsapp.values[15].end_date
                                ),
                                y:
                                    activeUsers.Whatsapp.values[15].user_count /
                                    1000000,
                            },
                            {
                                x: new Date(
                                    activeUsers.Whatsapp.values[18].end_date
                                ),
                                y:
                                    activeUsers.Whatsapp.values[18].user_count /
                                    1000000,
                            },
                            {
                                x: new Date(
                                    activeUsers.Whatsapp.values[16].end_date
                                ),
                                y:
                                    activeUsers.Whatsapp.values[16].user_count /
                                    1000000,
                            },
                            {
                                x: new Date(
                                    activeUsers.Whatsapp.values[17].end_date
                                ),
                                y:
                                    activeUsers.Whatsapp.values[17].user_count /
                                    1000000,
                            },
                        ],
                        messages: [
                            {
                                x: new Date(
                                    activeUsers.Whatsapp.values[18].start_date
                                ),
                                y:
                                    activeUsers.Whatsapp.values[18].user_count /
                                    1000000,
                                text: "In the fall of 2019, WhatsApp starts to lose active users. At the same time, Signal’s active users’ curve is strongly rising.",
                                size: BUBBLES_SPEECH_SIZES.BIG,
                            },
                            {
                                x: new Date(
                                    activeUsers.Whatsapp.values[17].end_date
                                ),
                                y:
                                    activeUsers.Whatsapp.values[17].user_count /
                                    1000000,
                                text:
                                    activeUsers.Whatsapp.name +
                                    ": " +
                                    activeUsers.Whatsapp.values[17].user_count /
                                        1000000,
                                size: BUBBLES_SPEECH_SIZES.SMALL,
                            },
                        ],
                    },
                    {
                        points: [
                            {
                                x: new Date(
                                    activeUsers.Instagram.values[1].end_date
                                ),
                                y:
                                    activeUsers.Instagram.values[1].user_count /
                                    1000000,
                            },
                            {
                                x: new Date(
                                    activeUsers.Instagram.values[2].end_date
                                ),
                                y:
                                    activeUsers.Instagram.values[2].user_count /
                                    1000000,
                            },
                        ],
                        messages: [
                            {
                                x: new Date(
                                    activeUsers.Instagram.values[2].end_date
                                ),
                                y:
                                    activeUsers.Instagram.values[2].user_count /
                                    1000000,
                                text: "Instagram seems to have a massive and stable number of active users since the very beginning of heir service",
                                size: BUBBLES_SPEECH_SIZES.BIG,
                            },
                            {
                                x: new Date(
                                    activeUsers.Instagram.values[2].end_date
                                ),
                                y:
                                    activeUsers.Instagram.values[2].user_count /
                                    1000000,
                                text:
                                    activeUsers.Instagram.name +
                                    ": " +
                                    activeUsers.Instagram.values[2].user_count /
                                        1000000,
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
                                x: new Date(
                                    activeUsers.Signal.values[0].end_date
                                ),
                                y:
                                    activeUsers.Signal.values[0].user_count /
                                    1000000,
                            },
                            {
                                x: new Date(
                                    activeUsers.Signal.values[1].end_date
                                ),
                                y:
                                    activeUsers.Signal.values[1].user_count /
                                    1000000,
                            },
                            {
                                x: new Date(
                                    activeUsers.Signal.values[2].end_date
                                ),
                                y:
                                    activeUsers.Signal.values[2].user_count /
                                    1000000,
                            },
                            {
                                x: new Date(
                                    activeUsers.Signal.values[3].end_date
                                ),
                                y:
                                    activeUsers.Signal.values[3].user_count /
                                    1000000,
                            },
                            {
                                x: new Date(
                                    activeUsers.Signal.values[4].end_date
                                ),
                                y:
                                    activeUsers.Signal.values[4].user_count /
                                    1000000,
                            },
                        ],
                        messages: [
                            {
                                x: new Date(
                                    activeUsers.Signal.values[1].end_date
                                ),
                                y:
                                    activeUsers.Signal.values[1].user_count /
                                    1000000,
                                text: "Signal’s initial release was in July 2014 but the messenger service reached 1 Mio. active users in September 2019.s",
                                size: BUBBLES_SPEECH_SIZES.BIG,
                            },
                            {
                                x: new Date(
                                    activeUsers.Signal.values[4].end_date
                                ),
                                y:
                                    activeUsers.Signal.values[4].user_count /
                                    1000000,
                                text:
                                    activeUsers.Signal.name +
                                    ": " +
                                    activeUsers.Signal.values[4].user_count /
                                        1000000,
                                size: BUBBLES_SPEECH_SIZES.SMALL,
                            },
                        ],
                    },
                    {
                        points: [
                            {
                                x: new Date(
                                    activeUsers.Snapchat.values[0].end_date
                                ),
                                y:
                                    activeUsers.Snapchat.values[0].user_count /
                                    1000000,
                            },
                            {
                                x: new Date(
                                    activeUsers.Snapchat.values[1].end_date
                                ),
                                y:
                                    activeUsers.Snapchat.values[1].user_count /
                                    1000000,
                            },
                        ],
                        messages: [
                            {
                                x: new Date(
                                    activeUsers.Snapchat.values[1].end_date
                                ),
                                y:
                                    activeUsers.Snapchat.values[1].user_count /
                                    1000000,
                                text: "SnapChat is known for disappearing posts and a young user base Both of these factors are crucial elements of their user retention strategy.",
                                size: BUBBLES_SPEECH_SIZES.BIG,
                            },
                            {
                                x: new Date(
                                    activeUsers.Snapchat.values[1].end_date
                                ),
                                y:
                                    activeUsers.Snapchat.values[1].user_count /
                                    1000000,
                                text:
                                    activeUsers.Snapchat.name +
                                    ": " +
                                    activeUsers.Snapchat.values[1].user_count /
                                        1000000,
                                size: BUBBLES_SPEECH_SIZES.SMALL,
                            },
                        ],
                    },
                    {
                        points: [
                            {
                                x: new Date(
                                    activeUsers.Telegram.values[5].end_date
                                ),
                                y:
                                    activeUsers.Telegram.values[5].user_count /
                                    1000000,
                            },
                            {
                                x: new Date(
                                    activeUsers.Telegram.values[4].end_date
                                ),
                                y:
                                    activeUsers.Telegram.values[4].user_count /
                                    1000000,
                            },
                            {
                                x: new Date(
                                    activeUsers.Telegram.values[3].end_date
                                ),
                                y:
                                    activeUsers.Telegram.values[3].user_count /
                                    1000000,
                            },
                            {
                                x: new Date(
                                    activeUsers.Telegram.values[2].end_date
                                ),
                                y:
                                    activeUsers.Telegram.values[2].user_count /
                                    1000000,
                            },
                            {
                                x: new Date(
                                    activeUsers.Telegram.values[1].end_date
                                ),
                                y:
                                    activeUsers.Telegram.values[1].user_count /
                                    1000000,
                            },
                            {
                                x: new Date(
                                    activeUsers.Telegram.values[0].end_date
                                ),
                                y:
                                    activeUsers.Telegram.values[0].user_count /
                                    1000000,
                            },
                        ],
                        messages: [
                            {
                                x: new Date(
                                    activeUsers.Telegram.values[1].end_date
                                ),
                                y:
                                    activeUsers.Telegram.values[1].user_count /
                                    1000000,
                                text: "Telegram seems to have lost a significant number of active users during the summer break of 2020",
                                size: BUBBLES_SPEECH_SIZES.BIG,
                            },
                            {
                                x: new Date(
                                    activeUsers.Telegram.values[0].end_date
                                ),
                                y:
                                    activeUsers.Telegram.values[0].user_count /
                                    1000000,
                                text:
                                    activeUsers.Telegram.name +
                                    ": " +
                                    activeUsers.Telegram.values[0].user_count /
                                        1000000,
                                size: BUBBLES_SPEECH_SIZES.SMALL,
                            },
                        ],
                    },
                    {
                        points: [
                            {
                                x: new Date(
                                    activeUsers.Threema.values[0].end_date
                                ),
                                y:
                                    activeUsers.Threema.values[0].user_count /
                                    1000000,
                            },
                            {
                                x: new Date(
                                    activeUsers.Threema.values[1].end_date
                                ),
                                y:
                                    activeUsers.Threema.values[1].user_count /
                                    1000000,
                            },
                        ],
                        messages: [
                            {
                                x: new Date(
                                    activeUsers.Threema.values[1].end_date
                                ),
                                y:
                                    activeUsers.Threema.values[1].user_count /
                                    1000000,
                                text: "A significant proportion of users are in Germany, as are their investors Afinum. Most users are in the German speaking DACH region.",
                                size: BUBBLES_SPEECH_SIZES.BIG,
                            },
                            {
                                x: new Date(
                                    activeUsers.Threema.values[1].end_date
                                ),
                                y:
                                    activeUsers.Threema.values[1].user_count /
                                    1000000,
                                text:
                                    activeUsers.Threema.name +
                                    ": " +
                                    activeUsers.Threema.values[1].user_count /
                                        1000000,
                                size: BUBBLES_SPEECH_SIZES.SMALL,
                            },
                        ],
                    },
                    {
                        points: [
                            {
                                x: new Date(
                                    activeUsers.TikTok.values[0].end_date
                                ),
                                y:
                                    activeUsers.TikTok.values[0].user_count /
                                    1000000,
                            },
                            {
                                x: new Date(
                                    activeUsers.TikTok.values[1].end_date
                                ),
                                y:
                                    activeUsers.TikTok.values[1].user_count /
                                    1000000,
                            },
                            {
                                x: new Date(
                                    activeUsers.TikTok.values[2].end_date
                                ),
                                y:
                                    activeUsers.TikTok.values[2].user_count /
                                    1000000,
                            },
                            {
                                x: new Date(
                                    activeUsers.TikTok.values[4].end_date
                                ),
                                y:
                                    activeUsers.TikTok.values[4].user_count /
                                    1000000,
                            },
                            {
                                x: new Date(
                                    activeUsers.TikTok.values[3].end_date
                                ),
                                y:
                                    activeUsers.TikTok.values[3].user_count /
                                    1000000,
                            },
                        ],
                        messages: [
                            {
                                x: new Date(
                                    activeUsers.TikTok.values[0].start_date
                                ),
                                y:
                                    activeUsers.TikTok.values[0].user_count /
                                    1000000,
                                text: "One year after TikTok’s initial release in September 2016, the messenger service had already more than 50 M. active users",
                                size: BUBBLES_SPEECH_SIZES.BIG,
                            },
                            {
                                x: new Date(
                                    activeUsers.TikTok.values[3].end_date
                                ),
                                y:
                                    activeUsers.TikTok.values[3].user_count /
                                    1000000,
                                text:
                                    activeUsers.TikTok.name +
                                    ": " +
                                    activeUsers.TikTok.values[3].user_count /
                                        1000000,
                                size: BUBBLES_SPEECH_SIZES.SMALL,
                            },
                        ],
                    },
                    {
                        points: [
                            {
                                x: new Date(
                                    activeUsers.iMessage.values[0].start_date
                                ),
                                y:
                                    activeUsers.iMessage.values[0].user_count /
                                    1000000,
                            },
                            {
                                x: new Date(
                                    activeUsers.iMessage.values[0].end_date
                                ),
                                y:
                                    activeUsers.iMessage.values[0].user_count /
                                    1000000,
                            },
                        ],
                        messages: [
                            {
                                x: new Date(
                                    activeUsers.iMessage.values[0].start_date
                                ),
                                y:
                                    activeUsers.iMessage.values[0].user_count /
                                    1000000,
                                text: "Based on iPhones in use worldwide in 2017. (Statista)",
                                size: BUBBLES_SPEECH_SIZES.BIG,
                            },
                            {
                                x: new Date(
                                    activeUsers.iMessage.values[0].end_date
                                ),
                                y:
                                    activeUsers.iMessage.values[0].user_count /
                                    1000000,
                                text:
                                    activeUsers.iMessage.name +
                                    ": " +
                                    activeUsers.iMessage.values[0].user_count /
                                        1000000,
                                size: BUBBLES_SPEECH_SIZES.SMALL,
                            },
                        ],
                    },
                ],
            },
        ],
    };
    return (
        <ClusterSections as="div" className="messenger-details">
            <SectionTitle title="Details"></SectionTitle>
            <StoryParagraph as="p" className="one">
                Today our digital lives are all about being connected. Messenger
                apps play a key role in that. They shape our communication and
                our relationships. Many of us use these apps very, very often. A
                lot of information is sent and received. Some of that
                information might be personal or even secret.
            </StoryParagraph>
            <h1 className="title-messenger-story">But is it safe?</h1>
            <StoryParagraph as="p">
                When WhatsApp was acquired by Facebook eyebrows were raised.
                Some people already stopped using it because of Facebook&rsquo;s
                reputation for poor privacy behavior.
            </StoryParagraph>
            <StoryParagraph as="p">
                But when WhatsApp recently announced a change in their privacy
                regulations, the outcry was louder. Many people seem to have
                left for alternative, more privacy-respecting messengers.
            </StoryParagraph>
            <StoryParagraph as="p">
                Here is how the numbers of monthly active users developed over
                recent years. Some of the dynamics among smaller players might
                also be due to privacy concerns.
            </StoryParagraph>
            <LinesChart data={chartData}></LinesChart>
            <h1 className="title-messenger-story">So, what is the Deal?</h1>
            <StoryParagraph as="p">
                WhatsApp, Instagram, and Facebook Messenger are services that
                belong to Facebook. Facebook shares data with their subsidiary
                companies and affiliates, as is routine for a conglomerate.
                Facebook takes insights from user data and sells targeting to
                clients that buy audiences. For every ad that targets, users are
                grouped into an audience based on their use of the platform and
                then matched to a client&rsquo;s preference - and budget. What
                Facebook does to improve these services for its paying customers
                may also bring unwanted consequences for users.
            </StoryParagraph>
            <h1 className="title-messenger-story">What is in the data?</h1>
            <StoryParagraph as="p">
                To understand this better we looked at the data types messenger
                apps share with other companies, the purposes given, and the
                industries and data regions where companies receiving data are
                located. What is the business model that allows those apps to
                offer free services? And how do different messenger apps perform
                in terms of data privacy?
            </StoryParagraph>
        </ClusterSections>
    );
};

export default Details;
