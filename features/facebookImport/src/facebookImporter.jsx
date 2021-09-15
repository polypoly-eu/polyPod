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

import "./components/facebook-import.js";
import "./components/explore-view.js";
import "./components/import-view.js";
import "./components/report-view.js";
import "./components/overview-view.js";

import ErrorPopup from "./components/errorPopup/errorPopup.jsx";
import Overview from "./views/overview/overview.jsx";
import ImportView from "./views/import/import.jsx";
import ExploreView from "./views/explore/explore.jsx";
import ReportView from "./views/report/report.jsx";
import ExploreDetails from "./views/explore/details.jsx";

import "./styles.css";

const FacebookImporter = () => {
    const { pod, navigationState, importSteps, globalError, setGlobalError } =
        useContext(ImporterContext);
    const importStatus = navigationState.importStatus;

    const renderSplash = () => {
        return <p>Loading ...</p>;
    };

    function determineRoute() {
        if (importStatus == importSteps.loading) return renderSplash();
        if (importStatus == importSteps.finished)
            return <Redirect to={{ pathname: "/overview" }} />;
        else return <Redirect to={{ pathname: "/import" }} />;
    }

    return (
        <div className="facebook-importer">
            {pod ? (
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
                </Switch>
            ) : (
                renderSplash()
            )}
            {globalError && (
                <ErrorPopup
                    error={globalError}
                    onClose={() => setGlobalError(null)}
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
                <FacebookImporter />
            </ImporterProvider>
        </Router>
    );
};

//render to html
ReactDOM.render(<FacebookImporterApp />, document.getElementById("feature"));
