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

const bigSixNames = [
    "Amazon",
    "Apple",
    "Google",
    "Facebook",
    "PayPal",
    "TikTok",
];

const DigitalGiantsStory = () => {
    const { featuredEntities, entityJurisdictionByPpid, globalData, setPopUp } =
        useContext(ExplorerContext);

    const bigSix = bigSixNames.map((n) =>
        featuredEntities.find((e) => e.ppid.indexOf(n) !== -1)
    );

    const jurisdictionLinks = createJurisdictionLinks(
        bigSix,
        entityJurisdictionByPpid
    ).map(({ source, target, value }) => ({
        source: bigSixNames.find((name) => source.indexOf(name) !== -1),
        target,
        value,
    }));

    const otherJurisdictions = [
        ...new Set(jurisdictionLinks.map(({ target }) => target)),
    ].filter((j) => j !== "EU-GDPR");

    const listOfDataCategories = Object.keys(
        globalData.personal_data_categories
    );

    let totalShares = 0;
    bigSix.forEach((company) => {
        company._data.dataTypesShared.forEach((i) => (totalShares += i.count));
    });

    const dataTypesSharedCombined = listOfDataCategories
        .map((category) => {
            let total = 0;
            bigSix.map((company) => {
                company._data.dataTypesShared.forEach((typeCategory) => {
                    if (typeCategory["dpv:Category"] === category)
                        total += typeCategory.count;
                });
            });
            return total !== 0
                ? {
                      "dpv:Category": category,
                      total,
                  }
                : null;
        })
        .filter((e) => e)
        .sort((a, b) => b.total - a.total);

    const dataTypes = [
        {
            id: "by-companies",
            label: "By Companies",
            translation: i18n.t(`${i18nHeader}:data.types.tab.companies`),
            data: bigSixNames.map((companyName, n) => {
                return {
                    title:
                        companyName +
                        ": " +
                        bigSix[n]._data.dataTypesShared.length,
                    bubbles: bigSix[n]._data.dataTypesShared.map(() => {
                        return { value: 1 };
                    }),
                };
            }),
            route: "/company-data-types-info",
        },
        {
            id: "by-shares",
            label: "By Shares",
            translation: i18n.t(`${i18nHeader}:data.types.tab.shares`),
            data: bigSixNames.map((companyName, n) => {
                return {
                    title:
                        companyName +
                        ": " +
                        bigSix[n]._data.dataTypesShared.reduce(
                            (acc, bubble) => acc + bubble.count,
                            0
                        ),
                    bubbles: bigSix[n]._data.dataTypesShared.map((bubble) => {
                        return { value: bubble.count };
                    }),
                };
            }),
            route: "/shares-data-types-info",
        },
        {
            id: "by-types",
            label: "By Types",
            translation: i18n.t(`${i18nHeader}:data.types.tab.types`),
            data: [
                {
                    title: i18n.t(`${i18nHeader}:data.types.legend.types`, {
                        amount_of_data_types: listOfDataCategories.length,
                        amount_of_shares: totalShares,
                    }),
                    bubbles: dataTypesSharedCombined.map((bubble) => {
                        return { value: bubble.total };
                    }),
                    width: 400,
                    height: 400,
                },
            ],
            route: "/types-data-types-info",
        },
    ];

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
            <p className="big-first-letter">
                {i18n.t(`${i18nHeader}:data.types.p`)}
            </p>
            <DataTypes
                dataTypes={dataTypes}
                dataTypesSharedCombined={dataTypesSharedCombined}
            />
            <SectionTitle
                title={i18n.t(`${i18nHeaderCommon}:section.purposes`)}
            />
            <p className="big-first-letter">
                {i18n.t(`${i18nHeaderCommon}:purposes.p`)}
            </p>
            <Purposes companies={bigSix} setPopUp={setPopUp} />
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
                        label: "Big Six",
                        all: true,
                    },
                    target: {
                        label: "Regions",
                        all: false,
                        others: otherJurisdictions,
                    },
                }}
            />
            <SourceInfoButton
                infoScreenRoute="/data-regions-diagram-info"
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
