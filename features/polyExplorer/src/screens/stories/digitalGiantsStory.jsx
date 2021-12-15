import React, { useContext } from "react";

import ClusterStory from "../../components/clusterStory/clusterStory.jsx";
import { ExplorerContext } from "../../context/explorer-context.jsx";
import i18n from "../../i18n.js";
import { createDataRegionLinks } from "./story-utils.js";
import { PolyChart } from "@polypoly-eu/poly-look";
//import SectionTitle from "../../components/clusterStories/sectionTitle.jsx";
//import Tab from "../../components/clusterStories/tab.jsx";

const i18nHeader = "clusterDigitalGiantsStory";

const bigSixNames = [
    "Apple",
    "PayPal",
    "Google",
    "Amazon",
    "Facebook",
    "TikTok",
];

const DigitalGiantsStory = () => {
    const { featuredEntities, entityJurisdictionByPpid } =
        useContext(ExplorerContext);

    const bigSix = bigSixNames.map((n) =>
        featuredEntities.find((e) => e.ppid.indexOf(n) !== -1)
    );

    const dataRegionLinks = createDataRegionLinks(
        bigSix,
        entityJurisdictionByPpid
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
            <PolyChart type="sankey-diagram" links={dataRegionLinks} />
        </ClusterStory>
    );
};

export default DigitalGiantsStory;
