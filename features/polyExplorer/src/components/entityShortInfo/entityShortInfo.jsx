import React from "react";
import "./entityShortInfo.css";
import LinkButton from "../buttons/linkButton/linkButton.jsx";

const EntityShortInfo = ({ entity }) => {
    const entityIcon = () => {
        if (entity.clusters?.includes("messenger"))
            return (
                <img
                    src="./images/messenger-grey.svg"
                    alt=""
                    className="featured-indicator"
                />
            );
        else if (entity.clusters?.includes("product"))
            return (
                <img
                    src="./images/product-grey.svg"
                    alt=""
                    className="featured-indicator"
                />
            );
        else if (entity.featured == true)
            return (
                <img
                    src="./images/star.svg"
                    alt=""
                    className="featured-indicator"
                />
            );
        else return <div className="non-featured-aligner" />;
    };

    return (
        <LinkButton
            stateChange={{ selectedEntity: entity.ppid }}
            className="entity-short-info"
            route="/entity-details"
        >
            <>
                {entityIcon()}
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
                                    {entity.industryCategoryName()}
                                </p>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="entity-owner">
                                {entity.productOwnerEnumeration()}
                            </div>
                        </>
                    )}
                </div>
            </>
        </LinkButton>
    );
};

export default EntityShortInfo;
