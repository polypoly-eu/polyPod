import React, { useContext } from "react";

import ClusterStory from "../../components/clusterStory/clusterStory.jsx";
import GradientCircleList from "../../components/gradientCircleList/gradientCircleList.jsx";
import { ExplorerContext } from "../../context/explorer-context.jsx";
import i18n from "../../i18n.js";
import SectionTitle from "../../components/clusterStories/sectionTitle.jsx";
import DataTypes from "../../components/clusterStories/dataTypes.jsx";
import Purposes from "../../components/clusterStories/purposes.jsx";
import ReceivingCompanies from "../../components/clusterStories/receivingCompanies.jsx";
import { createJurisdictionLinks } from "./story-utils";
import EmbeddedSankey from "../../components/embeddedSankey/embeddedSankey.jsx";
import EntityList from "../../components/entityList/entityList.jsx";
import SourceInfoButton from "../../components/sourceInfoButton/sourceInfoButton.jsx";
import LinkButton from "../../components/buttons/linkButton/linkButton.jsx";

const i18nHeader = "clusterDigitalGiantsStory";
const i18nHeaderCommon = "clusterStoryCommon";
const primaryColor = "#f95f5a";

const bigSixNames = ["Amazon", "Apple", "Google", "Meta", "PayPal", "TikTok"];

const DigitalGiantsStory = () => {
    const { featuredEntities, entityJurisdictionByPpid, createPopUp } =
        useContext(ExplorerContext);

    const bigSix = bigSixNames.map((n) => {
        const entity = featuredEntities
            .filter((e) => e.type == "company")
            .find((e) => e.name.toLowerCase().indexOf(n.toLowerCase()) !== -1);
        entity["simpleName"] = n;
        return entity;
    });

    const jurisdictionLinks = createJurisdictionLinks(
        bigSix,
        entityJurisdictionByPpid
    ).map(({ source, target, value }) => ({
        source: bigSixNames.find(
            (name) => source.toLowerCase().indexOf(name.toLowerCase()) !== -1
        ),
        target,
        value,
    }));

    const otherJurisdictions = [
        ...new Set(jurisdictionLinks.map(({ target }) => target)),
    ].filter((j) => j !== "EU-GDPR");

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
            <div className="cluster-story-img-container">
                <img
                    className="cluster-story-img"
                    src="images/stories/digital-giants/intro.svg"
                    alt={i18n.t(`${i18nHeader}:intro.image.alt`)}
                />
            </div>
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
            <p className="big-first-letter">
                {i18n.t(`${i18nHeader}:data.types.p`)}
            </p>
            <DataTypes entities={bigSix} i18nHeader={i18nHeader} />
            <SectionTitle
                title={i18n.t(`${i18nHeaderCommon}:section.purposes`)}
            />
            <p className="big-first-letter">
                {i18n.t(`${i18nHeaderCommon}:purposes.p`)}
            </p>
            <Purposes companies={bigSix} createPopUp={createPopUp} />
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
            <EmbeddedSankey
                links={jurisdictionLinks}
                groups={{
                    source: {
                        label: i18n.t(`${i18nHeader}:data.regions.group.1`),
                        all: true,
                    },
                    target: {
                        label: i18n.t(`${i18nHeader}:data.regions.group.2`),
                        all: false,
                        others: otherJurisdictions,
                    },
                }}
            />
            <SourceInfoButton
                infoScreen="data-regions-diagram-info"
                source={i18n.t("common:source.polyPedia")}
            />
            <SectionTitle
                title={i18n.t(`${i18nHeaderCommon}:section.explore.further`)}
            />
            <p className="big-first-letter">
                {i18n.t(`${i18nHeader}:explore.further.p.1`)}
            </p>
            <EntityList entities={bigSix} expand={true} />
            <LinkButton route={"back"} className="poly-button margin-top">
                {i18n.t(`${i18nHeaderCommon}:discover.other.topics`)}
            </LinkButton>
        </ClusterStory>
    );
};

export default DigitalGiantsStory;
