import React, { useContext } from "react";

import ClusterStory from "../../components/clusterStory/clusterStory.jsx";
import { ExplorerContext } from "../../context/explorer-context.jsx";
import i18n from "../../i18n.js";
import SectionTitle from "../../components/clusterStories/sectionTitle.jsx";
import DataTypes from "../../components/clusterStories/dataTypes.jsx";
import Purposes from "../../components/clusterStories/purposes.jsx";
import ReceivingCompanies from "../../components/clusterStories/receivingCompanies.jsx";
import EntityList from "../../components/entityList/entityList.jsx";
import OverviewBarChart from "../../components/clusterStories/overviewBarChart.jsx";
import OrderedList from "../../components/orderedList/orderedList.jsx";
import { createJurisdictionLinks } from "./story-utils";
import EmbeddedSankey from "../../components/embeddedSankey/embeddedSankey.jsx";
import SourceInfoButton from "../../components/sourceInfoButton/sourceInfoButton.jsx";
import GradientCircleList from "../../components/gradientCircleList/gradientCircleList.jsx";

import MessengerTreeMap from "../../components/clusterStories/messengerTreeMap.jsx";
import LinkButton from "../../components/buttons/linkButton/linkButton.jsx";
import MessengerMauChart from "../../components/clusterStories/messengerMauChart.jsx";

const i18nHeader = "clusterMessengerStory";
const i18nHeaderCommon = "clusterStoryCommon";

const primaryColor = "#3ba6ff";

const MessengerStory = () => {
    const {
        products,
        entityJurisdictionByPpid,
        entityObjectByPpid,
        createPopUp,
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

    const messengers = Object.values(products).filter((p) => {
        p.clusters.indexOf("messenger") !== -1;
        p["simpleName"] = p.ppid;
        return p;
    });

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
                infoScreen="overview-bar-chart-info"
                source={i18n.t("common:source.polyPedia")}
            />
            <SectionTitle
                title={i18n.t(`${i18nHeader}:details.section`)}
            ></SectionTitle>
            <p className="big-first-letter">
                {i18n.t(`${i18nHeader}:details.p.1`)}
            </p>
            <h2 className="cluster-story-title">
                {i18n.t(`${i18nHeader}:details.is.safe.title`)}
            </h2>
            <p>{i18n.t(`${i18nHeader}:details.is.safe.p1`)}</p>
            <p>{i18n.t(`${i18nHeader}:details.is.safe.p2`)}</p>
            <p>{i18n.t(`${i18nHeader}:details.is.safe.p3`)}</p>
            <MessengerMauChart
                messengers={messengers}
                i18nHeader={i18nHeader}
            />
            <SourceInfoButton
                infoScreen="details-line-chart-info"
                source={i18n.t("common:source.polyPedia")}
            />
            <h2 className="cluster-story-title">
                {i18n.t(`${i18nHeader}:details.what.deal.title`)}
            </h2>
            <p>{i18n.t(`${i18nHeader}:details.what.deal.p1`)}</p>
            <p>{i18n.t(`${i18nHeader}:details.what.deal.p2`)}</p>
            <MessengerTreeMap
                messengers={Object.values(products)}
                i18nHeader={i18nHeader}
            />
            <SourceInfoButton
                infoScreen="details-treemap-info"
                source={i18n.t("common:source.polyPedia")}
            />
            <h2 className="cluster-story-title">
                {i18n.t(`${i18nHeader}:details.what.data.title`)}
            </h2>
            <p>{i18n.t(`${i18nHeader}:details.what.data.p1`)}</p>
            <SectionTitle
                title={i18n.t(`${i18nHeaderCommon}:section.dataTypes`)}
            />
            <div
                className="big-first-letter"
                dangerouslySetInnerHTML={{
                    __html: i18n.t(`${i18nHeader}:data.types.p`),
                }}
            />
            <DataTypes entities={messengers} i18nHeader={i18nHeader} />
            <SectionTitle
                title={i18n.t(`${i18nHeaderCommon}:section.purposes`)}
            />
            <p className="big-first-letter">
                {i18n.t(`${i18nHeaderCommon}:purposes.p`)}
            </p>
            <Purposes companies={messengers} createPopUp={createPopUp} />
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
