import React, { useContext } from "react";
import * as ReactDOM from "react-dom";
import {
    MemoryRouter as Router,
    Navigate,
    Routes,
    Route,
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
import computeReportStories from "./views/report/compute-stories.js";
import ReportView from "./views/report/report.jsx";
import ReportDetails from "./views/report/details.jsx";
import BasePopUp from "./popUps/base.jsx";

const Google = () => {
    const { pod, isLoading, popUp } = useContext(GoogleContext);
    const { account, files } = useContext(PolyImportContext);
    const initialRoute = files?.length > 0 ? "/overview" : "/import";
    const reportStories = computeReportStories(account);
    return (
        <div className="google poly-theme poly-theme-dark">
            {pod && files && (
                <Routes>
                    <Route
                        index
                        element={<Navigate to={initialRoute} replace />}
                    />
                    <Route exact path="/overview" element={<Overview />} />
                    <Route exact path="/import" element={<ImportView />} />
                    <Route exact path="/explore" element={<ExploreView />} />
                    <Route
                        exact
                        path="/explore/details"
                        element={<DetailsView />}
                    />
                    <Route
                        exact
                        path="/report"
                        element={<ReportView reportStories={reportStories} />}
                    />
                    <Route
                        exact
                        path="/report/details"
                        element={
                            <ReportDetails reportStories={reportStories} />
                        }
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
