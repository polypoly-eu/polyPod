import React, { useState } from "react";
import i18n from "../../../i18n.js";
import CompanyShortInfo from "../../companyShortInfo/companyShortInfo.jsx";
//import CompanyRevenueChart from "./companyRevenueChart/companyRevenueChart.jsx";
import { Swiper, SwiperSlide } from "swiper/react";
import "./companyInfo.css";

const CompanyInfo = ({ company }) => {
    const [scrolledToBottom, setScrolledToBottom] = useState(false);
    const [initialTab, setInitialTab] = useState(0);
    const [swiper, setSwiper] = useState(null);

    const handleJurisdictionInfo = () => {
        console.log("Nothing is done here yet!");
    };

    const locationTooltip = (
        <div className="location-tooltip">
            <button onClick={() => handleJurisdictionInfo()}>
                <img src="./images/question-circle.svg" />
            </button>
            <p>{i18n.t("companyInfoScreen:jurisdictions")}</p>
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
                    <div className={`location-block ${company.jurisdiction}`}>
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
                    {locationTooltip}
                </div>
            ),
        },
        {
            tabName: "structure",
            content: null,
        },
        {
            tabName: "revenue",
            content: (
                <div>
                    {(company.annualRevenues || []).map(({ year, amount }) => (
                        <div key={year}>
                            {year}: {amount}
                        </div>
                    ))}
                </div>
            ),
        },
    ];

    const featuredTabContent = [
        {
            tabName: "location",
            content: (
                <div>
                    <div className={"location-block"}></div>
                    {locationTooltip}
                </div>
            ),
        },
        {
            tabName: "structure",
            content: null,
        },
        {
            tabName: "revenue",
            content: (
                <div>
                    {(company.annualRevenues || []).map(({ year, amount }) => (
                        <div key={year}>
                            {year}: {amount}
                        </div>
                    ))}
                </div>
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

    return (
        <div className="explorer-container">
            <div className="screen-shadow"></div>
            <div className="screen-content">
                <div className="scroll-container">
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
                    <p
                        className="company-info-text"
                        onScroll={(e) => handleInfoTextScrollBottom(e)}
                    >
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
                </div>
                <div
                    className={
                        scrolledToBottom
                            ? "gradient-box"
                            : "gradient-box gradient"
                    }
                ></div>
                <p className="company-info-source">
                    {i18n.t("companyInfoScreen:source")}: Wikipedia
                </p>

                {company.featured ? (
                    <button className="explore-data-btn">
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
