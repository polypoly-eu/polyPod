import React, { useContext } from "react";

import ClusterStory from "../../components/clusterStory/clusterStory.jsx";
import { ExplorerContext } from "../../context/explorer-context.jsx";
import i18n from "../../i18n.js";
import { createDataRegionLinks } from "./story-utils.js";
//import SectionTitle from "../../components/clusterStories/sectionTitle.jsx";
//import Tab from "../../components/clusterStories/tab.jsx";

import "./digitalGiantsStory.css";

const i18nHeader = "clusterDigitalGiantsStory";

const bigSixNames = [
    "Amazon",
    "Apple",
    "Google",
    "Facebook",
    "PayPal",
    "TikTok",
];

const DigitalGiantsStory = () => {
    const { featuredEntities, entityDataRegionByPpid } =
        useContext(ExplorerContext);

    const bigSix = bigSixNames.map((n) =>
        featuredEntities.find((e) => e.ppid.indexOf(n) !== -1)
    );

    const dataRegionLinks = createDataRegionLinks(
        bigSix,
        entityDataRegionByPpid
    );

    return (
        <ClusterStory
            progressBarColor="black"
            className="digital-giants-story"
            primaryColor="#f95f5a"
            fadingTopBackground={{
                distance: "600px",
            }}
        >
            <div className="messenger-intro-background"></div>
            <h1 className="cluster-story-main-title">
                {i18n.t(`${i18nHeader}:title`)}
            </h1>
            <img
                className="story-intro-img"
                src="images/stories/messenger/intro-guy.svg"
                alt={i18n.t(`${i18nHeader}:intro.image.alt`)}
            />
            <ul>
                {bigSixNames.map((company, index) => (
                    <li key={index}>{company}</li>
                ))}
            </ul>
        </ClusterStory>
    );
};

export default DigitalGiantsStory;
