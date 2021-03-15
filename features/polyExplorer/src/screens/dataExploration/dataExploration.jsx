import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import i18n from "../../i18n.js";
import Screen from "../../components/screen/screen.jsx";
import DataTypeBubbles from "../../components/dataViz/dataTypeBubbles.jsx";
import DataTypeBubbleCategory from "../../components/dataViz/dataTypeBubbleCategory.jsx";
import DataTypeBubbleCorrelation from "../../components/dataViz/dataTypeBubbleCorrelation.jsx";
import PurposeChart from "../../components/dataViz/purposeChart.jsx";
//import CompanyBubbles from "../../components/dataViz/companyBubbles.jsx";
import CompanyShortInfo from "../../components/companyShortInfo/companyShortInfo.jsx";
import DataSharingLegend from "../../components/dataSharingLegend/dataSharingLegend.jsx";

import "swiper/swiper-bundle.min.css";
import "./dataExploration.css";

const DataExplorationScreen = ({ company }) => {
    const [swiper, setSwiper] = useState(null);
    const [activeIndex, setActiveIndex] = useState(0);

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

    const getCategories = () => {
        const categories = [];
        company.dataTypesShared.forEach((e) => {
            categories.includes(e.Polypoly_Parent_Category)
                ? null
                : categories.push(e.Polypoly_Parent_Category);
        });
        return categories;
    };

    const goToSlide = (slide) => {
        swiper.slideTo(slide, 0);
        setActiveIndex(slide);
    };

    const highestValueObject = getHighestValueObject();
    const categories = getCategories();

    const progressBar = (
        <div className="progress-bar">
            <div
                className={`progress-bar-part dataTypes ${
                    activeIndex < categories.length + 6 ? "active" : ""
                }`}
                onClick={() => goToSlide(0)}
            ></div>
            <div
                className={`progress-bar-part purposes ${
                    activeIndex == categories.length + 6 ? "active" : ""
                }`}
                onClick={() => goToSlide(categories.length + 6)}
            ></div>
            <div
                className={`progress-bar-part companiesShared ${
                    activeIndex > categories.length + 7 ? "active" : ""
                }`}
                onClick={() => goToSlide(categories.length + 7)}
            ></div>
            <div
                className={`progress-bar-part jurisdictions ${
                    activeIndex > 100 ? "active" : ""
                }`}
            ></div>
        </div>
    );

    const getHeading = () => {
        if (activeIndex < 3 && activeIndex > 0)
            return (
                <h1>
                    {i18n.t("common:sharing.detailPrefix.dataTypes")}{" "}
                    <span className="highlight">
                        {company.dataTypesShared.length}{" "}
                        {i18n.t("common:sharing.dataTypes")}
                    </span>
                </h1>
            );
        else if (
            activeIndex > categories.length + 3 &&
            activeIndex <= categories.length + 5
        )
            return (
                <h2>
                    {i18n.t(
                        "dataExplorationScreen:dataTypes.heading.correlations"
                    )}
                </h2>
            );
        else return <h1></h1>;
    };

    const getChartForSlide = () => {
        if (activeIndex == 1)
            return (
                <DataTypeBubbles
                    data={company.dataTypesShared}
                    bubbleColor="#FB8A89"
                    textColor="#0f1938"
                    width="360"
                    height="360"
                />
            );
        else if (activeIndex > 1 && activeIndex <= 3)
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
        else if (activeIndex > 3 && activeIndex <= categories.length + 3)
            return (
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
                                categories[activeIndex - 4]
                        )[0]["dpv:Category"]
                    }
                />
            );
        else if (
            activeIndex > categories.length + 3 &&
            activeIndex <= categories.length + 4
        )
            return (
                <DataTypeBubbles
                    data={company.dataTypesShared}
                    bubbleColor="#FB8A89"
                    textColor="#0f1938"
                    width="360"
                    height="360"
                    opacity={0.2}
                    showValues={false}
                />
            );
        else if (activeIndex == categories.length + 5)
            return (
                <DataTypeBubbleCorrelation
                    data={company.dataTypesShared}
                    correlationColor="#FB8A89"
                    typeBundle={correlationTypeBundle}
                    width="360"
                    height="360"
                />
            );
        else if (activeIndex == categories.length + 6)
            return <PurposeChart purposes={company.dataSharingPurposes} />;
        else
            return (
                <div className="construction-container">
                    <p>{i18n.t("dataExplorationScreen:construction.text")}</p>
                    <img src="./images/construction.gif" />
                </div>
            );

        /*
        else if (activeIndex > categories.length + 5)
            return (
                <CompanyBubbles
                    data={company.dataRecipients}
                    width="200"
                    height="200"
                    bubbleColor="#7EE8A2"
                />
            );
            */
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
                    {activeIndex > 0 ? (
                        <p className="source">
                            {i18n.t("common:source")}: polyPedia
                        </p>
                    ) : null}
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
                    </Swiper>
                </div>
            </div>
        </Screen>
    );
};

export default DataExplorationScreen;
