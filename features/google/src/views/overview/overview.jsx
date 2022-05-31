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

    const formatSize = (size) => {
        const k = 1024;
        const decimals = 2;
        if (size === 1) return i18n.t("common:format.byte");
        if (size < k) return `${size} ${i18n.t("common:format.bytes")}`;
        const units = [
            i18n.t("common:format.KB"),
            i18n.t("common:format.MB"),
            i18n.t("common:format.GB"),
        ];
        const i = Math.floor(Math.log(size) / Math.log(k));
        return Math.round(size / Math.pow(k, i), decimals) + " " + units[i - 1];
    };

    return (
        <Screen className="overview" layout="poly-standard-layout">
            <h1>{i18n.t("overview:your.google.data")}</h1>
            <p>
                {i18n.t("overview:analysed.categories", {
                    analysed_categories: bubbleData.length,
                })}
            </p>
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
            {files && files?.[0] && (
                <>
                    <p className="poly-small-print">
                        {i18n.t("overview:imported.file")} {files[0].name}
                        <br />
                        {i18n.t("overview:size")} {formatSize(files[0].size)}
                    </p>
                </>
            )}
            <PolyButton
                label={i18n.t("overview:import.new.file")}
                onClick={() =>
                    setPopUp({
                        name: "dialog",
                        title: i18n.t("overview:delete.file.confirmation"),
                        backButton: {
                            text: i18n.t("common:back"),
                            onClick: closePopUp,
                        },
                        proceedButton: {
                            text: i18n.t("common:proceed"),
                            onClick: onRemoveFile,
                        },
                    })
                }
                type="outline"
            ></PolyButton>
            <RoutingWrapper history={history} route="/explore">
                <PolyButton label={i18n.t("common:explore")}></PolyButton>
            </RoutingWrapper>
        </Screen>
    );
};

export default Overview;
