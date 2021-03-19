import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import i18n from "../../i18n.js";
import Screen from "../../components/screen/screen.jsx";
import DataTypeBubbles from "../../components/dataViz/dataTypeBubbles.jsx";
import DataTypeBubbleCategory from "../../components/dataViz/dataTypeBubbleCategory.jsx";
import DataTypeBubbleCorrelation from "../../components/dataViz/dataTypeBubbleCorrelation.jsx";
import PurposeChart from "../../components/dataViz/purposeChart.jsx";
import CompanyBubbles from "../../components/dataViz/companyBubbles.jsx";
import JurisdictionTree from "../../components/dataViz/jurisdictionTree.jsx";
import CompanyShortInfo from "../../components/companyShortInfo/companyShortInfo.jsx";
import DataSharingLegend from "../../components/dataSharingLegend/dataSharingLegend.jsx";
import PurposeInfoPopup from "../../components/purposeInfoPopup/purposeInfoPopup.jsx";

import highlights from "../../data/highlights.js";

import "swiper/swiper-bundle.min.css";
import "./dataExploration.css";

const DataExplorationScreen = ({
    company,
    startSection,
    openDataTypesInfo,
    openCategoryInfo,
    openCorrelationInfo,
    openPurposeInfo,
    openCompaniesInfo,
    maxCompanies,
    dataRecipients,
}) => {
    //Methods
    const getCategories = () => {
        const categories = [];
        company.dataTypesShared.forEach((e) => {
            categories.includes(e.Polypoly_Parent_Category)
                ? null
                : categories.push(e.Polypoly_Parent_Category);
        });
        return categories;
    };

    const getJurisdictionTreeFormat = () => {
        const jurisdictionTreeFormatData = { name: "World", children: [] };
        dataRecipients.forEach((e) => {
            let jurisdiction = jurisdictionTreeFormatData.children.find(
                (j) => j.name === e.jurisdiction
            );
            if (jurisdiction !== undefined) {
                let country = jurisdiction.children.find(
                    (c) => c.name === e.location.countryCode
                );
                if (country !== undefined) country.value++;
                else
                    jurisdiction.children.push({
                        name: e.location.countryCode,
                        value: 1,
                        category: e.jurisdiction,
                    });
            } else {
                jurisdictionTreeFormatData.children.push({
                    name: e.jurisdiction,
                    children: [
                        {
                            name: e.location.countryCode,
                            value: 1,
                            category: e.jurisdiction,
                        },
                    ],
                });
            }
        });
        return jurisdictionTreeFormatData;
    };

    const getScreens = () => {
        const screens = [
            "construction",
            "dataTypes",
            "dataTypesUnderText",
            "dataTypesCategory",
        ];
        Object.keys(categories).forEach((c) => {
            screens.push(`dataTypesCategory${c}`);
        });
        screens.push("dataTypesUnderTextNoNumbers");
        screens.push("dataTypesCorrelation");
        screens.push("purposes");
        screens.push("companies");
        screens.push("companiesExplanation");
        screens.push("companiesIndustries");
        screens.push("jurisdictions");
        return screens;
    };

    const getHighestValueObject = () => {
        let highest = { count: 0 };
        company.dataTypesShared.forEach((e) =>
            e.count > highest.count ? (highest = e) : null
        );
        return highest;
    };

    const goToSlide = (slide) => {
        swiper.slideTo(slide, 0);
        setActiveIndex(slide);
    };

    //Navigation
    const categories = getCategories();
    const screens = getScreens();

    //State
    const [swiper, setSwiper] = useState(null);
    const [activeIndex, setActiveIndex] = useState(
        screens.indexOf(startSection)
    );
    const [showPurposePopup, setShowPurposePopup] = useState(null);

    //Constants
    const activeScreen = screens[activeIndex];
    const highestValueObject = getHighestValueObject();
    const jurisdictionTreeFormatData = getJurisdictionTreeFormat();

    const progressBar = (
        <div className="progress-bar">
            <div
                className={`progress-bar-part dataTypes ${
                    activeScreen.startsWith("dataTypes") ? "active" : ""
                }`}
                onClick={() => goToSlide(screens.indexOf("dataTypes"))}
            ></div>
            <div
                className={`progress-bar-part purposes ${
                    activeScreen == "purposes" ? "active" : ""
                }`}
                onClick={() => goToSlide(screens.indexOf("purposes"))}
            ></div>
            <div
                className={`progress-bar-part companiesShared ${
                    activeScreen.startsWith("companies") ? "active" : ""
                }`}
                onClick={() => goToSlide(screens.indexOf("companies"))}
            ></div>
            <div
                className={`progress-bar-part jurisdictions ${
                    activeScreen.startsWith("jurisdictions") ? "active" : ""
                }`}
                onClick={() => goToSlide(screens.indexOf("jurisdictions"))}
            ></div>
        </div>
    );

    const getStaticContent = () => {
        const button = (
            <button
                className="down-button"
                style={{ fontSize: "20px", color: "black" }}
                onClick={() => swiper.slideNext()}
            ></button>
        );
        const filler = <div className="filler"></div>;
        if (activeScreen === "dataTypes")
            return (
                <div className="static-content">
                    <h1>
                        {i18n.t("common:sharing.detailPrefix.dataTypes")}{" "}
                        <span className="highlight-data-type">
                            {company.dataTypesShared.length}{" "}
                            {i18n.t("common:sharing.dataTypes")}
                        </span>
                    </h1>
                    <DataTypeBubbles
                        data={company.dataTypesShared}
                        bubbleColor="#FB8A89"
                        textColor="#0f1938"
                        width="360"
                        height="360"
                    />
                    <p className="source">
                        {i18n.t("common:source")}: polyPedia
                    </p>
                    <DataSharingLegend
                        onClick={() => {
                            openDataTypesInfo();
                        }}
                    />
                    {filler}
                    {button}
                </div>
            );
        else if (
            activeScreen === "dataTypesUnderText" ||
            activeScreen === "dataTypesCategory"
        )
            return (
                <div className="static-content">
                    <h1>
                        {i18n.t("common:sharing.detailPrefix.dataTypes")}{" "}
                        <span className="highlight-data-type">
                            {company.dataTypesShared.length}{" "}
                            {i18n.t("common:sharing.dataTypes")}
                        </span>
                    </h1>
                    <DataTypeBubbles
                        data={company.dataTypesShared}
                        bubbleColor="#FB8A89"
                        textColor="#0f1938"
                        width="360"
                        height="360"
                        opacity={0.2}
                    />
                    <p className="source">
                        {i18n.t("common:source")}: polyPedia
                    </p>
                    <div className="data-sharing-legend-fill"></div>
                    {filler}
                    {button}
                </div>
            );
        else if (activeScreen.startsWith("dataTypesCategory"))
            return (
                <div className="static-content">
                    <h1></h1>
                    <DataTypeBubbleCategory
                        data={company.dataTypesShared}
                        defaultColor="#FB8A89"
                        category={categories[activeIndex - 4]}
                        textColor="#0f1938"
                        width="360"
                        height="360"
                        highlightedType={
                            company.dataTypesShared.filter(
                                (e) =>
                                    e.Polypoly_Parent_Category ===
                                    categories[parseInt(activeScreen.slice(-1))]
                            )[0]["dpv:Category"]
                        }
                    />
                    <p className="source">
                        {i18n.t("common:source")}: polyPedia
                    </p>
                    <DataSharingLegend
                        onClick={() => {
                            openCategoryInfo();
                        }}
                    />
                    {filler}
                    {button}
                </div>
            );
        else if (activeScreen === "dataTypesUnderTextNoNumbers")
            return (
                <div className="static-content">
                    <h2 className="highlight-data-type">
                        {i18n.t(
                            "dataExplorationScreen:dataTypes.heading.correlations"
                        )}
                    </h2>
                    <DataTypeBubbles
                        data={company.dataTypesShared}
                        bubbleColor="#FB8A89"
                        textColor="#0f1938"
                        width="360"
                        height="360"
                        opacity={0.2}
                        showValues={false}
                    />
                    <p className="source">
                        {i18n.t("common:source")}: polyPedia
                    </p>
                    <div className="data-sharing-legend-fill"></div>
                    {button}
                </div>
            );
        else if (activeScreen === "dataTypesCorrelation")
            return (
                <div className="static-content">
                    <h2 className="highlight-data-type">
                        {i18n.t(
                            "dataExplorationScreen:dataTypes.heading.correlations"
                        )}
                    </h2>
                    <DataTypeBubbleCorrelation
                        data={company.dataTypesShared}
                        correlationColor="#FB8A89"
                        typeBundle={
                            highlights[company.name].correlatingDataTypes
                        }
                        width="360"
                        height="360"
                    />
                    <p className="source">
                        {i18n.t("common:source")}: polyPedia
                    </p>
                    <DataSharingLegend
                        onClick={() => {
                            openCorrelationInfo();
                        }}
                    />
                    {button}
                </div>
            );
        else if (activeScreen === "purposes")
            return (
                <div className="static-content">
                    <h1>
                        {i18n.t("common:sharing.prefix.purposes")}{" "}
                        <span className="highlight-purpose">
                            {company.dataSharingPurposes.length}{" "}
                            {i18n.t("common:sharing.purposes")}
                        </span>
                    </h1>
                    <PurposeChart
                        purposes={company.dataSharingPurposes}
                        openPopup={setShowPurposePopup}
                        openPurposeInfo={openPurposeInfo}
                    />
                    {button}
                </div>
            );
        else if (activeScreen === "companies")
            return (
                <div className="static-content">
                    <h1>
                        {i18n.t("common:sharing.prefix.companies")}{" "}
                        <span className="highlight-companies">
                            {dataRecipients.length}{" "}
                            {i18n.t("common:sharing.companies")}
                        </span>
                    </h1>
                    <CompanyBubbles
                        view="flat"
                        data={dataRecipients}
                        width="360"
                        height="360"
                        bubbleColor="#7EE8A2"
                        maxCompanies={maxCompanies}
                    />
                    <p className="source">
                        {i18n.t("common:source")}: polyPedia
                    </p>
                    <DataSharingLegend
                        onClick={() => {
                            openCompaniesInfo();
                        }}
                    />
                    {button}
                </div>
            );
        else if (activeScreen === "companiesExplanation")
            return (
                <div className="static-content">
                    <h1>
                        {i18n.t("common:sharing.prefix.companies")}{" "}
                        <span className="highlight-companies">
                            {dataRecipients.length}{" "}
                            {i18n.t("common:sharing.companies")}
                        </span>
                    </h1>
                    <CompanyBubbles
                        view="flat"
                        data={dataRecipients}
                        width="360"
                        height="360"
                        opacity={0.1}
                        bubbleColor="#7EE8A2"
                        maxCompanies={maxCompanies}
                    />
                    <p className="source">
                        {i18n.t("common:source")}: polyPedia
                    </p>
                    <div className="data-sharing-legend-fill"></div>
                    {filler}
                    {button}
                </div>
            );
        else if (activeScreen === "companiesIndustries")
            return (
                <div className="static-content">
                    <h2 className="highlight-companies">
                        {i18n.t(
                            "dataExplorationScreen:companies.heading.industries"
                        )}
                    </h2>
                    <CompanyBubbles
                        view="industries"
                        data={dataRecipients}
                        width="360"
                        height="360"
                        bubbleColor="#7EE8A2"
                        maxCompanies={maxCompanies}
                    />
                    <p className="source">
                        {i18n.t("common:source")}: polyPedia
                    </p>
                    <DataSharingLegend
                        onClick={() => {
                            openCompaniesInfo();
                        }}
                    />
                    {button}
                </div>
            );
        else if (activeScreen === "construction")
            return (
                <div className="static-content">
                    <div className="construction-container">
                        <p>
                            {i18n.t("dataExplorationScreen:construction.text")}
                        </p>
                        <img src="./images/construction.gif" />
                    </div>
                    {button}
                </div>
            );
        else if (activeScreen === "jurisdictions")
            return (
                <div className="static-content">
                    <h1>
                        {i18n.t("common:sharing.prefix.jurisdictions")}{" "}
                        {jurisdictionTreeFormatData.children.length}{" "}
                        {i18n.t("common:sharing.jurisdictions")}
                    </h1>
                    <div className="jurisdiction-tree">
                        <JurisdictionTree
                            data={getJurisdictionTreeFormat()}
                            width="300"
                            height="250"
                            fontSize="16"
                        />
                    </div>
                    <p className="source">
                        {i18n.t("common:source")}: polyPedia
                    </p>
                </div>
            );
    };

    return (
        <Screen className="data-exploration">
            <div className="company-short-info-container">
                <CompanyShortInfo company={company} />
            </div>
            {progressBar}
            <div className="exploration-content">
                {getStaticContent()}
                <div className={`swipable-content`}>
                    <Swiper
                        onSwiper={setSwiper}
                        direction="vertical"
                        initialSlide={activeIndex}
                        onSlideChange={(swiper) =>
                            setActiveIndex(swiper.activeIndex)
                        }
                    >
                        <SwiperSlide></SwiperSlide>
                        <SwiperSlide></SwiperSlide>
                        <SwiperSlide>
                            <p className="on-bubble">
                                {i18n.t(
                                    "dataExplorationScreen:dataTypes.text.intro",
                                    {
                                        name: company.name,
                                        sharingCount:
                                            company.dataTypesShared.length,
                                        mostSharedType:
                                            highestValueObject.Translation_DE,
                                        mostSharedCount:
                                            highestValueObject.count,
                                    }
                                )}
                            </p>
                        </SwiperSlide>
                        <SwiperSlide>
                            <p className="on-bubble">
                                {i18n.t(
                                    "dataExplorationScreen:dataTypes.text.grouping"
                                )}
                            </p>
                        </SwiperSlide>
                        {categories.map((group, index) => (
                            <SwiperSlide
                                key={index}
                                onClick={() => swiper.slideNext()}
                            >
                                <h2>
                                    {group ||
                                        i18n.t(
                                            "dataExplorationScreen:dataTypes.without-category"
                                        )}
                                </h2>
                            </SwiperSlide>
                        ))}
                        <SwiperSlide>
                            <p className="on-bubble">
                                {i18n.t(
                                    "dataExplorationScreen:dataTypes.text.correlations"
                                )}
                            </p>
                        </SwiperSlide>
                        <SwiperSlide></SwiperSlide>
                        <SwiperSlide className="purpose-slide"></SwiperSlide>
                        <SwiperSlide></SwiperSlide>
                        <SwiperSlide>
                            <p className="on-bubble">
                                {i18n.t(
                                    "dataExplorationScreen:companies.text.intro"
                                )}
                            </p>
                        </SwiperSlide>
                        <SwiperSlide></SwiperSlide>
                        <SwiperSlide></SwiperSlide>
                    </Swiper>
                </div>
            </div>
            {showPurposePopup ? (
                <PurposeInfoPopup
                    purpose={showPurposePopup}
                    onClose={() => setShowPurposePopup(null)}
                />
            ) : null}
        </Screen>
    );
};

export default DataExplorationScreen;
