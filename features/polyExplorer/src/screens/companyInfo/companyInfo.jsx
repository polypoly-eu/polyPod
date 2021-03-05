import React, { useState } from "react";
import i18n from "../../i18n.js";
import CompanyShortInfo from "../../components/companyShortInfo/companyShortInfo.jsx";
import CompanyRevenueChart from "./companyRevenueChart/companyRevenueChart.jsx";
import { Swiper, SwiperSlide } from "swiper/react";
import "./companyInfo.css";

const CompanyInfo = ({ company, onShowScreenChange }) => {
    const [scrolledToBottom, setScrolledToBottom] = useState(false);
    const [initialTab, setInitialTab] = useState(0);
    const [swiper, setSwiper] = useState(null);

    const handleJurisdictionInfo = () => {
        onShowScreenChange("dataRegionInfo");
    };

    const locationTooltip = (
        <div className="location-tooltip">
            <button onClick={() => handleJurisdictionInfo()}>
                <img src="./images/question-circle.svg" />
            </button>
            <p className="jurisdictions-label">
                {i18n.t("companyInfoScreen:jurisdictions")}
            </p>
            <div className="circle EU-GDPR"></div>
            <p>{i18n.t("common:jurisdiction.euGdpr")}</p>
            <div className="circle Russia"></div>
            <p>{i18n.t("common:jurisdiction.russia")}</p>
            <div className="circle Five-Eyes"></div>
            <p>{i18n.t("common:jurisdiction.fiveEyes")}</p>
            <div className="circle China"></div>
            <p>{i18n.t("common:jurisdiction.china")}</p>
            <div className="circle Others"></div>
            <p>{i18n.t("common:jurisdiction.undisclosed")}</p>
        </div>
    );

    const tabTranslation = {
        location: i18n.t("companyInfoScreen:tab.location"),
        structure: i18n.t("companyInfoScreen:tab.structure"),
        revenue: i18n.t("companyInfoScreen:tab.revenue"),
    };
    const tabContent = [
        {
            tabName: "location",
            content: (
                <div>
                    {company.jurisdiction ? (
                        <div
                            className={`location-block ${company.jurisdiction}`}
                        >
                            {company.location ? (
                                <div>
                                    <img
                                        src="./images/location-pin.svg"
                                        alt="location-pin"
                                    />
                                    <p className={`location-text`}>
                                        {company.location.city},{" "}
                                        {company.location.countryCode},{" "}
                                        {company.jurisdiction}
                                    </p>
                                </div>
                            ) : (
                                <div className="no-location">
                                    {i18n.t(
                                        "companyInfoScreen:tab.location.fallbackText"
                                    )}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="location-block Others">
                            <div className="no-location">
                                {i18n.t(
                                    "companyInfoScreen:tab.location.fallbackText"
                                )}
                            </div>
                        </div>
                    )}
                    {locationTooltip}
                </div>
            ),
        },
        {
            tabName: "structure",
            content: (
                <div className="structure-tab">
                    <img src="./images/structure_fallback.svg"></img>
                    <div className="text">
                        <p>
                            {i18n.t(
                                "companyInfoScreen:tab.structure.fallbackText"
                            )}
                        </p>
                    </div>
                </div>
            ),
        },
        {
            tabName: "revenue",
            content: (
                <CompanyRevenueChart annualRevenues={company.annualRevenues} />
            ),
        },
    ];

    const featuredTabContent = [
        {
            tabName: "location",
            content: (
                <div>
                    {company.jurisdiction ? (
                        <div
                            className={`location-block ${company.jurisdiction}`}
                        >
                            {company.location ? (
                                <div>
                                    <img
                                        src="./images/location-pin.svg"
                                        alt="location-pin"
                                    />
                                    <p className={`location-text`}>
                                        {company.location.city},{" "}
                                        {company.location.countryCode},{" "}
                                        {company.jurisdiction}
                                    </p>
                                </div>
                            ) : (
                                <div className="no-location">
                                    {i18n.t(
                                        "companyInfoScreen:tab.location.fallbackText"
                                    )}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="location-block Others">
                            <div className="no-location">
                                {i18n.t(
                                    "companyInfoScreen:tab.location.fallbackText"
                                )}
                            </div>
                        </div>
                    )}
                    {locationTooltip}
                </div>
            ),
        },
        {
            tabName: "structure",
            content: (
                <div className="structure-tab">
                    <img src="./images/structure_fallback.svg" />
                    <p>
                        {i18n.t("companyInfoScreen:tab.structure.fallbackText")}
                    </p>
                </div>
            ),
        },
        {
            tabName: "revenue",
            content: (
                <CompanyRevenueChart annualRevenues={company.annualRevenues} />
            ),
        },
    ];

    const handleInfoTextScrollBottom = (e) => {
        const reachedBottom =
            e.target.scrollHeight - e.target.scrollTop - 2 <=
            e.target.clientHeight;
        if (reachedBottom) {
            setScrolledToBottom(true);
        } else setScrolledToBottom(false);
    };

    // TODO: Use the Screen component
    return (
        <div className="explorer-container">
            <div className="top-shadow"></div>
            <div className="screen-content">
                <div
                    className="scroll-container"
                    onScroll={(e) => handleInfoTextScrollBottom(e)}
                >
                    <div className="short-info">
                        <CompanyShortInfo
                            company={company}
                            onShowScreenChange={() => {}}
                        />
                    </div>
                    <div className="tab-button-container">
                        {company.featured
                            ? featuredTabContent.map((tab, index) => (
                                  <button
                                      key={index}
                                      className={
                                          initialTab === index
                                              ? "tab-button active"
                                              : "tab-button"
                                      }
                                      onClick={() => swiper.slideTo(index)}
                                  >
                                      {tabTranslation[tab.tabName]}
                                  </button>
                              ))
                            : tabContent.map((tab, index) => (
                                  <button
                                      key={index}
                                      className={
                                          initialTab === index
                                              ? "tab-button active"
                                              : "tab-button"
                                      }
                                      onClick={() => swiper.slideTo(index)}
                                  >
                                      {tabTranslation[tab.tabName]}
                                  </button>
                              ))}
                    </div>
                    <div className="tab-content-container">
                        <Swiper
                            onSwiper={setSwiper}
                            spaceBetween={1}
                            slidesPerView={1}
                            initialSlide={initialTab}
                            onSlideChange={(swiper) =>
                                setInitialTab(swiper.activeIndex)
                            }
                        >
                            {company.featured
                                ? featuredTabContent.map((tab, index) => (
                                      <SwiperSlide key={index}>
                                          {tab.content}
                                      </SwiperSlide>
                                  ))
                                : tabContent.map((tab, index) => (
                                      <SwiperSlide key={index}>
                                          {tab.content}
                                      </SwiperSlide>
                                  ))}
                        </Swiper>
                    </div>
                    <p className="company-info-text">
                        Lorem ipsum dolor sit amet, consetetur sadipscing elitr,
                        sed diam nonumy eirmod tempor invidunt ut labore et
                        dolore magna aliquyam erat, sed diam voluptua. At vero
                        eos et accusam et justo duo dolores et ea rebum. Stet
                        clita kasd gubergren, no sea takimata sanctus est Lorem
                        ipsum dolor sit amet. Lorem ipsum dolor sit amet,
                        consetetur sadipscing elitr, sed diam nonumy eirmod
                        tempor invidunt ut labore et dolore magna aliquyam erat,
                        sed diam voluptua. At vero eos et accusam et justo duo
                        dolores et ea rebum. Stet clita kasd gubergren, no sea
                        takimata sanctus est Lorem ipsum dolor sit amet. Lorem
                        ipsum dolor sit amet, consetetur sadipscing elitr, sed
                        diam nonumy eirmod tempor invidunt ut labore et dolore
                        magna aliquyam erat, sed diam voluptua. At vero eos et
                        accusam et justo duo dolores et ea rebum. Stet clita
                        kasd gubergren, no sea takimata sanctus est Lorem ipsum
                        dolor sit amet. Duis autem vel eum iriure dolor in
                        hendrerit in vulputate velit esse molestie consequat,
                        vel illum dolore eu feugiat nulla facilisis at vero eros
                        et accumsan et iusto odio dignissim qui blandit praesent
                        luptatum zzril delenit augue duis dolore te feugait
                        nulla facilisi. Lorem ipsum dolor sit amet,
                    </p>
                    <p className="company-info-source">
                        {i18n.t("companyInfoScreen:source")}: Wikipedia
                    </p>
                </div>
                <div
                    className={
                        scrolledToBottom
                            ? "gradient-box"
                            : "gradient-box gradient"
                    }
                ></div>

                {company.featured ? (
                    <button
                        className="explore-data-btn"
                        onClick={() =>
                            onShowScreenChange("dataExploration", company.name)
                        }
                    >
                        {i18n.t("companyInfoScreen:button.exploreData")}
                    </button>
                ) : (
                    <div></div>
                )}
            </div>
        </div>
    );
};

export default CompanyInfo;
