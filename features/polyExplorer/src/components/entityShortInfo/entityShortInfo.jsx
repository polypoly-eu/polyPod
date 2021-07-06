import React from "react";
import i18n from "../../i18n.js";
import "./entityShortInfo.css";
import LinkButton from "../buttons/linkButton/linkButton.jsx";

const EntityShortInfo = ({ entity }) => {
    return (
        <LinkButton
            stateChange={{ selectedEntity: entity.ppid }}
            className="entity-short-info"
            route="/entity-details"
        >
            <>
                {entity.featured ? (
                    <img
                        src="./images/star.svg"
                        alt=""
                        className="featured-indicator"
                    />
                ) : (
                    <div className="non-featured-aligner" />
                )}
                <div className="info-box">
                    <p className="entity-name">{entity.name}</p>
                    {entity.type == "company" ? (
                        <>
                            <div className="entity-location">
                                <p className="location-name">
                                    {entity.location
                                        ? `${
                                              entity.location.city
                                                  ? entity.location.city + ","
                                                  : ""
                                          } ${entity.location.countryCode}, `
                                        : null}
                                    <span
                                        className={`circle ${entity.jurisdiction}`}
                                    ></span>
                                    {entity.jurisdiction || null}
                                </p>
                            </div>
                            <div className="entity-category">
                                <p className="category-name">
                                    {entity.industryCategory
                                        ? entity.industryCategory.name[
                                              i18n.language
                                          ]
                                        : i18n.t("common:category.undisclosed")}
                                </p>
                            </div>
                        </>
                    ) : (
                        <></>
                    )}
                </div>
            </>
        </LinkButton>
    );
};

export default EntityShortInfo;
