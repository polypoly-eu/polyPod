import React, { useContext, useState } from "react";

import ClusterStory from "../../components/clusterStory/clusterStory.jsx";
import { ExplorerContext } from "../../context/explorer-context.jsx";
import i18n from "../../i18n.js";
import SectionTitle from "../../components/clusterStories/sectionTitle.jsx";
import MatrixBubblesChart from "../../components/clusterStories/MatrixBubblesChart.jsx";
import Purposes from "../../components/clusterStories/purposes.jsx";
import ReceivingCompanies from "../../components/clusterStories/receivingCompanies.jsx";
import EntityList from "../../components/entityList/entityList.jsx";
import OverviewBarChart from "../../components/clusterStories/overviewBarChart.jsx";
import OrderedList from "../../components/orderedList/orderedList.jsx";
import { Tabs, Tab, PolyChart } from "@polypoly-eu/poly-look";
import { createJurisdictionLinks } from "./story-utils";
import EmbeddedSankey from "../../components/embeddedSankey/embeddedSankey.jsx";
import SourceInfoButton from "../../components/sourceInfoButton/sourceInfoButton.jsx";
import GradientCircleList from "../../components/gradientCircleList/gradientCircleList.jsx";

import MessengerTreeMap from "../../components/clusterStories/messengerTreeMap.jsx";
import LinkButton from "../../components/buttons/linkButton/linkButton.jsx";
import MessengerMauChart from "../../components/clusterStories/messengerMauChart.jsx";

const i18nHeader = "clusterMessengerStory";
const i18nHeaderCommon = "clusterStoryCommon";
const bubbleColor = "#FB8A89";
const bubbleStroke = "none";
const bubbleTextColor = "#0f1938";

const primaryColor = "#3ba6ff";

