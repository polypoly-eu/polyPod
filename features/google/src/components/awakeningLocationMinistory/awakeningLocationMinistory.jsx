import "./awakeningLocationMinistory.css";
import React from "react";

export const AwakeningLocationSummary = ({ dateData }) => {
    const date = Object.keys(dateData)[1];
    const data = Object.values(dateData)[1];

    return (
        <div className="awakening-location-ministory-summary">
            <p
                dangerouslySetInnerHTML={{
                    __html: "Google knows you woke up in",
                }}
            />
            <p className="highlighted-number">{data.location.locationName}</p>
            <p
                dangerouslySetInnerHTML={{
                    __html: `on the ${date}`,
                }}
            />
            <p
                dangerouslySetInnerHTML={{
                    __html: `Google has been with you for ${
                        Object.keys(dateData).length
                    } mornings.`,
                }}
            />
            {Object.keys(dateData).length === 0 ? null : (
                <>
                    <p className="highlighted-number">
                        {data.firstActivity.productName}
                    </p>
                    <p
                        dangerouslySetInnerHTML={{
                            __html: `Was the first activity Google registered you using at ${
                                data.firstActivity.timestamp.getHours() +
                                ":" +
                                data.firstActivity.timestamp.getMinutes()
                            }`,
                        }}
                    />
                </>
            )}
        </div>
    );
};
