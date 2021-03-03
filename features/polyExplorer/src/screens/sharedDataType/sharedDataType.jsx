import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import i18n from "../../i18n.js";
import DataTypeBubbles from "../../components/dataViz/dataTypeBubbles.jsx";
import CompanyShortInfo from "../../components/companyShortInfo/companyShortInfo.jsx";
import "swiper/swiper-bundle.min.css";
import "../screen.css";
import "./sharedDataType.css";

const SharedDataTypeScreen = ({ company }) => {
    const [swiper, setSwiper] = useState(null);

    const FakeChart = () => <div className="fake-chart">TODO</div>;

    return (
        <div className="explorer-container">
            <div className="screen-shadow"></div>
            <div className="screen-content shared-data-type">
                <CompanyShortInfo company={company} />
                <h1>
                    {i18n.t("common:sharing.detailPrefix.dataTypes")}{" "}
                    <span className="highlight">
                        {company.dataTypesShared.length}{" "}
                        {i18n.t("common:sharing.dataTypes")}
                    </span>
                </h1>
                <Swiper onSwiper={setSwiper} direction="vertical">
                    <SwiperSlide>
                        <p>
                            {i18n.t("dataExploration:dataTypes.text.intro", {
                                name: "Amazon",
                                sharingCount: 117,
                                mostSharedType: "Foo",
                                mostSharedCount: "13",
                            })}
                        </p>
                        <DataTypeBubbles
                            data={company.dataTypesShared}
                            bubbleColor="#FB8A89"
                            textColor="#0f1938"
                            width="320"
                            height="320"
                        />
                    </SwiperSlide>
                    {["personal", "social", "technical", "financial"].map(
                        (group) => (
                            <SwiperSlide key={group}>
                                <p>
                                    {i18n.t(
                                        "dataExploration:dataTypes.text.grouping"
                                    )}
                                </p>
                                <h2>
                                    {i18n.t(
                                        `dataExploration:dataTypes.title.${group}`
                                    )}
                                </h2>
                                <FakeChart />
                            </SwiperSlide>
                        )
                    )}
                </Swiper>
                <button
                    className="down-button"
                    style={{ fontSize: "20px", color: "black" }}
                    onClick={() => swiper.slideNext()}
                ></button>
            </div>
        </div>
    );
};

export default SharedDataTypeScreen;
