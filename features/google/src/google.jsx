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
import i18n from "../../facebookImport/src/i18n.js";
import ExploreView from "./views/explore.jsx";

const Google = () => {
    const { pod, isLoading } = useContext(GoogleContext);

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
        <div className="google poly-theme poly-theme-dark">
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
                </Switch>
            )}
            {isLoading && (
                <LoadingOverlay
                    loadingGif="./images/loading.gif"
                    message={i18n.t("common:loading")}
                />
            )}
        </div>
    );
};

//Router and context
const GoogleApp = () => {
    //global history object
    const history = useHistory();

    return (
        <Router history={history}>
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
