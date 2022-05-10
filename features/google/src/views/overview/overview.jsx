import React, { useContext, useEffect } from "react";
import {
    LoadingOverlay,
    PolyButton,
    PolyImportContext,
    RoutingWrapper,
    Screen,
} from "@polypoly-eu/poly-look";
import { useHistory } from "react-router-dom";
import i18n from "../../i18n";
import { analyzeFile } from "@polypoly-eu/poly-analysis";
import subAnalyses from "../../model/analyses/analyses";

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
            specificAnalyses: subAnalyses,
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

    if (!account) {
        return (
            <LoadingOverlay
                loadingGif="./images/loading.gif"
                message={i18n.t("common:loading")}
            />
        );
    }

    return (
        <Screen className="overview" layout="poly-standard-layout">
            {files && files?.[0] && <p>Imported File: {files[0].name}</p>}
            <PolyButton label="Remove File" onClick={onRemoveFile}></PolyButton>
            <RoutingWrapper history={history} route="/explore">
                <PolyButton label="Explore"></PolyButton>
            </RoutingWrapper>
        </Screen>
    );
};

export default Overview;
