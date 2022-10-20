import React, { useContext } from "react";
import * as ReactDOM from "react-dom";
import {
    BrowserRouter as Router,
    Routes,
    Navigate,
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
    INITIAL_HISTORY_STATE,
    LoadingOverlay,
} from "@polypoly-eu/poly-look";
import GoogleAccount from "./model/google-account.js";
import { dataImporters } from "./model/importer.js";
import i18n from "!silly-i18n";
import ExploreView from "./views/explore/explore.jsx";
import DetailsView from "./views/explore/details.jsx";
import ReportWrapper from "./views/report/reportWrapper.jsx";
import BasePopUp from "./popUps/base.jsx";

const Google = () => {
    const { pod, isLoading, popUp } = useContext(GoogleContext);

    const { files } = useContext(PolyImportContext);

    const navigate = useNavigate();

    function determineRoute() {
        if (files.length > 0) return navigate("/overview");
        // <Route
        //     render={() => (
        //         <Navigate
        //             to={{
        //                 pathname: "/overview",
        //                 state: INITIAL_HISTORY_STATE,
        //             }}
        //         />
        //     )}
        // />
        else return navigate("/import");
        // <Route
        //     render={() => <Navigate to={{ pathname: "/import" }} />}
        // />
    }

    return (
        <div className="google poly-theme poly-theme-dark">
            {pod && files && (
                <Routes>
                    <Route index element={determineRoute()} />
                    <Route exact path="/overview" element={<Overview />} />
                    <Route exact path="/import" element={<ImportView />} />
                    <Route exact path="/explore" element={<ExploreView />} />
                    <Route
                        exact
                        path="/explore/details"
                        element={<DetailsView />}
                    />
                    {/* <ReportWrapper /> */}
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
