import React, { useContext } from "react";

import i18n from "../../../i18n.js";
import highlights from "../../../data/highlights.js";
import BaseInfoPopUp from "../baseInfoPopUp/baseInfoPopUp.jsx";
import Infographic from "../../../components/infographic/infographic.jsx";
import { ExplorerContext } from "../../../context/explorer-context.jsx";

const CorrelationInfo = () => {
    const { selectedEntityObject } = useContext(ExplorerContext);
    const entity = selectedEntityObject;
    return (
        <BaseInfoPopUp
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
                        highlights[entity.ppid].dataTypeCorrelation.explanation[
                            i18n.t("common:country.code")
                        ]
                    }
                </p>
            </div>
        </BaseInfoPopUp>
    );
};

export default CorrelationInfo;
