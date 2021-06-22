import React, { useContext, useState } from "react";
import i18n from "../../i18n.js";
import Screen from "../../components/screen/screen.jsx";
import CompanyRevenueChart from "./companyRevenueChart/companyRevenueChart.jsx";
import JurisdictionLegend from "../../components/jurisdictionLegend/jurisdictionLegend.jsx";
import FeaturedCompany from "../../components/featuredCompany/featuredCompany.jsx";
import { Swiper, SwiperSlide } from "swiper/react";
import LinkButton from "../../components/linkButton/linkButton.jsx";
import "./companyDetails.css";
import { ExplorerContext } from "../../context/explorer-context.jsx";

const CompanyDetails = () => {
    const { selectedCompanyObject } = useContext(ExplorerContext);
    const company = selectedCompanyObject;
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
        DUBLIN: "dublin",
    };

    const tabTranslation = {
        dataStory: i18n.t("companyDetailsScreen:tab.dataStory"),
        about: i18n.t("companyDetailsScreen:tab.about"),
        parent: i18n.t("companyDetailsScreen:tab.parent"),
        products: i18n.t("companyDetailsScreen:tab.products"),
    };

    const tabContent = [
        {
            tabName: "about",
            content: (
                <div className="about">
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
                                            "companyDetailsScreen:location.fallbackText"
                                        )}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="location-block Others">
                                <div className="no-location">
                                    {i18n.t(
                                        "companyDetailsScreen:location.fallbackText"
                                    )}
                                </div>
                            </div>
                        )}
                        <JurisdictionLegend />
                        <CompanyRevenueChart
                            annualRevenues={company.annualRevenues}
                        />
                    </div>
                </div>
            ),
        },
    ];

    const featuredTabContent = [
        {
            tabName: "dataStory",
            content: (
                <>
                    <FeaturedCompany />
                    <div className="explore-data-btn-area">
                        <LinkButton
                            className="explore-data-btn"
                            stateChange={{
                                explorationState: {
                                    section: "dataTypes",
                                    index: null,
                                    category: null,
                                },
                            }}
                            route="/data-exploration"
                        >
                            {i18n.t("companyDetailsScreen:button.exploreData")}
                        </LinkButton>
                    </div>
                </>
            ),
        },
        {
            tabName: "about",
            content: (
                <div className="about">
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
                    <div className="featured-map-container">
                        {company.jurisdiction ? (
                            <div className={`location-block`}>
                                {company.location ? (
                                    <div className="featured-map">
                                        <img
                                            src={`./images/maps/cities/${
                                                cityImageMap[
                                                    company.location.city
                                                ]
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
                                            "companyDetailsScreen:location.fallbackText"
                                        )}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="location-block Others">
                                <div className="no-location">
                                    {i18n.t(
                                        "companyDetailsScreen:location.fallbackText"
                                    )}
                                </div>
                            </div>
                        )}
                        <JurisdictionLegend />
                        <CompanyRevenueChart
                            annualRevenues={company.annualRevenues}
                        />
                    </div>
                </div>
            ),
        },
    ];

    return (
        <Screen>
            <div className="details">
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
            </div>
        </Screen>
    );
};

export default CompanyDetails;
