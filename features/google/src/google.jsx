import React, { useContext, useEffect } from "react";
import * as ReactDOM from "react-dom";
import {
    MemoryRouter as Router,
    Routes,
    Route,
    useNavigate,
} from "react-router-dom";

import {
    GoogleContext,
    GoogleContextProvider,
} from "./context/google-context.jsx";

import Overview from "./views/overview/overview.jsx";
import ImportView from "./views/import/import.jsx";

import "./styles.css";
import {
    PolyImportContext,
    PolyImportProvider,
    LoadingOverlay,
} from "@polypoly-eu/poly-look";
import GoogleAccount from "./model/google-account.js";
import { dataImporters } from "./model/importer.js";
import i18n from "!silly-i18n";
import ExploreView from "./views/explore/explore.jsx";
import DetailsView from "./views/explore/details.jsx";
import BasePopUp from "./popUps/base.jsx";

const Google = () => {
    const { pod, isLoading, popUp } = useContext(GoogleContext);

    const { files } = useContext(PolyImportContext);

    const navigate = useNavigate();

    function determineRoute() {
        if (files.length > 0) return navigate("/overview");
        else return navigate("/import");
    }

    useEffect(() => {
        if (pod && files) determineRoute();
    }, [pod, files]);

    return (
        <div className="google poly-theme poly-theme-dark">
            {pod && files && (
                <Routes>
                    <Route index />
                    <Route exact path="/overview" element={<Overview />} />
                    <Route exact path="/import" element={<ImportView />} />
                    <Route exact path="/explore" element={<ExploreView />} />
                    <Route
                        exact
                        path="/explore/details"
                        element={<DetailsView />}
                    />
                </Routes>
            )}
            {isLoading && (
                <LoadingOverlay
                    loadingGif="./images/loading.gif"
                    message={i18n.t("common:loading")}
                />
            )}
            {popUp?.name && <BasePopUp />}
        </div>
    );
};

//Router and context
const GoogleApp = () => {
    return (
        <Router>
            <GoogleContextProvider>
                <PolyImportProvider
                    parentContext={GoogleContext}
                    dataImporters={dataImporters}
                    DataAccount={GoogleAccount}
                >
                    <div className="poly-nav-bar-separator-overlay" />
                    <Google />
                </PolyImportProvider>
            </GoogleContextProvider>
        </Router>
    );
};

//render to html
ReactDOM.render(<GoogleApp />, document.getElementById("feature"));
