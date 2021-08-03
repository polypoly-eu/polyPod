import React from "react";
import * as ReactDOM from "react-dom";
import {
    MemoryRouter as Router,
    Switch,
    Redirect,
    Route,
    useHistory,
} from "react-router-dom";

import "./components/facebook-import.js";
import "./components/explore-view.js";
import "./components/import-view.js";
import "./components/report-view.js";
import "./components/overview-view.js";

import {
    ImporterProvider,
    ImporterContext,
} from "./context/importer-context.jsx";

const FacebookImporter = () => {
    const handleImportFile = () => {
        console.log("import");
    };

    const handleRemoveFile = () => {
        console.log("remove");
    };

    const handleExploreFile = () => {
        console.log("explore");
    };

    return (
        <div className="facebook-importer">
            <Switch>
                <Route exact path="/">
                    <Redirect
                        to={{ pathname: "/main", state: navigationState }}
                    />
                </Route>
                <Route exact path="/main">
                    <overview-view
                        pod={pod}
                        files={files}
                        import-file={handleImportFile}
                        remove-file={handleRemoveFile}
                        explore-file={handleExploreFile}
                    ></overview-view>
                </Route>
            </Switch>
        </div>
    );
};

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

ReactDOM.render(
    <FacebookImporterApp />,
    document.getElementById("facebook-import")
);
