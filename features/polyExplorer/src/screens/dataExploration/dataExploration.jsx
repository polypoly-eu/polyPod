import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import i18n from "../../i18n.js";
import Screen from "../../components/screen/screen.jsx";
import DataTypeBubbles from "../../components/dataViz/dataTypeBubbles.jsx";
import DataTypeBubbleCategory from "../../components/dataViz/dataTypeBubbleCategory.jsx";
import CompanyShortInfo from "../../components/companyShortInfo/companyShortInfo.jsx";
import DataSharingLegend from "../../components/dataSharingLegend/dataSharingLegend.jsx";

import "swiper/swiper-bundle.min.css";
import "./dataExploration.css";

const DataExplorationScreen = ({ company }) => {
    const [swiper, setSwiper] = useState(null);
    const [activeSection] = useState("dataTypes");
    const [activeIndex, setActiveIndex] = useState(0);

    const getHighestValueObject = () => {
        let highest = { count: 0 };
        company.dataTypesShared.forEach((e) =>
            e.count > highest.count ? (highest = e) : null
        );
        return highest;
    };

    const getCategories = () => {
        const categories = [];
        company.dataTypesShared.forEach((e) => {
            categories.includes(e.Polypoly_Parent_Category)
                ? null
                : categories.push(e.Polypoly_Parent_Category);
        });
        return categories;
    };

    const highestValueObject = getHighestValueObject();
    const categories = getCategories();

    const progressBar = (
        <div className="progress-bar">
            <div
                className={`progress-bar-part dataTypes ${
                    activeSection == "dataTypes" ? "active" : ""
                }`}
            ></div>
            <div
                className={`progress-bar-part purposes ${
                    activeSection == "purposes" ? "active" : ""
                }`}
            ></div>
            <div
                className={`progress-bar-part companiesShared ${
                    activeSection == "companies" ? "active" : ""
                }`}
            ></div>
            <div
                className={`progress-bar-part jurisdictions ${
                    activeSection == "jurisdictions" ? "active" : ""
                }`}
            ></div>
        </div>
    );

    const getHeading = () => {
        if (activeIndex < 3)
            return (
                <h1>
                    {i18n.t("common:sharing.detailPrefix.dataTypes")}{" "}
                    <span className="highlight">
                        {company.dataTypesShared.length}{" "}
                        {i18n.t("common:sharing.dataTypes")}
                    </span>
                </h1>
            );
        else return <h1></h1>;
    };

    const getChartForSlide = () => {
        if (activeIndex == 0)
            return (
                <DataTypeBubbles
                    data={company.dataTypesShared}
                    bubbleColor="#FB8A89"
                    textColor="#0f1938"
                    width="360"
                    height="360"
                />
            );
        else if (activeIndex > 0 && activeIndex <= 2)
            return (
                <DataTypeBubbles
                    data={company.dataTypesShared}
                    bubbleColor="#FB8A89"
                    textColor="#0f1938"
                    width="360"
                    height="360"
                    opacity={0.2}
                />
            );
        else if (activeIndex > 2 && activeIndex <= categories.length + 2)
            return (
                <DataTypeBubbleCategory
                    data={company.dataTypesShared}
                    defaultColor="#FB8A89"
                    category={categories[activeIndex - 3]}
                    textColor="#0f1938"
                    width="360"
                    height="360"
                />
            );
    };

    return (
        <Screen className="data-exploration">
            <div className="company-short-info-container">
                <CompanyShortInfo company={company} />
            </div>
            {progressBar}
            <div className="exploration-content">
                <div className="static-content">
                    {getHeading()}
                    {getChartForSlide()}
                    <p className="source">
                        {i18n.t("common:source")}: polyPedia
                    </p>
                    <DataSharingLegend onClick={() => {}} />
                    <button
                        className="down-button"
                        style={{ fontSize: "20px", color: "black" }}
                        onClick={() => swiper.slideNext()}
                    ></button>
                </div>
                <div className="swipable-content">
                    <Swiper
                        onSwiper={setSwiper}
                        direction="vertical"
                        onSlideChange={(swiper) =>
                            setActiveIndex(swiper.activeIndex)
                        }
                    >
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
                        {categories.map((group) => (
                            <SwiperSlide
                                key={group}
                                onClick={() => swiper.slideNext()}
                            >
                                <h2>
                                    {group == undefined
                                        ? i18n.t(
                                              "dataExplorationScreen:dataTypes.without-category"
                                          )
                                        : group}
                                </h2>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </Screen>
    );
};

export default DataExplorationScreen;
