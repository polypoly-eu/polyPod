import React from "react";
import PurposesBarChart from "../dataViz/purposesBarChart.jsx";
import PurposeInfoPopup from "../purposeInfoPopup/purposeInfoPopup.jsx";

export default function Purposes({ companies, setPopUp }) {
    const purposes = {};

    for (let company of companies) {
        for (let sharedPurpose of company.dataSharingPurposes) {
            const purpose = sharedPurpose["dpv:Purpose"];
            purposes[purpose]
                ? (purposes[purpose].count += sharedPurpose.count)
                : (purposes[purpose] = sharedPurpose);
        }
    }

    const data = Object.values(purposes)
        .sort((a, b) => b.count - a.count)
        .slice(0, 4)
        .map((purpose) => ({
            title: purpose["dpv:Purpose"],
            value: purpose.count,
            explanation: purpose.explanation,
            translation: purpose.translation,
        }));

    return (
        <div className="purposes">
            <PurposesBarChart
                data={data}
                animation={true}
                onClick={(purpose) =>
                    setPopUp({
                        component: PurposeInfoPopup,
                        props: { purpose },
                    })
                }
            />
        </div>
    );
}
