import React, { useContext } from "react";
import {
    LoadingOverlay,
    PolyButton,
    PolyImportContext,
    Screen,
} from "@polypoly-eu/poly-look";
import { useHistory } from "react-router-dom";
import i18n from "../../i18n";

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

    if (!account) {
        return (
            <LoadingOverlay
                loadingGif="./images/loading.gif"
                message={i18n.t("common:loading")}
            />
        );
    }

    return (
        <Screen className="overview" layout="standard-layout">
            <div className="footer">
                <div className="btn-holder">
                    {files && files?.[0] && (
                        <p>Imported File: {files[0].name}</p>
                    )}
                    <PolyButton
                        label="Remove File"
                        onClick={onRemoveFile}
                    ></PolyButton>
                </div>
            </div>
        </Screen>
    );
};

export default Overview;
