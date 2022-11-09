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
    FacebookProvider,
    FacebookContext,
} from "./context/facebook-context.jsx";
import {
    INITIAL_HISTORY_STATE,
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
import ReportWrapper from "./views/report/reportWrapper.jsx";
import BaseInfoPopUp from "./popUps/baseInfoPopUp.jsx";
import "./styles.css";

const FacebookImporter = () => {
    const { pod, globalError, setGlobalError, isLoading, popUp } =
        useContext(FacebookContext);

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
                <LoadingOverlay
                    loadingGif="./images/loading.gif"
                    message={i18n.t("common:loading")}
                ></LoadingOverlay>
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
                    <ReportWrapper />
                </Switch>
            )}
            {popUp && <BaseInfoPopUp />}
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
