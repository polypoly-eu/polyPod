import React, { useContext, useState } from "react";
import i18n from "../../i18n.js";
import Screen from "../../components/screen/screen.jsx";
import CompanyRevenueChart from "./companyRevenueChart/companyRevenueChart.jsx";
import DataRegionsLegend from "../../components/dataRegionsLegend/dataRegionsLegend.jsx";
import FeaturedEntity from "../../components/featuredEntity/featuredEntity.jsx";
import InfoButton from "../../components/buttons/infoButton/infoButton.jsx";
import LinkButton from "../../components/buttons/linkButton/linkButton.jsx";
import EntityShortInfo from "../../components/entityShortInfo/entityShortInfo.jsx";
import { Swiper, SwiperSlide } from "swiper/react";
import "./entityDetails.css";
import { ExplorerContext } from "../../context/explorer-context.jsx";

const EntityDetails = () => {
    const { selectedEntityObject, entityObjectByPpid } =
        useContext(ExplorerContext);
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

    const availableTabs = {
        company: {
            basicAbout: {
                name: tabTranslation.about,
                content: (
                    <div className="about">
                        <p
                            className="entity-details-text"
                            dangerouslySetInnerHTML={{
                                __html:
                                    (
                                        (entity.description?.value || {})[
                                            i18n.language
                                        ] || ""
                                    ).replaceAll("\n", "<br/><br/>") ||
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
                            <div className="separator-unit">
                                <div className="partial-separator" />
                                <h2>
                                    {i18n.t("entityDetailsScreen:jurisdiction")}
                                </h2>
                                <div className="partial-separator" />
                            </div>

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
                                            <p className={`location-text`}>
                                                {entity.location.city},{" "}
                                                {entity.location.countryCode},{" "}
                                                {entity.jurisdiction}
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
                            {!entity?.annualRevenues ? (
                                <></>
                            ) : (
                                <div className="revenue">
                                    <div className="separator-unit">
                                        <div className="partial-separator" />
                                        <h2>
                                            {i18n.t(
                                                "entityDetailsScreen:revenue"
                                            )}
                                        </h2>
                                        <div className="partial-separator" />
                                    </div>

                                    <CompanyRevenueChart
                                        annualRevenues={entity.annualRevenues}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                ),
            },
            featuredAbout: {
                name: tabTranslation.about,
                content: (
                    <div className="about">
                        <div className="scroll-box">
                            <p
                                className="entity-details-text"
                                dangerouslySetInnerHTML={{
                                    __html:
                                        (
                                            (entity.description?.value || {})[
                                                i18n.language
                                            ] || ""
                                        ).replaceAll("\n", "<br/><br/>") ||
                                        i18n.t(
                                            "entityDetailsScreen:description.fallback"
                                        ),
                                }}
                            ></p>
                        </div>
                        <div className="gradient"></div>
                        {entity.description?.source ? (
                            <p className="entity-details-source">
                                {i18n.t("entityDetailsScreen:source")}:{" "}
                                {entity.description.source}
                            </p>
                        ) : null}
                        <div className="featured-map-container">
                            <div className="separator-unit">
                                <div className="partial-separator" />
                                <h2>
                                    {i18n.t("entityDetailsScreen:jurisdiction")}
                                </h2>
                                <div className="partial-separator" />
                            </div>

                            {entity.jurisdiction ? (
                                <div className={`location-block`}>
                                    {entity.location ? (
                                        <div className="featured-map">
                                            <img
                                                src={`./images/maps/cities/${
                                                    cityImageMap[
                                                        entity.location.city
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
                            {entity?.annualRevenues?.length === 0 ? (
                                <></>
                            ) : (
                                <div className="revenue">
                                    <div className="separator-unit">
                                        <div className="partial-separator" />
                                        <h2>
                                            {i18n.t(
                                                "entityDetailsScreen:revenue"
                                            )}
                                        </h2>
                                        <div className="partial-separator" />
                                    </div>
                                    <CompanyRevenueChart
                                        annualRevenues={entity.annualRevenues}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                ),
            },
            dataStory: {
                name: tabTranslation.dataStory,
                content: (
                    <div className="tab-data-story">
                        <FeaturedEntity />
                        <InfoButton route="featured-entity-info" />
                        <div className="explore-data-btn-area">
                            <LinkButton
                                className="explore-data-btn"
                                route="/data-exploration"
                                stateChange={{
                                    explorationState: {
                                        section: "dataTypes",
                                        index: null,
                                        category: null,
                                    },
                                }}
                            >
                                {i18n.t(
                                    "entityDetailsScreen:button.exploreData"
                                )}
                            </LinkButton>
                        </div>
                    </div>
                ),
            },
            productsOwned: {
                name: tabTranslation.products,
                content: entity.productsOwned ? (
                    <div className="owned-products-tab">
                        {entity.productsOwned.map((productPpid, index) => (
                            <EntityShortInfo
                                key={index}
                                entity={entityObjectByPpid(productPpid)}
                            />
                        ))}
                    </div>
                ) : null,
            },
        },
        product: {
            basicAbout: {
                name: tabTranslation.about,
                content: (
                    <div className="about">
                        <div className="scroll-box">
                            <p
                                className="entity-details-text"
                                dangerouslySetInnerHTML={{
                                    __html:
                                        (
                                            (entity.description?.value || {})[
                                                i18n.language
                                            ] || ""
                                        ).replaceAll("\n", "<br/><br/>") ||
                                        i18n.t(
                                            "entityDetailsScreen:description.fallback"
                                        ),
                                }}
                            ></p>
                        </div>
                        <div className="gradient"></div>
                        {entity.description?.source ? (
                            <p className="entity-details-source">
                                {i18n.t("entityDetailsScreen:source")}:{" "}
                                {entity.description.source}
                            </p>
                        ) : null}
                    </div>
                ),
            },
            featuredAbout: {
                name: tabTranslation.about,
                content: (
                    <div className="about">
                        <p
                            className="entity-details-text"
                            dangerouslySetInnerHTML={{
                                __html:
                                    (
                                        (entity.description?.value || {})[
                                            i18n.language
                                        ] || ""
                                    ).replaceAll("\n", "<br/><br/>") ||
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
            dataStory: {
                name: tabTranslation.dataStory,
                content: (
                    <div className="tab-data-story">
                        <FeaturedEntity />
                        <InfoButton route="featured-entity-info" />
                        <div className="explore-data-btn-area">
                            <LinkButton
                                className="explore-data-btn"
                                route="/data-exploration"
                                stateChange={{
                                    explorationState: {
                                        section: "dataTypes",
                                        index: null,
                                        category: null,
                                    },
                                }}
                            >
                                {i18n.t(
                                    "entityDetailsScreen:button.exploreData"
                                )}
                            </LinkButton>
                        </div>
                    </div>
                ),
            },
            productOwner: {
                name: tabTranslation.parent,
                content: entity.productOwner ? (
                    <div className="owned-products-tab">
                        {entity.productOwner.map((companyPpid, index) => (
                            <EntityShortInfo
                                key={index}
                                entity={entityObjectByPpid(companyPpid)}
                            />
                        ))}
                    </div>
                ) : null,
            },
        },
    };

    const loadTabs = () => {
        const tabs = [];
        if (entity.type == "product") {
            const productTabs = availableTabs.product;
            if (entity.featured) {
                tabs.push(productTabs.dataStory);
                tabs.push(productTabs.featuredAbout);
            } else tabs.push(productTabs.basicAbout);
            if (entity.productOwner) tabs.push(productTabs.productOwner);
        } else if (entity.type == "company") {
            const companyTabs = availableTabs.company;
            if (entity.featured) {
                tabs.push(companyTabs.dataStory);
                tabs.push(companyTabs.featuredAbout);
            } else tabs.push(companyTabs.basicAbout);
            if (entity.productsOwned) tabs.push(companyTabs.productsOwned);
        }
        return tabs;
    };
    return (
        <Screen className="entity-details-screen">
            <div className="details">
                {loadTabs().length > 1 && (
                    <div className="tab-button-container">
                        {loadTabs().map((tab, index) => (
                            <button
                                key={index}
                                className={
                                    initialTab === index
                                        ? "tab-button active"
                                        : "tab-button"
                                }
                                onClick={() => swiper.slideTo(index)}
                            >
                                {tab.name}
                            </button>
                        ))}
                    </div>
                )}
                {loadTabs().length === 1 ? (
                    loadTabs().map((tab, index) => (
                        <div key={index} className="tab-content-container">
                            {" "}
                            {tab.content}
                        </div>
                    ))
                ) : (
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
                            {loadTabs().map((tab, index) => (
                                <SwiperSlide key={index}>
                                    {tab.content}
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                )}
            </div>
        </Screen>
    );
};

export default EntityDetails;
