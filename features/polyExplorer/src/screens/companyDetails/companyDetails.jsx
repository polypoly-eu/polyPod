import React from "react";
import i18n from "../../i18n.js";
import Screen from "../../components/screen/screen.jsx";
import CompanyRevenueChart from "./companyRevenueChart/companyRevenueChart.jsx";
import JurisdictionLegend from "../../components/jurisdictionLegend/jurisdictionLegend.jsx";
import "./companyDetails.css";

const CompanyDetails = ({ company }) => {
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

    const tabContent = [
        {
            tabName: "about",
            content: (
                <div className="location-map">
                    <h2>{i18n.t("companyDetailsScreen:jurisdiction")}</h2>
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
                            </div>
                        </div>
                    )}
                    <JurisdictionLegend />
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
    ];

    const featuredTabContent = [
        {
            tabName: "dataStory",
            content: (
                <div className="revenue">
                    <div className="separator"></div>
                    <br />
                    <h2>{i18n.t("companyDetailsScreen:tab.revenue")}</h2>
                    <CompanyRevenueChart
                        annualRevenues={company.annualRevenues}
                    />
                </div>
            ),
        },
        {
            tabName: "about",
            content: (
                <div className="featured-map-container">
                    <h2>{i18n.t("companyDetailsScreen:jurisdiction")}</h2>
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
                                        "companyDetailsScreen:location.fallbackText"
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                    <JurisdictionLegend />
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
                <div className="revenue">
                    <div className="separator"></div>
                    <br />
                    <h2>{i18n.t("companyDetailsScreen:tab.revenue")}</h2>
                    <CompanyRevenueChart
                        annualRevenues={company.annualRevenues}
                    />
                </div>
            ),
        },
    ];

    return (
        <div className="explorer-container">
            <div className="top-shadow"></div>
            <Screen className="company-details-screen">
                <p
                    className="company-details-text"
                    dangerouslySetInnerHTML={{
                        __html:
                            (
                                (company.description?.value || {})[
                                    i18n.language
                                ] || ""
                            ).replace("\n", "<br/><br/>") ||
                            i18n.t("companyDetailsScreen:description.fallback"),
                    }}
                ></p>

                {company.description?.source ? (
                    <p className="company-details-source">
                        {i18n.t("companyDetailsScreen:source")}:{" "}
                        {company.description.source}
                    </p>
                ) : null}
                <div className="tab-content-container">
                    {company.featured
                        ? featuredTabContent.map((tab, index) => (
                              <div key={index}> {tab.content} </div>
                          ))
                        : tabContent.map((tab, index) => (
                              <div key={index}> {tab.content} </div>
                          ))}
                </div>
            </Screen>
        </div>
    );
};

export default CompanyDetails;
