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

import Overview from "./views/overview/overview.jsx";
import ImportView from "./views/import/import.jsx";

import "./styles.css";

const FacebookImporter = () => {
    const { pod, navigationState, importSteps } = useContext(ImporterContext);
    const importStatus = navigationState.importStatus;

    const renderSplash = () => {
        return <p>Loading ...</p>;
    };

    return (
        <div className="facebook-importer">
            {pod ? (
                <Switch>
                    <Route exact path="/">
                        {importStatus == importSteps.finished ? (
                            <Redirect to={{ pathname: "/overview" }} />
                        ) : (
                            <Redirect to={{ pathname: "/import" }} />
                        )}
                    </Route>
                    <Route exact path="/overview">
                        <Overview />
                    </Route>
                    <Route exact path="/import">
                        <ImportView />
                    </Route>
                </Switch>
            ) : (
                renderSplash()
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
