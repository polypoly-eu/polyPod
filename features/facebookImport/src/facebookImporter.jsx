import React, { useContext } from "react";
import * as ReactDOM from "react-dom";
import {
    MemoryRouter as Router,
    Navigate,
    Routes,
    Route,
} from "react-router-dom";

import {
    FacebookProvider,
    FacebookContext,
} from "./context/facebook-context.jsx";
import {
    PolyImportContext,
    PolyImportProvider,
    ErrorPopup,
    LoadingOverlay,
} from "@polypoly-eu/poly-look";
import { dataImporters } from "./model/importer.js";
import FacebookAccount from "./model/entities/facebook-account.js";
import i18n from "!silly-i18n";

import Overview from "./views/overview/overview.jsx";
import ImportView from "./views/import/import.jsx";
import ExploreView from "./views/explore/explore.jsx";
import ExploreDetails from "./views/explore/details.jsx";
import computeReportStories from "./views/report/compute-stories.js";
import ReportView from "./views/report/report.jsx";
import ReportDetails from "./views/report/details.jsx";

import "./styles.css";

const FacebookImporter = () => {
    const { pod, globalError, setGlobalError, isLoading, popUp, closePopUp } =
        useContext(FacebookContext);
    const { account, files } = useContext(PolyImportContext);
    const initialRoute = files?.length > 0 ? "/overview" : "/import";
    const reportStories = computeReportStories(account);
    return (
        <div className="facebook-importer poly-theme poly-theme-dark">
            {isLoading && (
                <LoadingOverlay
                    loadingGif="./images/loading.gif"
                    message={i18n.t("common:loading")}
                ></LoadingOverlay>
            )}
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
                        element={<ExploreDetails />}
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
            {popUp &&
                popUp.component({
                    onClose: closePopUp,
                })}
            {globalError && (
                <ErrorPopup
                    error={globalError}
                    onClose={() => setGlobalError(null)}
                    text={{
                        title: i18n.t("errorPopup:title"),
                        instructionsIntro: i18n.t(
                            "errorPopup:instructions.intro"
                        ),
                        instructionsSteps: i18n.t(
                            "errorPopup:instructions.steps"
                        ),
                        instructionsClosing: i18n.t(
                            "errorPopup:instructions.closing"
                        ),
                    }}
                />
            )}
        </div>
    );
};

//Router and context
const FacebookImporterApp = () => {
    return (
        <Router>
            <FacebookProvider>
                <PolyImportProvider
                    parentContext={FacebookContext}
                    dataImporters={dataImporters}
                    DataAccount={FacebookAccount}
                >
                    <div className="poly-nav-bar-separator-overlay" />
                    <FacebookImporter />
                </PolyImportProvider>
            </FacebookProvider>
        </Router>
    );
};

//render to html
ReactDOM.render(<FacebookImporterApp />, document.getElementById("feature"));
