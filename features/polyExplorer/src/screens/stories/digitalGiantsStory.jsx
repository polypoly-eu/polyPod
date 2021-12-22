import React, { useContext } from "react";

import ClusterStory from "../../components/clusterStory/clusterStory.jsx";
import GradientCircleList from "../../components/gradientCircleList/gradientCircleList.jsx";
import { ExplorerContext } from "../../context/explorer-context.jsx";
import i18n from "../../i18n.js";
import SectionTitle from "../../components/clusterStories/sectionTitle.jsx";
import ReceivingCompanies from "../../components/clusterStories/receivingCompanies.jsx";
import { Tabs, Tab } from "@polypoly-eu/poly-look";
import { createJurisdictionLinks } from "./story-utils";
import { PolyChart } from "@polypoly-eu/poly-look";
import EntityList from "../../components/entityList/entityList.jsx";

const i18nHeader = "clusterDigitalGiantsStory";
const i18nHeaderCommon = "clusterStoryCommon";
const primaryColor = "#f95f5a";

const bigSixNames = [
    "Amazon",
    "Apple",
    "Google",
    "Facebook",
    "PayPal",
    "TikTok",
];

const DigitalGiantsStory = () => {
    const { featuredEntities, entityJurisdictionByPpid } =
        useContext(ExplorerContext);

    const bigSix = bigSixNames.map((n) =>
        featuredEntities.find((e) => e.ppid.indexOf(n) !== -1)
    );

    const jurisdictionLinks = createJurisdictionLinks(
        bigSix,
        entityJurisdictionByPpid
    );

    return (
        <ClusterStory
            progressBarColor="black"
            className="digital-giants-story"
            primaryColor={primaryColor}
            fadingTopBackground={{
                distance: "600px",
            }}
        >
            <h1 className="cluster-story-main-title">
                {i18n.t(`${i18nHeader}:title`)}
            </h1>
            <p className="big-first-letter">
                {i18n.t(`${i18nHeader}:intro.p.1`)}
            </p>
            <img
                className="cluster-story-img"
                src="images/stories/digital-giants/intro.svg"
                alt={i18n.t(`${i18nHeader}:intro.image.alt`)}
            />
            <GradientCircleList
                introText={i18n.t(`${i18nHeader}:intro.p.2`)}
                list={bigSixNames}
                color={primaryColor}
            />
            <h2 className="cluster-story-title">
                {i18n.t(`${i18nHeaderCommon}:what.we.found`)}
            </h2>
            <SectionTitle
                title={i18n.t(`${i18nHeaderCommon}:section.dataTypes`)}
            />
            <Tabs>
                <Tab id="tab-hello" label="Hallo">
                    <div style={{ width: "100%", height: "200px" }}></div>
                </Tab>
                <Tab id="tab-bye" label="Tschüß">
                    <div style={{ width: "100%", height: "200px" }}></div>
                </Tab>
            </Tabs>
            <p className="big-first-letter">
                {i18n.t(`${i18nHeader}:data.types.p`)}
            </p>
            <SectionTitle
                title={i18n.t(`${i18nHeaderCommon}:section.purposes`)}
            />
            <p className="big-first-letter">
                {i18n.t(`${i18nHeaderCommon}:purposes.p`)}
            </p>
            <SectionTitle
                title={i18n.t(`${i18nHeaderCommon}:section.companies`)}
            />
            <p className="big-first-letter">
                {i18n.t(`${i18nHeader}:companies.p.1`)}
            </p>
            <p>{i18n.t(`${i18nHeader}:companies.p.2`)}</p>
            <ReceivingCompanies entities={bigSix} />
            <SectionTitle
                title={i18n.t(`${i18nHeaderCommon}:section.dataRegions`)}
            />
            <p className="big-first-letter">
                {i18n.t(`${i18nHeader}:data.regions.p.1`)}
            </p>
            <PolyChart
                type="sankey-diagram"
                links={jurisdictionLinks}
                className="full-size-svg"
            />
            <SectionTitle
                title={i18n.t(`${i18nHeaderCommon}:section.explore.further`)}
            />
            <p className="big-first-letter">
                {i18n.t(`${i18nHeader}:explore.further.p.1`)}
            </p>
            <EntityList entities={bigSix} expand={true} />
        </ClusterStory>
    );
};

export default DigitalGiantsStory;
