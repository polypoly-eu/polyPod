import React, { useContext } from "react";

import i18n from "../../../i18n.js";
import highlights from "../../../data/highlights.js";
import BaseInfoScreen from "../../../components/baseInfoScreen/baseInfoScreen.jsx";
import Infographic from "../../../components/infographic/infographic.jsx";
import { ExplorerContext } from "../../../context/explorer-context.jsx";

const CorrelationInfo = () => {
    const { selectedCompanyObject } = useContext(ExplorerContext);
    const company = selectedCompanyObject;
    return (
        <BaseInfoScreen
            className="correlation-info"
            headline={i18n.t("explorationCorrelationInfoScreen:headline")}
        >
            <div className="base-info-padding">
                <p>{i18n.t("explorationCorrelationInfoScreen:text.1")}</p>
                <Infographic
                    type="correlation"
                    texts={{
                        bold1: i18n.t("infographic:correlation.text1"),
                        bold2: i18n.t("infographic:correlation.text2"),
                        bold3: i18n.t("infographic:correlation.text3"),
                    }}
                />
                <p>
                    {
                        highlights[company.ppid].dataTypeCorrelation
                            .explanation[i18n.t("common:country.code")]
                    }
                </p>
            </div>
        </BaseInfoScreen>
    );
};

export default CorrelationInfo;
