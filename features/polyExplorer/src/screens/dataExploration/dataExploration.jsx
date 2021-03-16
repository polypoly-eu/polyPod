import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import i18n from "../../i18n.js";
import Screen from "../../components/screen/screen.jsx";
import DataTypeBubbles from "../../components/dataViz/dataTypeBubbles.jsx";
import DataTypeBubbleCategory from "../../components/dataViz/dataTypeBubbleCategory.jsx";
import DataTypeBubbleCorrelation from "../../components/dataViz/dataTypeBubbleCorrelation.jsx";
import PurposeChart from "../../components/dataViz/purposeChart.jsx";
import CompanyBubbles from "../../components/dataViz/companyBubbles.jsx";
import CompanyShortInfo from "../../components/companyShortInfo/companyShortInfo.jsx";
import DataSharingLegend from "../../components/dataSharingLegend/dataSharingLegend.jsx";

import "swiper/swiper-bundle.min.css";
import "./dataExploration.css";

const DataExplorationScreen = ({ company }) => {
    const [swiper, setSwiper] = useState(null);
    const [activeIndex, setActiveIndex] = useState(0);
    let slidePointerEvents = true;

    const getCategories = () => {
        const categories = [];
        company.dataTypesShared.forEach((e) => {
            categories.includes(e.Polypoly_Parent_Category)
                ? null
                : categories.push(e.Polypoly_Parent_Category);
        });
        return categories;
    };

    const getScreens = () => {
        const screens = [
            "construction",
            "dataTypesStart",
            "dataTypesUnderText",
            "dataTypesUnderText",
        ];
        Object.keys(categories).forEach((c) => {
            screens.push(`dataTypesCategory${c}`);
        });
        screens.push("dataTypesUnderTextNoNumbers");
        screens.push("dataTypesCorrelation");
        screens.push("purposesStart");
        screens.push("companiesStart");
        return screens;
    };

    //To go soon
    const correlationTypeBundle = [];
    for (let i = 0; i < 9; i += 3) {
        correlationTypeBundle.push(company.dataTypesShared[i]["dpv:Category"]);
    }

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
    const activeScreen = screens[activeIndex];

    const highestValueObject = getHighestValueObject();

    const progressBar = (
        <div className="progress-bar">
            <div
                className={`progress-bar-part dataTypes ${
                    activeScreen.startsWith("dataTypes") ? "active" : ""
                }`}
                onClick={() => goToSlide(screens.indexOf("dataTypesStart"))}
            ></div>
            <div
                className={`progress-bar-part purposes ${
                    activeScreen == "purposesStart" ? "active" : ""
                }`}
                onClick={() => goToSlide(screens.indexOf("purposesStart"))}
            ></div>
            <div
                className={`progress-bar-part companiesShared ${
                    activeScreen.startsWith("companies") ? "active" : ""
                }`}
                onClick={() => goToSlide(screens.indexOf("companiesStart"))}
            ></div>
            <div
                className={`progress-bar-part jurisdictions ${
                    activeScreen.startsWith("jurisdictions") ? "active" : ""
                }`}
                //onClick={() => goToSlide(screens.indexOf("jurisdictionsStart"))}
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
        if (activeScreen === "dataTypesStart")
            return (
                <div className="static-content">
                    <h1>
                        {i18n.t("common:sharing.detailPrefix.dataTypes")}{" "}
                        <span className="highlight">
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
                    <DataSharingLegend onClick={() => {}} />
                    {filler}
                    {button}
                </div>
            );
        else if (activeScreen === "dataTypesUnderText")
            return (
                <div className="static-content">
                    <h1>
                        {i18n.t("common:sharing.detailPrefix.dataTypes")}{" "}
                        <span className="highlight">
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
                    <DataSharingLegend onClick={() => {}} />
                    {filler}
                    {button}
                </div>
            );
        else if (activeScreen === "dataTypesUnderTextNoNumbers")
            return (
                <div className="static-content">
                    <h2 className="highlight">
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
                    <h2 className="highlight">
                        {i18n.t(
                            "dataExplorationScreen:dataTypes.heading.correlations"
                        )}
                    </h2>
                    <DataTypeBubbleCorrelation
                        data={company.dataTypesShared}
                        correlationColor="#FB8A89"
                        typeBundle={company.correlatingDataTypes}
                        width="360"
                        height="360"
                    />
                    <p className="source">
                        {i18n.t("common:source")}: polyPedia
                    </p>
                    <DataSharingLegend onClick={() => {}} />
                    {button}
                </div>
            );
        else if (activeScreen === "purposesStart") {
            slidePointerEvents = false;
            return (
                <div className="static-content">
                    <PurposeChart purposes={company.dataSharingPurposes} />
                    {button}
                </div>
            );
        } else if (activeScreen === "companiesStart")
            return (
                <div className="static-content">
                    <CompanyBubbles
                        data={company.dataRecipients}
                        width="200"
                        height="200"
                        bubbleColor="#7EE8A2"
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
    };

    return (
        <Screen className="data-exploration">
            <div className="company-short-info-container">
                <CompanyShortInfo company={company} />
            </div>
            {progressBar}
            <div className="exploration-content">
                {getStaticContent()}
                <div
                    className={`swipable-content ${
                        slidePointerEvents ? "" : "unswipable"
                    }`}
                >
                    <Swiper
                        onSwiper={setSwiper}
                        direction="vertical"
                        initialSlide={activeIndex}
                        onSlideChange={(swiper) =>
                            setActiveIndex(swiper.activeIndex)
                        }
                    >
                        <SwiperSlide
                            onClick={() => swiper.slideNext()}
                        ></SwiperSlide>
                        <SwiperSlide
                            onClick={() => swiper.slideNext()}
                        ></SwiperSlide>
                        <SwiperSlide onClick={() => swiper.slideNext()}>
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
                        <SwiperSlide onClick={() => swiper.slideNext()}>
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
                        <SwiperSlide onClick={() => swiper.slideNext()}>
                            <p className="on-bubble">
                                {i18n.t(
                                    "dataExplorationScreen:dataTypes.text.correlations"
                                )}
                            </p>
                        </SwiperSlide>
                        <SwiperSlide
                            onClick={() => swiper.slideNext()}
                        ></SwiperSlide>
                        <SwiperSlide
                            onClick={() => swiper.slideNext()}
                        ></SwiperSlide>
                        <SwiperSlide
                            onClick={() => swiper.slideNext()}
                        ></SwiperSlide>
                    </Swiper>
                </div>
            </div>
        </Screen>
    );
};

export default DataExplorationScreen;
