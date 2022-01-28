import React from "react";

import i18n from "../../../i18n.js";
import StoriesInfoScreen from "../../../components/clusterStories/storiesInfoScreen.jsx";
import Infographic from "../../../components/infographic/infographic.jsx";

const TypesDataTypesInfo = () => {
    const typesDataTypesInfoContent = [
        <div className="base-info-padding">
            <p>{i18n.t("dataTypesInfoScreens:types.p1")}</p>
            <Infographic
                type="typesDataTypes"
                texts={{
                    textLabel: i18n.t("infographic:typesDataTypes.textLabel"),
                    boldLabel: i18n.t("infographic:typesDataTypes.boldLabel"),
                }}
            />
            <p
                dangerouslySetInnerHTML={{
                    __html: i18n.t(`commonInfoScreen:bubble.chart`),
                }}
            />
        </div>,
        <p className="base-info-padding">
            {i18n.t("dataTypesInfoScreens:p2")}
        </p>,
    ];
    return (
        <StoriesInfoScreen
            className="types-data-types-info"
            infoChildren={typesDataTypesInfoContent}
        />
    );
};

export default TypesDataTypesInfo;
