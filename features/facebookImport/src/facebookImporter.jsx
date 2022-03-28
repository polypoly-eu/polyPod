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

import { ErrorPopup } from "@polypoly-eu/poly-look";
import Overview from "./views/overview/overview.jsx";
import ImportView from "./views/import/import.jsx";
import ExploreView from "./views/explore/explore.jsx";
import ReportView from "./views/report/report.jsx";
import ExploreDetails from "./views/explore/details.jsx";
import ReportDetails from "./views/report/details.jsx";
import DataStructureInfoScreen from "./views/infoScreens/dataStructureInfoScreen/dataStructureInfoScreen.jsx";
import ActivitiesInfoScreen from "./views/infoScreens/activitiesInfoScreen/activitiesInfoScreen.jsx";
import MessagesInfoScreen from "./views/infoScreens/messagesInfoScreen/messagesInfoScreen.jsx";
import PicturesInfoScreen from "./views/infoScreens/picturesInfoScreen/picturesInfoScreen.jsx";
import PostReactionInfoScreen from "./views/infoScreens/postReactionInfoScreen/postReactionInfoScreen.jsx";
import OnOffFacebookInfoScreen from "./views/infoScreens/onOffFacebookInfoScreen/onOffFacebookInfoScreen.jsx";
import OffFacebookInfoScreen from "./views/infoScreens/onOffFacebookInfoScreen/offFacebookInfoScreen.jsx";
import Loading from "./components/loading/loading.jsx";

import "./styles.css";

import manifestData from "./static/manifest.json";
window.manifestData = manifestData;

import i18n from "./i18n.js";
import { INITIAL_HISTORY_STATE } from "../constants/constants.js";
import FileLoaderProvider from "./context/file-loader-context.jsx";

const FacebookImporter = () => {
    const { pod, files, globalError, setGlobalError, isLoading } =
        useContext(ImporterContext);

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
                    <Route exact path="/report/data-structure-info">
                        <DataStructureInfoScreen />
                    </Route>
                    <Route exact path="/report/pictures-info">
                        <PicturesInfoScreen />
                    </Route>
                    <Route exact path="/report/reaction-types-info">
                        <PostReactionInfoScreen />
                    </Route>
                    <Route exact path="/report/details">
                        <ReportDetails />
                    </Route>
                    <Route exact path="/report/details/activities-info">
                        <ActivitiesInfoScreen />
                    </Route>
                    <Route exact path="/report/details/messages-info">
                        <MessagesInfoScreen />
                    </Route>
                    <Route exact path="/report/details/on-off-facebook-info">
                        <OnOffFacebookInfoScreen />
                    </Route>
                    <Route exact path="/report/details/off-facebook-info">
                        <OffFacebookInfoScreen />
                    </Route>
                </Switch>
            )}
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
                <FileLoaderProvider>
                    <div className="poly-nav-bar-separator-overlay" />
                    <FacebookImporter />
                </FileLoaderProvider>
            </ImporterProvider>
        </Router>
    );
};

//render to html
ReactDOM.render(<FacebookImporterApp />, document.getElementById("feature"));
