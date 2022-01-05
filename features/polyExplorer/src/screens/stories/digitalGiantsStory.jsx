import React, { useContext } from "react";

import ClusterStory from "../../components/clusterStory/clusterStory.jsx";
import GradientCircleList from "../../components/gradientCircleList/gradientCircleList.jsx";
import { ExplorerContext } from "../../context/explorer-context.jsx";
import i18n from "../../i18n.js";
import SectionTitle from "../../components/clusterStories/sectionTitle.jsx";
import MatrixBubblesChart from "../../components/clusterStories/MatrixBubblesChart.jsx";
import ReceivingCompanies from "../../components/clusterStories/receivingCompanies.jsx";
import { Tabs, Tab } from "@polypoly-eu/poly-look";
import { createJurisdictionLinks } from "./story-utils";
import EmbeddedSankey from "../../components/embeddedSankey/embeddedSankey.jsx";
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
    ).map(({ source, target, value }) => ({
        source: bigSixNames.find((name) => source.indexOf(name) !== -1),
        target,
        value,
    }));

    const otherJurisdictions = [
        ...new Set(jurisdictionLinks.map(({ target }) => target)),
    ].filter((j) => j !== "EU-GDPR");

    console.log(bigSix);

    const dataTypes = [
        {
            id: "by-messenger",
            label: "By Companies",
            // translation: i18n.t(`${i18nHeader}:datatypes.tab.messenger`),
            bubbleColor: "#FB8A89",
            bubbleTextColor: "#FB8A89",
            bubbleStroke: "none",
            data: bigSixNames.map((companyName, n) => {
                return {
                    title: companyName,
                    bubbles: bigSix[n]._data.dataTypesShared.map(() => {
                        return { value: 1 };
                    }),
                };
            }),
        },
        {
            id: "by-shares",
            label: "By Shares",
            // translation: i18n.t(`${i18nHeader}:datatypes.tab.shares`),
            bubbleColor: "#FB8A89",
            bubbleTextColor: "#FB8A89",
            bubbleStroke: "none",
            data: bigSixNames.map((companyName, n) => {
                return {
                    title: companyName,
                    bubbles: bigSix[n]._data.dataTypesShared.map((bubble) => {
                        return { value: bubble.count };
                    }),
                };
            }),
        },
        {
            id: "by-types",
            label: "By Types",
            // translation: i18n.t(`${i18nHeader}:datatypes.tab.types`),
            bubbleColor: "#FB8A89",
            bubbleTextColor: "#FB8A89",
            bubbleStroke: "none",
            activeBubbleTextColor: "var(--color-text-dark)",
            data: [
                {
                    title: "Example",
                    bubbles: [{ value: 100 }, { value: 100 }, { value: 100 }],
                },
                {
                    title: "Example",
                    bubbles: [{ value: 100 }, { value: 100 }, { value: 100 }],
                },
            ],
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
            <Tabs>
                {dataTypes.map((dataType, i) => {
                    return (
                        <Tab id={dataType.id} label={dataType.label} key={i}>
                            <div className="data-types-lengend">
                                <div
                                    className="bubble-legend"
                                    style={{
                                        backgroundColor:
                                            dataTypes[0].bubbleColor,
                                    }}
                                ></div>
                            </div>
                            <MatrixBubblesChart
                                data={dataType.data}
                                bubbleColor={dataType.bubbleColor}
                                textColor={dataType.bubbleTextColor}
                                strokeColor={dataType.bubbleStroke}
                            />
                        </Tab>
                    );
                })}
            </Tabs>
            <p className="source">{i18n.t("common:source")}: PolyPedia</p>
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
            <EmbeddedSankey
                links={jurisdictionLinks}
                groups={{
                    source: {
                        label: "Messengers",
                        all: true,
                    },
                    target: {
                        label: "Regions",
                        all: false,
                        others: otherJurisdictions,
                    },
                }}
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
