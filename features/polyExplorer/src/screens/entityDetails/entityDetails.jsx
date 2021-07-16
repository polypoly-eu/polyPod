import React, { useContext, useState } from "react";
import i18n from "../../i18n.js";
import Screen from "../../components/screen/screen.jsx";
import CompanyRevenueChart from "./companyRevenueChart/companyRevenueChart.jsx";
import DataRegionsLegend from "../../components/dataRegionsLegend/dataRegionsLegend.jsx";
import FeaturedEntity from "../../components/featuredEntity/featuredEntity.jsx";
import InfoButton from "../../components/buttons/infoButton/infoButton.jsx";
import { Swiper, SwiperSlide } from "swiper/react";
import "./entityDetails.css";
import { ExplorerContext } from "../../context/explorer-context.jsx";

const EntityDetails = () => {
    const { selectedEntityObject } = useContext(ExplorerContext);
    const entity = selectedEntityObject;
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
        dataStory: i18n.t("entityDetailsScreen:tab.dataStory"),
        about: i18n.t("entityDetailsScreen:tab.about"),
        parent: i18n.t("entityDetailsScreen:tab.parent"),
        products: i18n.t("entityDetailsScreen:tab.products"),
    };

    const tabContent = {
        company: [
            {
                featured: false,
                tabs: [
                    {
                        tabName: "about",
                        content: (
                            <div className="about">
                                <p
                                    className="entity-details-text"
                                    dangerouslySetInnerHTML={{
                                        __html:
                                            (
                                                (entity.description?.value ||
                                                    {})[i18n.language] || ""
                                            ).replace("\n", "<br/><br/>") ||
                                            i18n.t(
                                                "entityDetailsScreen:description.fallback"
                                            ),
                                    }}
                                ></p>
                                {entity.description?.source ? (
                                    <p className="entity-details-source">
                                        {i18n.t("entityDetailsScreen:source")}:{" "}
                                        {entity.description.source}
                                    </p>
                                ) : null}
                                <div className="location-map">
                                    <h2>
                                        {i18n.t(
                                            "entityDetailsScreen:jurisdiction"
                                        )}
                                    </h2>
                                    {entity.jurisdiction ? (
                                        <div
                                            className={`location-block ${entity.jurisdiction}`}
                                        >
                                            {entity.location ? (
                                                <div>
                                                    <img
                                                        src="./images/location-pin.svg"
                                                        alt="location-pin"
                                                        className="pin"
                                                    />
                                                    <p
                                                        className={`location-text`}
                                                    >
                                                        {entity.location.city},{" "}
                                                        {
                                                            entity.location
                                                                .countryCode
                                                        }
                                                        , {entity.jurisdiction}
                                                    </p>
                                                </div>
                                            ) : (
                                                <div className="no-location">
                                                    {i18n.t(
                                                        "entityDetailsScreen:location.fallbackText"
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="location-block Others">
                                            <div className="no-location">
                                                {i18n.t(
                                                    "entityDetailsScreen:location.fallbackText"
                                                )}
                                            </div>
                                        </div>
                                    )}
                                    <DataRegionsLegend />
                                    <div className="revenue">
                                        <div className="separator"></div>
                                        <br />
                                        <h2>
                                            {i18n.t(
                                                "entityDetailsScreen:revenue"
                                            )}
                                        </h2>
                                        <CompanyRevenueChart
                                            annualRevenues={
                                                entity.annualRevenues
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        ),
                    },
                ],
            },
            {
                featured: true,
                tabs: [
                    {
                        tabName: "dataStory",
                        type: "all",
                        content: (
                            <>
                                <FeaturedEntity />
                                <InfoButton
                                    stateChange={{
                                        explorationState: {
                                            section: "dataTypes",
                                            index: null,
                                            category: null,
                                        },
                                    }}
                                    route="/data-exploration"
                                />
                            </>
                        ),
                    },
                    {
                        tabName: "about",
                        content: (
                            <div className="about">
                                <p
                                    className="entity-details-text"
                                    dangerouslySetInnerHTML={{
                                        __html:
                                            (
                                                (entity.description?.value ||
                                                    {})[i18n.language] || ""
                                            ).replace("\n", "<br/><br/>") ||
                                            i18n.t(
                                                "entityDetailsScreen:description.fallback"
                                            ),
                                    }}
                                ></p>
                                {entity.description?.source ? (
                                    <p className="entity-details-source">
                                        {i18n.t("entityDetailsScreen:source")}:{" "}
                                        {entity.description.source}
                                    </p>
                                ) : null}
                                <div className="featured-map-container">
                                    <h2>
                                        {i18n.t(
                                            "entityDetailsScreen:jurisdiction"
                                        )}
                                    </h2>
                                    {entity.jurisdiction ? (
                                        <div className={`location-block`}>
                                            {entity.location ? (
                                                <div className="featured-map">
                                                    <img
                                                        src={`./images/maps/cities/${
                                                            cityImageMap[
                                                                entity.location
                                                                    .city
                                                            ]
                                                        }.svg`}
                                                        className="map"
                                                    />
                                                    <img
                                                        src={`./images/location-pins/${entity.jurisdiction}.svg`}
                                                        className="featured-pin"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="no-location">
                                                    {i18n.t(
                                                        "entityDetailsScreen:location.fallbackText"
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="location-block Others">
                                            <div className="no-location">
                                                {i18n.t(
                                                    "entityDetailsScreen:location.fallbackText"
                                                )}
                                            </div>
                                        </div>
                                    )}
                                    <DataRegionsLegend />
                                    <div className="revenue">
                                        <div className="separator"></div>
                                        <br />
                                        <h2>
                                            {i18n.t(
                                                "entityDetailsScreen:revenue"
                                            )}
                                        </h2>
                                        <CompanyRevenueChart
                                            annualRevenues={
                                                entity.annualRevenues
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        ),
                    },
                ],
            },
        ],
        product: [
            {
                featured: false,
                tabs: [
                    {
                        tabName: "about",
                        content: (
                            <div className="about">
                                <p
                                    className="entity-details-text"
                                    dangerouslySetInnerHTML={{
                                        __html:
                                            (
                                                (entity.description?.value ||
                                                    {})[i18n.language] || ""
                                            ).replace("\n", "<br/><br/>") ||
                                            i18n.t(
                                                "entityDetailsScreen:description.fallback"
                                            ),
                                    }}
                                ></p>
                                {entity.description?.source ? (
                                    <p className="entity-details-source">
                                        {i18n.t("entityDetailsScreen:source")}:{" "}
                                        {entity.description.source}
                                    </p>
                                ) : null}
                            </div>
                        ),
                    },
                ],
            },
            {
                featured: true,
                tabs: [
                    {
                        tabName: "dataStory",
                        type: "all",
                        content: (
                            <>
                                <FeaturedEntity />
                                <InfoButton
                                    stateChange={{
                                        explorationState: {
                                            section: "dataTypes",
                                            index: null,
                                            category: null,
                                        },
                                    }}
                                    route="/data-exploration"
                                />
                            </>
                        ),
                    },
                    {
                        tabName: "about",
                        content: (
                            <div className="about">
                                <p
                                    className="entity-details-text"
                                    dangerouslySetInnerHTML={{
                                        __html:
                                            (
                                                (entity.description?.value ||
                                                    {})[i18n.language] || ""
                                            ).replace("\n", "<br/><br/>") ||
                                            i18n.t(
                                                "entityDetailsScreen:description.fallback"
                                            ),
                                    }}
                                ></p>
                                {entity.description?.source ? (
                                    <p className="entity-details-source">
                                        {i18n.t("entityDetailsScreen:source")}:{" "}
                                        {entity.description.source}
                                    </p>
                                ) : null}
                            </div>
                        ),
                    },
                ],
            },
        ],
    };

    return (
        <Screen className="entity-details-screen">
            <div className="details">
                <div className="tab-button-container">
                    {tabContent[entity.type]
                        .find(
                            (content) => !!content.featured == !!entity.featured
                        )
                        .tabs.map((tab, index) => (
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
                        {tabContent[entity.type]
                            .find(
                                (content) =>
                                    !!content.featured == !!entity.featured
                            )
                            .tabs.map((tab, index) => (
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

export default EntityDetails;
