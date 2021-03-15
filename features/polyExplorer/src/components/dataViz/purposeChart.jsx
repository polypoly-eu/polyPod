import React from "react";

import i18n from "../../i18n.js";

const PurposeChart = () => {
    /*
    const getHighestCount = () => {
        console.log(typeof purposes);
        let highest = 0;
        purposes.forEach((e) => {
            e.count > highest ? (highest = e.count) : null;
        });
    };

    const calculateScaleValues = (highest) => {
        if (highest <= 80) {
        }
    };
*/
    //const scaleValues = calculateScaleValues(getHighestCount());

    //const scale = <div className="scale"></div>;

    return (
        <div className="purpose-chart">
            <div className="scale-container">
                <div className="descriptions">
                    <div>
                        {i18n.t(
                            "dataExplorationScreen:purposes.description.scale"
                        )}
                    </div>
                    <div className="fill"></div>
                    <div className="help">
                        <img src="./images/question-circle-light.svg" />
                        <div>{i18n.t("common:how-to-read")}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PurposeChart;
