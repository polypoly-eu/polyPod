import React from "react";
import { Infographic } from "@polypoly-eu/poly-look";
import i18n from "!silly-i18n";

const DataStructure = () => {
    return (
        <>
            <p>{i18n.t("dataStructureInfoScreen:text1")}</p>
            <Infographic
                imageSrc="./images/infographic/sankeyChart.svg"
                legend={[
                    i18n.t("dataStructureInfoScreen:legend-item1"),
                    i18n.t("dataStructureInfoScreen:legend-item2"),
                    i18n.t("dataStructureInfoScreen:legend-item3"),
                ]}
            />

            <p
                dangerouslySetInnerHTML={{
                    __html: i18n.t("commonInfoScreen:bubble.chart"),
                }}
            />
            <div className="poly-separator separator-space"></div>
            <h1 className="about-title">
                {i18n.t("commonInfoScreen:baseInfo.title2")}
            </h1>
            <p>{i18n.t("dataStructureInfoScreen:text2")}</p>
        </>
    );
};

export default DataStructure;
