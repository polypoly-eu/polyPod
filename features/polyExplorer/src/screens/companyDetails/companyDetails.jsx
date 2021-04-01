import React, { useState } from "react";
import i18n from "../../i18n.js";
import CompanyShortInfo from "../../components/companyShortInfo/companyShortInfo.jsx";
import CompanyRevenueChart from "./companyRevenueChart/companyRevenueChart.jsx";
import JurisdictionLegend from "../../components/jurisdictionLegend/jurisdictionLegend.jsx";
import { Swiper, SwiperSlide } from "swiper/react";
import "./companyDetails.css";

const CompanyDetails = ({ company, onOpenRegionInfo, onOpenExploration }) => {
    const [scrolledToBottom, setScrolledToBottom] = useState(false);
    const [initialTab, setInitialTab] = useState(0);
    const [swiper, setSwiper] = useState(null);

    const cityImageMap = {
        München: "munich",
        "Mountain View": "mountainview",
        Wiesbaden: "wiesbaden",
        Berlin: "berlin",
        Dubai: "dubai",
        Luxembourg: "luxembourg",
        "WILMINGTON, New Castle": "wilmington",
        "WILMINGTON, DELAWARE": "wilmington",
        WILMINGTON: "wilmington",
        Cupertino: "cupertino",
    };

    const tabTranslation = {
        location: i18n.t("companyDetailsScreen:tab.location"),
        structure: i18n.t("companyDetailsScreen:tab.structure"),
        revenue: i18n.t("companyDetailsScreen:tab.revenue"),
    };
    const tabContent = [
        {
            tabName: "location",
            content: (
                <div className="location-map">
                    {company.jurisdiction ? (
                        <div
                            className={`location-block ${company.jurisdiction}`}
                        >
                            {company.location ? (
                                <div>
                                    <img
                                        src="./images/location-pin.svg"
                                        alt="location-pin"
                                        className="pin"
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
                                        "companyDetailsScreen:tab.location.fallbackText"
                                    )}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="location-block Others">
                            <div className="no-location">
                                {i18n.t(
                                    "companyDetailsScreen:tab.location.fallbackText"
                                )}
                            </div>
                        </div>
                    )}
                    <JurisdictionLegend onOpenRegionInfo={onOpenRegionInfo} />
                </div>
            ),
        },
        // We're hiding the structure tab until we have content for it
        /*
        {
            tabName: "structure",
            content: (
                <div className="structure-tab">
                    <img src="./images/structure_fallback.svg"></img>
                    <div className="text">
                        <p>
                            {i18n.t(
                                "companyDetailsScreen:tab.structure.fallbackText"
                            )}
                        </p>
                    </div>
                </div>
            ),
        },
        */
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
                <div className="featured-map-container">
                    {company.jurisdiction ? (
                        <div className={`location-block`}>
                            {company.location ? (
                                <div className="featured-map">
                                    <img
                                        src={`./images/maps/cities/${
                                            cityImageMap[company.location.city]
                                        }.svg`}
                                        className="map"
                                    />
                                    <img
                                        src={`./images/location-pins/${company.jurisdiction}.svg`}
                                        className="featured-pin"
                                    />
                                </div>
                            ) : (
                                <div className="no-location">
                                    {i18n.t(
                                        "companyDetailsScreen:tab.location.fallbackText"
                                    )}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="location-block Others">
                            <div className="no-location">
                                {i18n.t(
                                    "companyDetailsScreen:tab.location.fallbackText"
                                )}
                            </div>
                        </div>
                    )}
                    <JurisdictionLegend onOpenRegionInfo={onOpenRegionInfo} />
                </div>
            ),
        },
        // We're hiding the structure tab until we have content for it
        /*
        {
            tabName: "structure",
            content: (
                <div className="structure-tab">
                    <img src="./images/structure_fallback.svg" />
                    <div className="text">
                        <p>
                            {i18n.t(
                                "companyDetailsScreen:tab.structure.fallbackText"
                            )}
                        </p>
                    </div>
                </div>
            ),
        },
        */
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

            <div className="screen-content company-details-screen">
                <div
                    className="scroll-container"
                    onScroll={(e) => handleInfoTextScrollBottom(e)}
                >
                    <div className="company-short-info-container">
                        <CompanyShortInfo company={company} />
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
                        className="company-details-text"
                        dangerouslySetInnerHTML={{
                            __html:
                                (
                                    (company.description?.value || {})[
                                        i18n.language
                                    ] || ""
                                ).replace("\n", "<br/><br/>") ||
                                i18n.t(
                                    "companyDetailsScreen:description.fallback"
                                ),
                        }}
                    ></p>

                    {company.description?.source ? (
                        <p className="company-details-source">
                            {i18n.t("companyDetailsScreen:source")}:{" "}
                            {company.description.source}
                        </p>
                    ) : null}
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
                        onClick={() => onOpenExploration(company.name)}
                    >
                        {i18n.t("companyDetailsScreen:button.exploreData")}
                    </button>
                ) : (
                    <div></div>
                )}
            </div>
        </div>
    );
};

export default CompanyDetails;
