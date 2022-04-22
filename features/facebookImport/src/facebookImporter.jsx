import React, { useContext } from "react";
import * as ReactDOM from "react-dom";
import {
    MemoryRouter as Router,
    Switch,
    Redirect,
    Route,
    useHistory,
} from "react-router-dom";

import {
    ImporterProvider,
    ImporterContext,
} from "./context/importer-context.jsx";
import {
    INITIAL_HISTORY_STATE,
    PolyAnalysisProvider,
    PolyImportContext,
    PolyImportProvider,
    ErrorPopup,
} from "@polypoly-eu/poly-look";
import { subAnalyses } from "./model/analysis";
import { dataImporters } from "./model/importer.js";
import FacebookAccount from "./model/entities/facebook-account.js";
import i18n from "./i18n.js";

import Overview from "./views/overview/overview.jsx";
import ImportView from "./views/import/import.jsx";
import ExploreView from "./views/explore/explore.jsx";
import ReportView from "./views/report/report.jsx";
import ExploreDetails from "./views/explore/details.jsx";
import ReportDetails from "./views/report/details.jsx";
import Loading from "./components/loading/loading.jsx";

import "./styles.css";

const FacebookImporter = () => {
    const { pod, globalError, setGlobalError, isLoading, popUp, closePopUp } =
        useContext(ImporterContext);

    const { files } = useContext(PolyImportContext);

    function determineRoute() {
        if (files.length > 0)
            return (
                <Redirect
                    to={{
                        pathname: "/overview",
                        state: INITIAL_HISTORY_STATE,
                    }}
                />
            );
        else return <Redirect to={{ pathname: "/import" }} />;
    }
    return (
        <div className="facebook-importer poly-theme poly-theme-dark">
            {isLoading && (
                <Loading
                    loadingGif="./images/loading.gif"
                    message={i18n.t("common:loading")}
                ></Loading>
            )}
            {pod && files && (
                <Switch>
                    <Route exact path="/">
                        {determineRoute()}
                    </Route>
                    <Route exact path="/overview">
                        <Overview />
                    </Route>
                    <Route exact path="/import">
                        <ImportView />
                    </Route>
                    <Route exact path="/explore">
                        <ExploreView />
                    </Route>
                    <Route exact path="/explore/details">
                        <ExploreDetails />
                    </Route>
                    <Route exact path="/report">
                        <ReportView />
                    </Route>
                    <Route exact path="/report/details">
                        <ReportDetails />
                    </Route>
                </Switch>
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
    //global history object
    const history = useHistory();

    return (
        <Router history={history}>
            <ImporterProvider>
                <PolyImportProvider
                    parentContext={ImporterContext}
                    dataImporters={dataImporters}
                    DataAccount={FacebookAccount}
                >
                    <PolyAnalysisProvider
                        parentContext={PolyImportContext}
                        subAnalyses={subAnalyses}
                    >
                        <div className="poly-nav-bar-separator-overlay" />
                        <FacebookImporter />
                    </PolyAnalysisProvider>
                </PolyImportProvider>
            </ImporterProvider>
        </Router>
    );
};

//render to html
ReactDOM.render(<FacebookImporterApp />, document.getElementById("feature"));
