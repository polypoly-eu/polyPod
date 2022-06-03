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
    WhatsAppContext,
    WhatsAppContextProvider,
} from "./context/whats-app-context.jsx";

import Overview from "./views/overview/overview.jsx";
import ImportView from "./views/import/import.jsx";

import "./styles.css";
import {
    PolyImportContext,
    PolyImportProvider,
    INITIAL_HISTORY_STATE,
    LoadingOverlay,
} from "@polypoly-eu/poly-look";
import WhatsAppAccount from "./model/whats-app-account.js";
import { dataImporters } from "./model/importer.js";
import i18n from "!silly-i18n";
import ExploreView from "./views/explore/explore.jsx";
import DetailsView from "./views/explore/details.jsx";
import BasePopUp from "./popUps/base.jsx";

const WhatsApp = () => {
    const { pod, isLoading, popUp } = useContext(WhatsAppContext);

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
        <div className="whats-app poly-theme poly-theme-dark">
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
                        <DetailsView />
                    </Route>
                </Switch>
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
const WhatsAppApp = () => {
    //global history object
    const history = useHistory();

    return (
        <Router history={history}>
            <WhatsAppContextProvider>
                <PolyImportProvider
                    parentContext={WhatsAppContext}
                    dataImporters={dataImporters}
                    DataAccount={WhatsAppAccount}
                >
                    <div className="poly-nav-bar-separator-overlay" />
                    <WhatsApp />
                </PolyImportProvider>
            </WhatsAppContextProvider>
        </Router>
    );
};

//render to html
ReactDOM.render(<WhatsAppApp />, document.getElementById("feature"));
