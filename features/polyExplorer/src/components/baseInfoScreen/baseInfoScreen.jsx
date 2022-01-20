import React, { useContext } from "react";
import { ExplorerContext } from "../../context/explorer-context.jsx";

import i18n from "../../i18n.js";
import SectionTitle from "../clusterStories/sectionTitle.jsx";
import Screen from "../screen/screen.jsx";

import "./baseInfoScreen.css";

const BaseInfoScreen = ({ className, headline, children }) => {
    const { handleBack } = useContext(ExplorerContext);
    return (
        <Screen className={className} light={true}>
            <div className="base-info">
                <div className="base-info-padding">
                    <SectionTitle title={headline} infoScreenSize={true} />
                </div>
                {children}
                <div className="base-info-padding">
                    <button onClick={() => handleBack()}>
                        {i18n.t("common:button.ok")}
                    </button>
                </div>
            </div>
        </Screen>
    );
};

export default BaseInfoScreen;
