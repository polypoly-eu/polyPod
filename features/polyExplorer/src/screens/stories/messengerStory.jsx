import React, { useContext, useState } from "react";

import ClusterStory from "../../components/clusterStory/clusterStory.jsx";
import { ExplorerContext } from "../../context/explorer-context.jsx";
import i18n from "../../i18n.js";
import SectionTitle from "../../components/clusterStories/sectionTitle.jsx";
import MatrixBubblesChart from "../../components/clusterStories/MatrixBubblesChart.jsx";
import ReceivingCompanies from "../../components/clusterStories/receivingCompanies.jsx";
import EntityList from "../../components/entityList/entityList.jsx";
import OrderedList from "../../components/orderedList/orderedList.jsx";
import { Tabs, Tab, PolyChart } from "@polypoly-eu/poly-look";
import { createJurisdictionLinks } from "./story-utils";
import EmbeddedSankey from "../../components/embeddedSankey/embeddedSankey.jsx";

import "./messengerStory.css";
import MessengerTreeMap from "../../components/clusterStories/messengerTreeMap.jsx";
import LinesChart from "../../components/dataViz/linesChart.jsx";

const i18nHeader = "clusterMessengerStory";
const i18nHeaderCommon = "clusterStoryCommon";

const MessengerStory = () => {
    const { products, globalData, entityJurisdictionByPpid } =
        useContext(ExplorerContext);

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

    const summaryBullets = [
        i18n.t(`${i18nHeader}:summary.bullet.1`),
        i18n.t(`${i18nHeader}:summary.bullet.2`),
        i18n.t(`${i18nHeader}:summary.bullet.3`),
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
            translation: i18n.t(`${i18nHeader}:datatypes.tab.messenger`),
            bubbleColor: "#FB8A89",
            bubbleTextColor: "#FB8A89",
            bubbleStroke: "none",
            description: i18n.t(`${i18nHeader}:datatypes.text.messenger`),
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
        },
        {
            id: "by-shares",
            label: "By Shares",
            translation: i18n.t(`${i18nHeader}:datatypes.tab.shares`),
            bubbleColor: "#FB8A89",
            bubbleTextColor: "#FB8A89",
            bubbleStroke: "none",
            description: i18n.t(`${i18nHeader}:datatypes.text.shares
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
        },
        {
            id: "by-types",
            label: "By Types",
            translation: i18n.t(`${i18nHeader}:datatypes.tab.types`),
            bubbleColor: "#FB8A89",
            bubbleTextColor: "#FB8A89",
            bubbleStroke: "none",
            activeBubbleTextColor: "var(--color-text-dark)",
            description: i18n.t(`${i18nHeader}:datatypes.text.types`),
            data: [
                {
                    title: i18n.t(`${i18nHeader}:datatypes.legend.types`, {
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

    const mockData = {
        rangeDates: [new Date("2015-01-01"), new Date("2021-01-01")],
        rangeY: [0, 1000],
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
                    },
                ],
            },
        ],
    };

    return (
        <ClusterStory
            progressBarColor="black"
            className="messenger-story"
            primaryColor="#3ba6ff"
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
            <img
                className="cluster-story-img"
                src="images/stories/messenger/intro-guy.svg"
                alt={i18n.t(`${i18nHeader}:intro.image.alt`)}
            />
            <p>{i18n.t(`${i18nHeader}:intro.paragraph.two`)}</p>
            <ul>
                {Object.keys(products).map((messenger, index) => (
                    <li key={index}>{messenger}</li>
                ))}
            </ul>
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
            <p>{i18n.t(`${i18nHeader}:overview.paragraph.two`)}</p>
            <SectionTitle
                title={i18n.t(`${i18nHeader}:details.section`)}
            ></SectionTitle>
            <p className="big-first-letter">
                {i18n.t(`${i18nHeader}:details.p.1`)}
            </p>
            <LinesChart data={mockData} />
            <MessengerTreeMap
                messengers={Object.values(products)}
                i18nHeader={i18nHeader}
            />
            <SectionTitle
                title={i18n.t(`${i18nHeaderCommon}:section.purposes`)}
            />
            <p className="big-first-letter">
                {i18n.t(`${i18nHeaderCommon}:purposes.p`)}
            </p>
            <SectionTitle
                title={i18n.t(`${i18nHeader}:datatypes.title`)}
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
                            <div className="data-types-lengend">
                                <div
                                    className="bubble-legend"
                                    style={{
                                        backgroundColor:
                                            dataTypes[0].bubbleColor,
                                    }}
                                ></div>
                                <p>
                                    {i18n.t(`${i18nHeader}:datatypes.legend`)}
                                </p>
                            </div>
                            {dataType.id !== "by-types" ? (
                                <MatrixBubblesChart
                                    data={dataType.data}
                                    bubbleColor={dataType.bubbleColor}
                                    textColor={dataType.bubbleTextColor}
                                    strokeColor={dataType.bubbleStroke}
                                />
                            ) : (
                                <div className="by-types-bubble-chart">
                                    <PolyChart
                                        type="bubble-cluster"
                                        data={dataType.data[0].bubbles}
                                        width={dataType.data[0].width}
                                        height={dataType.data[0].height}
                                        bubbleColor={dataType.bubbleColor}
                                        textColor={dataType.data[0].bubbles.map(
                                            (bubble) => {
                                                selectedDataTypeBubble ===
                                                bubble.value
                                                    ? dataType.activeBubbleTextColor
                                                    : dataType.bubbleTextColor;
                                            }
                                        )}
                                        strokeColor={dataType.bubbleStroke}
                                        onBubbleClick={handleBubbleClick}
                                    />
                                    <h4>{dataType.data[0].title}</h4>
                                </div>
                            )}
                        </Tab>
                    );
                })}
            </Tabs>
            <p className="source">{i18n.t("common:source")}: PolyPedia</p>
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
        </ClusterStory>
    );
};

export default MessengerStory;
