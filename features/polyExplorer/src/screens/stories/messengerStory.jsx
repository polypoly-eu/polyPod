import React, { useContext } from "react";

import ClusterStory from "../../components/clusterStory/clusterStory.jsx";
import { ExplorerContext } from "../../context/explorer-context.jsx";
import i18n from "../../i18n.js";
import SectionTitle from "../../components/clusterStories/sectionTitle.jsx";
import ReceivingCompanies from "../../components/clusterStories/receivingCompanies.jsx";
import OrderedList from "../../components/orderedList/orderedList.jsx";
import EntityList from "../../components/entityList/entityList.jsx";

const i18nHeader = "clusterMessengerStory";
const i18nHeaderCommon = "clusterStoryCommon";

const MessengerStory = () => {
    const { products } = useContext(ExplorerContext);

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
            <ReceivingCompanies entities={Object.values(products)} />
            <SectionTitle
                title={i18n.t(`${i18nHeader}:tips.section`)}
            />
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
