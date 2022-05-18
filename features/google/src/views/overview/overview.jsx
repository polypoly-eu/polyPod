import React, { useContext, useEffect } from "react";
import {
    LoadingOverlay,
    PolyButton,
    PolyImportContext,
    RoutingWrapper,
    Screen,
    PolyChart,
    INITIAL_HISTORY_STATE,
} from "@polypoly-eu/poly-look";
import { useHistory } from "react-router-dom";
import i18n from "../../i18n";
import { analyzeFile } from "@polypoly-eu/poly-analysis";
import { specificAnalyses } from "../../model/analyses/analyses";
import {
    BUBBLE_VIZ_WIDTH,
    BUBBLE_VIZ_HEIGHT,
    BUBBLE_DARK_COLOR,
    BUBBLE_LIGHT_COLOR,
} from "../../constants/bubbleViz";

const Overview = () => {
    const { account, handleRemoveFile, files, refreshFiles } =
        useContext(PolyImportContext);
    const history = useHistory();

    function onRemoveFile() {
        if (!files && files.length > 0) return;
        handleRemoveFile(files[0]?.id);
        refreshFiles();
        history.push("/import");
    }
    useEffect(() => {
        if (!account) return;
        analyzeFile({
            zipData: files[0],
            dataAccount: account,
            specificAnalyses,
        });
    }, [account]);

    if (!account || files === null) {
        return (
            <LoadingOverlay
                loadingGif="./images/loading.gif"
                message={i18n.t("common:loading")}
            />
        );
    }

    const bubbleData = account.dataGroups.map(({ title, count }) => ({
        title,
        value: count,
    }));

    bubbleData.sort(function (a, b) {
        return b.value - a.value;
    });

    return (
        <Screen className="overview" layout="poly-standard-layout">
            {files && files?.[0] && <p>Imported File: {files[0].name}</p>}
            <PolyChart
                type="bubble-cluster"
                data={bubbleData}
                width={BUBBLE_VIZ_WIDTH}
                height={BUBBLE_VIZ_HEIGHT}
                bubbleColor={BUBBLE_LIGHT_COLOR}
                textColor={BUBBLE_DARK_COLOR}
                onBubbleClick={() =>
                    history.push("/explore", INITIAL_HISTORY_STATE)
                }
            />
            <PolyButton label="Remove File" onClick={onRemoveFile}></PolyButton>
            <RoutingWrapper history={history} route="/explore">
                <PolyButton label="Explore"></PolyButton>
            </RoutingWrapper>
        </Screen>
    );
};

export default Overview;
