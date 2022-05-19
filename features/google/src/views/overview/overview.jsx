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
import i18n from "!silly-i18n";
import { analyzeFile } from "@polypoly-eu/poly-analysis";
import { specificAnalyses } from "../../model/analyses/analyses";
import {
    BUBBLE_VIZ_WIDTH,
    BUBBLE_VIZ_HEIGHT,
    BUBBLE_LIGHT_COLOR,
} from "../../constants/bubbleViz";
import { GoogleContext } from "../../context/google-context.jsx";

const Overview = () => {
    const { account, handleRemoveFile, files, refreshFiles } =
        useContext(PolyImportContext);
    const { setPopUp, closePopUp } = useContext(GoogleContext);
    const history = useHistory();

    const onRemoveFile = () => {
        if (!files && files.length > 0) return;
        handleRemoveFile(files[0]?.id);
        refreshFiles();
        history.push("/import");
        closePopUp();
    };
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
                textColor={BUBBLE_LIGHT_COLOR}
                onBubbleClick={() =>
                    history.push("/explore", INITIAL_HISTORY_STATE)
                }
            />
            <PolyButton
                label="Remove File"
                onClick={() =>
                    setPopUp({
                        name: "dialog",
                        title: "Do you really want to delete the file?",
                        backButton: { text: "Back", onClick: closePopUp },
                        proceedButton: {
                            text: "Proceed",
                            onClick: onRemoveFile,
                        },
                    })
                }
                type="outline"
            ></PolyButton>
            <RoutingWrapper history={history} route="/explore">
                <PolyButton label="Explore"></PolyButton>
            </RoutingWrapper>
        </Screen>
    );
};

export default Overview;