const MessengerStory = () => {
    const {
        products,
        globalData,
        entityJurisdictionByPpid,
        setPopUp,
        entityObjectByPpid,
    } = useContext(ExplorerContext);

    const listOfMessengerApps = [
        "Facebook Messenger",
        "WhatsApp",
        "Instagram",
        "Signal",
        "Snapchat",
        "Telegram",
        "Threema",
        "TikTok",
        "iMessage",
    ];

    const messengers = Object.values(products).filter(
        (p) => p.clusters.indexOf("messenger") !== -1
    );

    const facebookMessengers = messengers.filter((e) =>
        e.productOwner.some((o) => o.includes("Facebook"))
    );

    const mainFacebookCompany = "Facebook (US)";

    const summaryBullets = [
        i18n.t(`${i18nHeader}:summary.bullet.1`, {
            advertising_shared: messengers.filter((m) =>
                m.dataSharingPurposes.some(
                    (e) => e["dpv:Purpose"] === "dpv:Advertising"
                )
            ).length,
            total_apps: listOfMessengerApps.length,
        }),
        i18n.t(`${i18nHeader}:summary.bullet.2`, {
            min_datatypes_shared: messengers.reduce((a, b) =>
                Math.min(
                    a.dataTypesShared?.length || a,
                    b.dataTypesShared.length
                )
            ),
            max_datatypes_shared: messengers.reduce((a, b) =>
                Math.max(
                    a.dataTypesShared?.length || a,
                    b.dataTypesShared.length
                )
            ),
        }),
        i18n.t(`${i18nHeader}:summary.bullet.3`, {
            max_facebook_product_recipients: facebookMessengers.reduce((a, b) =>
                Math.max(a.dataRecipients?.length || a, b.dataRecipients.length)
            ),
            facebook_recipients:
                entityObjectByPpid(mainFacebookCompany).dataRecipients.length,
        }),
    ];

    const tipsBullets = [
        i18n.t(`${i18nHeader}:tips.bullet.1`),
        i18n.t(`${i18nHeader}:tips.bullet.2`),
        i18n.t(`${i18nHeader}:tips.bullet.3`),
    ];

    const listOfDataCategories = Object.keys(
        globalData.personal_data_categories
    );

    let totalShares = 0;
    listOfMessengerApps.forEach((messenger) => {
        products[messenger]._data.dataTypesShared.forEach(
            (i) => (totalShares += i.count)
        );
    });

    const dataTypesShared = listOfMessengerApps.map((messenger) => {
        return products[messenger]._data.dataTypesShared;
    });

    const dataTypesSharedCombined = listOfDataCategories
        .map((category) => {
            let total = 0;
            dataTypesShared.forEach((types) => {
                types.forEach((typeCategory) => {
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

    const [selectedDataTypeBubble, setSelectedDataTypeBubble] = useState(
        dataTypesSharedCombined[0].total
    );

    const dataTypes = [
        {
            id: "by-messenger",
            label: "By Messenger",
            translation: i18n.t(`${i18nHeader}:data.types.tab.messenger`),
            description: i18n.t(`${i18nHeader}:data.types.text.messenger`),
            data: listOfMessengerApps.map((messenger) => {
                return {
                    title:
                        messenger +
                        ": " +
                        products[messenger]._data.dataTypesShared.length,
                    bubbles: products[messenger]._data.dataTypesShared.map(
                        () => {
                            return { value: 1 };
                        }
                    ),
                };
            }),
            route: "/company-data-types-info",
        },
        {
            id: "by-shares",
            label: "By Shares",
            translation: i18n.t(`${i18nHeader}:data.types.tab.shares`),
            description: i18n.t(`${i18nHeader}:data.types.text.shares
            `),
            data: listOfMessengerApps.map((messenger) => {
                return {
                    title:
                        messenger +
                        ": " +
                        products[messenger]._data.dataTypesShared.reduce(
                            (acc, bubble) => acc + bubble.count,
                            0
                        ),
                    bubbles: products[messenger]._data.dataTypesShared.map(
                        (bubble) => {
                            return { value: bubble.count };
                        }
                    ),
                };
            }),
            route: "/shares-data-types-info",
        },
        {
            id: "by-types",
            label: "By Types",
            translation: i18n.t(`${i18nHeader}:data.types.tab.types`),
            description: i18n.t(`${i18nHeader}:data.types.text.types`),
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

    const handleBubbleClick = (_, node) => {
        setSelectedDataTypeBubble(node.data.value);
    };

    const jurisdictionLinks = createJurisdictionLinks(
        Object.values(products),
        entityJurisdictionByPpid
    ).map(({ source, target, value }) => ({
        source: listOfMessengerApps.find((name) => source.indexOf(name) !== -1),
        target,
        value,
    }));

    const otherJurisdictions = [
        ...new Set(jurisdictionLinks.map(({ target }) => target)),
    ].filter((j) => j !== "EU-GDPR");

    return (
        <ClusterStory
            progressBarColor="black"
            className="messenger-story poly-theme light"
            primaryColor={primaryColor}
            fadingTopBackground={{
                distance: "600px",
            }}
        >
            <div className="messenger-intro-background"></div>
            <h1 className="cluster-story-main-title">
                {i18n.t(`${i18nHeader}:title`)}
            </h1>
            <p className="big-first-letter">
                {i18n.t(`${i18nHeader}:intro.paragraph.one`)}
            </p>
            <div className="cluster-story-img-container">
                <img
                    className="cluster-story-img"
                    src="images/stories/messenger/intro-guy.svg"
                    alt={i18n.t(`${i18nHeader}:intro.image.alt`)}
                />
            </div>
            <p>{i18n.t(`${i18nHeader}:intro.paragraph.two`)}</p>
            <GradientCircleList
                introText={i18n.t(`${i18nHeader}:intro.paragraph.two`)}
                list={Object.keys(products)}
                color={primaryColor}
                rotation="90deg"
            />
            <h2 className="cluster-story-title">
                {i18n.t(`${i18nHeader}:summary.title`)}
            </h2>
            <SectionTitle
                title={i18n.t(`${i18nHeader}:summary.section`)}
            ></SectionTitle>
            <p className="introduction-summary">
                {i18n.t(`${i18nHeader}:summary.paragraph.one`)}
            </p>
            <OrderedList list={summaryBullets} />
            <SectionTitle
                title={i18n.t(`${i18nHeader}:overview.section`)}
            ></SectionTitle>
            <p className="big-first-letter">
                {i18n.t(`${i18nHeader}:overview.paragraph.one`)}
            </p>
            <OverviewBarChart entities={Object.values(products)} />
            <SourceInfoButton
                infoScreenRoute="/overview-bar-chart-info"
                source={i18n.t("common:source.polyPedia")}
            />
            <SectionTitle
                title={i18n.t(`${i18nHeader}:details.section`)}
            ></SectionTitle>
            <p className="big-first-letter">
                {i18n.t(`${i18nHeader}:details.p.1`)}
            </p>
            <MessengerMauChart
                messengers={messengers}
                i18nHeader={i18nHeader}
            />
            <SourceInfoButton
                infoScreenRoute="/details-line-chart-info"
                source={i18n.t("common:source.polyPedia")}
            />
            <MessengerTreeMap
                messengers={Object.values(products)}
                i18nHeader={i18nHeader}
            />
            <SourceInfoButton
                infoScreenRoute="/details-treemap-info"
                source={i18n.t("common:source.polyPedia")}
            />
            <SectionTitle
                title={i18n.t(`${i18nHeader}:data.types.title`)}
            ></SectionTitle>
            {dataTypes.map((dataType, i) => {
                return (
                    <p
                        key={i}
                        className={
                            dataType.id === "by-messenger"
                                ? "big-first-letter"
                                : null
                        }
                    >
                        {dataType.description}
                    </p>
                );
            })}
            <Tabs>
                {dataTypes.map((dataType, i) => {
                    return (
                        <Tab
                            id={dataType.id}
                            label={dataType.label}
                            translation={dataType.translation}
                            key={i}
                        >
                            <div className="data-types-legend">
                                <div
                                    className="bubble-legend"
                                    style={{
                                        backgroundColor: bubbleColor,
                                    }}
                                ></div>
                                <p>
                                    {i18n.t(`${i18nHeader}:data.types.legend`)}
                                </p>
                            </div>
                            {dataType.id !== "by-types" ? (
                                <>
                                    <MatrixBubblesChart
                                        data={dataType.data}
                                        bubbleColor={bubbleColor}
                                        textColor={bubbleColor}
                                        strokeColor={bubbleStroke}
                                    />
                                    <SourceInfoButton
                                        infoScreenRoute={dataType.route}
                                        source={i18n.t(
                                            "common:source.polyPedia"
                                        )}
                                    />
                                </>
                            ) : (
                                <>
                                    <div className="by-types-bubble-chart">
                                        <PolyChart
                                            type="bubble-cluster"
                                            data={dataType.data[0].bubbles}
                                            width={dataType.data[0].width}
                                            height={dataType.data[0].height}
                                            bubbleColor={bubbleColor}
                                            textColor={dataType.data[0].bubbles.map(
                                                (bubble) => {
                                                    selectedDataTypeBubble ===
                                                    bubble.value
                                                        ? bubbleTextColor
                                                        : bubbleColor;
                                                }
                                            )}
                                            strokeColor={bubbleStroke}
                                            onBubbleClick={handleBubbleClick}
                                        />
                                        <h4>{dataType.data[0].title}</h4>
                                    </div>
                                    <SourceInfoButton
                                        infoScreenRoute={dataType.route}
                                        source={i18n.t(
                                            "common:source.polyPedia"
                                        )}
                                    />
                                </>
                            )}
                        </Tab>
                    );
                })}
            </Tabs>
            <SectionTitle
                title={i18n.t(`${i18nHeaderCommon}:section.purposes`)}
            />
            <p className="big-first-letter">
                {i18n.t(`${i18nHeaderCommon}:purposes.p`)}
            </p>
            <Purposes companies={messengers} setPopUp={setPopUp} />
            <SectionTitle
                title={i18n.t(`${i18nHeaderCommon}:section.companies`)}
            />
            <p className="big-first-letter">
                {i18n.t(`${i18nHeader}:companies.p.1`)}
            </p>
            <p>{i18n.t(`${i18nHeader}:companies.p.2`)}</p>
            <ReceivingCompanies entities={messengers} />
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
            <SourceInfoButton
                infoScreenRoute="/data-regions-diagram-info"
                source={i18n.t("common:source.polyPedia")}
            />
            <SectionTitle title={i18n.t(`${i18nHeader}:tips.section`)} />
            <p className="big-first-letter">
                {i18n.t(`${i18nHeader}:tips.p.1`)}
            </p>
            <OrderedList list={tipsBullets} />
            <SectionTitle
                title={i18n.t(`${i18nHeaderCommon}:section.explore.further`)}
            />
            <p className="big-first-letter">
                {i18n.t(`${i18nHeader}:explore.further.p.1`)}
            </p>
            <EntityList entities={Object.values(products)} expand={true} />
            <LinkButton route={"back"} className="poly-button margin-top">
                {i18n.t(`${i18nHeaderCommon}:discover.other.topics`)}
            </LinkButton>
        </ClusterStory>
    );
};

export default MessengerStory;
