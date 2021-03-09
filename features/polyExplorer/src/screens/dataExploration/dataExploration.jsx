import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import i18n from "../../i18n.js";
import Screen from "../../components/screen/screen.jsx";
import DataTypeBubbles from "../../components/dataViz/dataTypeBubbles.jsx";
import DataTypeBubbleCategory from "../../components/dataViz/dataTypeBubbleCategory.jsx";
import CompanyShortInfo from "../../components/companyShortInfo/companyShortInfo.jsx";

import "swiper/swiper-bundle.min.css";
import "./dataExploration.css";

const DataExplorationScreen = ({ company }) => {
    const [swiper, setSwiper] = useState(null);
    const [activeSection, setActiveSection] = useState("dataTypes");

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

    const highestValueObject = getHighestValueObject();
    const categories = getCategories();

    return (
        <Screen className="data-exploration">
            <div className="company-short-info-margin">
                <CompanyShortInfo company={company} />
            </div>
            {progressBar}
            <Swiper onSwiper={setSwiper} direction="vertical">
                <SwiperSlide>
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
                        width="320"
                        height="320"
                    />
                    <p className="source">
                        {i18n.t("common:source")}: polyPedia
                    </p>
                </SwiperSlide>
                <SwiperSlide>
                    <h1>
                        {i18n.t("common:sharing.detailPrefix.dataTypes")}{" "}
                        <span className="highlight">
                            {company.dataTypesShared.length}{" "}
                            {i18n.t("common:sharing.dataTypes")}
                        </span>
                    </h1>
                    <div className="bubble-chart-overlay">
                        <p>
                            {i18n.t(
                                "dataExplorationScreen:dataTypes.text.intro",
                                {
                                    name: company.name,
                                    sharingCount:
                                        company.dataTypesShared.length,
                                    mostSharedType:
                                        highestValueObject.Translation_DE,
                                    mostSharedCount: highestValueObject.count,
                                }
                            )}
                        </p>
                    </div>
                    <DataTypeBubbles
                        data={company.dataTypesShared}
                        bubbleColor="#FB8A89"
                        textColor="#0f1938"
                        width="320"
                        height="320"
                    />
                    <p className="source">
                        {i18n.t("common:source")}: polyPedia
                    </p>
                </SwiperSlide>
                <SwiperSlide>
                    <h1>
                        {i18n.t("common:sharing.detailPrefix.dataTypes")}{" "}
                        <span className="highlight">
                            {company.dataTypesShared.length}{" "}
                            {i18n.t("common:sharing.dataTypes")}
                        </span>
                    </h1>
                    <div className="bubble-chart-overlay">
                        <p>
                            {i18n.t(
                                "dataExplorationScreen:dataTypes.text.grouping"
                            )}
                        </p>
                    </div>
                    <DataTypeBubbles
                        data={company.dataTypesShared}
                        bubbleColor="#FB8A89"
                        textColor="#0f1938"
                        width="320"
                        height="320"
                    />
                    <p className="source">
                        {i18n.t("common:source")}: polyPedia
                    </p>
                </SwiperSlide>
                {categories.map((group) => (
                    <SwiperSlide key={group}>
                        <h2>
                            {group == undefined
                                ? i18n.t(
                                      "dataExplorationScreen:dataTypes.without-category"
                                  )
                                : group}
                        </h2>
                        <DataTypeBubbleCategory
                            data={company.dataTypesShared}
                            defaultColor="#FB8A89"
                            category={group}
                            textColor="#0f1938"
                            width="320"
                            height="320"
                        />
                        <p className="source">
                            {i18n.t("common:source")}: polyPedia
                        </p>
                    </SwiperSlide>
                ))}
            </Swiper>
            <button
                className="down-button"
                style={{ fontSize: "20px", color: "black" }}
                onClick={() => swiper.slideNext()}
            ></button>
        </Screen>
    );
};

export default DataExplorationScreen;
